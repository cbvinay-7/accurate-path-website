// Deno Backend: verify-project-payment.ts (Supabase Edge Function)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Custom error class for consistent error handling
class PaymentError extends Error {
  constructor(message: string, public status: number = 500, public details?: unknown) {
    super(message);
    this.name = "PaymentError";
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

interface VerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  // Optionally, you might pass user_id or project_id from frontend for extra checks
  userId?: string;
  projectId?: string;
}

// Helper for consistent logging
const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

// Helper function to convert ArrayBuffer to Hexadecimal string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature } = await req.json() as VerificationRequest;
    
    logStep("Received verification request", { paymentId, orderId, signature });

    if (!paymentId || !orderId || !signature) {
      throw new PaymentError("Payment ID, Order ID, and Signature are required", 400);
    }

    // Get Razorpay credentials
    const razorpaySecretKey = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    // >>> TEMPORARY DEBUG LINE: Log the actual value (REMOVE OR MASK IN PRODUCTION!) <<<
    console.log(`[DEBUG] RAZORPAY_KEY_SECRET fetched: ${razorpaySecretKey ? 'SET (Value hidden for security)' : 'NOT SET or EMPTY'}`); 
    // For even more detail during debugging (DANGEROUS IN PROD):
    // console.log(`[DEBUG] RAZORPAY_KEY_SECRET value: "${razorpaySecretKey}"`);


    if (!razorpaySecretKey) {
      throw new PaymentError("Razorpay secret key not configured in environment variables.", 500);
    }

    // --- Step 1: Verify payment signature ---
    logStep("Verifying payment signature");

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(razorpaySecretKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // The string to be signed is order_id + "|" + payment_id
    const payload = `${orderId}|${paymentId}`;
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );
    
    // Convert the ArrayBuffer to a Hexadecimal string for comparison with Razorpay's signature
    // --- THIS IS THE CRITICAL CHANGE ---
    const generatedSignature = bufferToHex(signatureBuffer);

    logStep("Signature comparison", { expected: generatedSignature, received: signature });

    if (generatedSignature !== signature) {
      throw new PaymentError(
        "Signature mismatch",
        400,
        { expectedSignature: generatedSignature, receivedSignature: signature }
      );
    }

    logStep("Signature verified successfully.");

    // --- Step 2: Fetch payment details from Razorpay API to confirm status ---
    logStep("Fetching payment details from Razorpay API");
    const basicAuth = btoa(`${Deno.env.get("RAZORPAY_KEY_ID")}:${razorpaySecretKey}`);

    const razorpayApiUrl = `https://api.razorpay.com/v1/payments/${paymentId}`;
    const razorpayResponse = await fetch(razorpayApiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error("Razorpay API fetch error:", errorData);
      throw new PaymentError("Failed to fetch payment details from Razorpay.", razorpayResponse.status, errorData);
    }

    const paymentDetails = await razorpayResponse.json();
    logStep("Razorpay payment details", paymentDetails);

    if (paymentDetails.status !== 'captured') {
        throw new PaymentError(`Payment status is not 'captured': ${paymentDetails.status}`, 400, paymentDetails);
    }

    // --- Step 3: Update database (Supabase) purchase record ---
    logStep("Updating purchase record in Supabase");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new PaymentError("User not authenticated or session invalid during verification.", 401, userError);
    }

    // Find the pending purchase record
    const { data: purchase, error: purchaseError } = await supabaseClient
      .from('project_purchases')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (purchaseError) {
      throw new PaymentError("Error fetching purchase record.", 500, purchaseError);
    }
    if (!purchase) {
      throw new PaymentError("Purchase record not found or does not match.", 404, { orderId, userId: userData.user.id });
    }
    if (purchase.status === 'paid') {
      logStep("Purchase already marked as paid, idempotent operation.");
      return new Response(JSON.stringify({ 
        success: true, 
        status: 'already_paid',
        message: "Payment already processed and verified.",
        purchaseId: purchase.id,
        projectId: purchase.project_id,
        amount: purchase.amount,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        receiptUrl: paymentDetails.receipt || null,
        downloadAvailable: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update the purchase record status to 'paid'
    const { error: updateError } = await supabaseClient
      .from('project_purchases')
      .update({
        status: 'paid',
        razorpay_payment_id: paymentId,
        // Optionally store more details from paymentDetails if needed
        metadata: {
            ...purchase.metadata, // Preserve existing metadata
            razorpay_details: {
                method: paymentDetails.method,
                bank: paymentDetails.bank,
                wallet: paymentDetails.wallet,
                vpa: paymentDetails.vpa,
                // Add any other relevant details you want to store
            }
        }
      })
      .eq('id', purchase.id);

    if (updateError) {
      throw new PaymentError("Failed to update purchase record status.", 500, updateError);
    }

    logStep("Purchase record updated to paid.");

    // --- Step 4: Perform post-payment actions (e.g., grant access, send email) ---
    logStep("Post-payment actions can be triggered here (e.g., granting download access, sending email).");

    return new Response(
      JSON.stringify({
        success: true,
        status: 'paid',
        message: "Payment successfully verified and purchase completed.",
        purchaseId: purchase.id,
        projectId: purchase.project_id,
        amount: purchase.amount,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        receiptUrl: paymentDetails.receipt || null,
        downloadAvailable: true
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: unknown) {
    // Centralized error handling for all catch blocks
    const status = error instanceof PaymentError ? error.status : 500;
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const errorDetails = error instanceof PaymentError ? error.details : undefined;

    logStep("ERROR in payment verification process", {
      message: errorMessage,
      status,
      stack: error instanceof Error ? error.stack : undefined,
      details: errorDetails,
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorDetails,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: status,
      }
    );
  }
});