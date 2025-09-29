// Deno Backend: create-project-payment.ts (Supabase Edge Function)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts"; // Updated Deno std lib version
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3"; // Updated Supabase-JS version

// Type definitions for better type safety
interface PurchaseRequest {
  projectId: string;
  amount: number; // Amount in your currency unit (e.g., INR, USD)
}

interface RazorpayOrderResponse {
  id: string;
  amount: number; // Amount in paise/sub-units from Razorpay
  currency: string;
  status: string;
  receipt: string;
  [key: string]: unknown; // Allow for other properties returned by Razorpay
}

// Custom error class to carry HTTP status codes and details
class PaymentError extends Error {
  constructor(message: string, public status: number = 500, public details?: unknown) {
    super(message);
    this.name = "PaymentError";
    // Ensure the prototype chain is correctly set for instanceof checks
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

// CORS headers for local development and production
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // IMPORTANT: Restrict this in production to your frontend URL
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper for consistent logging
const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

// The main Deno serve handler
Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // 1. Validate Environment Variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!supabaseUrl || !supabaseKey) {
      throw new PaymentError("Missing Supabase environment variables", 500);
    }
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new PaymentError("Missing Razorpay API credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET)", 500);
    }
    logStep("Environment variables checked");

    // 2. Initialize Supabase Client
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    logStep("Supabase client initialized");

    // 3. Authenticate User from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new PaymentError("No Authorization header provided", 401);
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user) {
      throw new PaymentError(`Authentication failed: ${userError?.message || 'User not found'}`, 401);
    }
    const user = userData.user;
    if (!user.id || !user.email) {
      throw new PaymentError("Authenticated user data is incomplete (missing ID or email)", 401);
    }
    logStep("User authenticated", { userId: user.id, userEmail: user.email });

    // 4. Validate Request Body
    if (!req.body) {
      throw new PaymentError("No request body provided", 400);
    }
    const requestData: PurchaseRequest = await req.json();
    const { projectId, amount } = requestData;

    if (!projectId || typeof amount !== 'number' || amount <= 0) {
      throw new PaymentError("Invalid request: projectId or amount is missing/invalid", 400);
    }
    logStep("Request body validated", { projectId, amount });

    // 5. Fetch Project Details
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('id, title, price') // Select only necessary fields
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      throw new PaymentError(`Project not found: ${projectError?.message || "unknown error"}`, 404);
    }
    logStep("Project details fetched", { projectId: project.id, projectTitle: project.title });

    // 6. Check for existing purchase attempts
    const { data: existingPurchase } = await supabaseClient
      .from('project_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .maybeSingle(); // Use maybeSingle to get null if no row found

    if (existingPurchase) {
      logStep("Project already purchased or pending purchase", { purchaseId: existingPurchase.id });
      throw new PaymentError("A purchase for this project already exists or is pending.", 409); // 409 Conflict
    }
    logStep("No existing purchase found, proceeding.");

    // 7. Create Razorpay Order
    // Razorpay expects amount in the smallest currency unit (e.g., paise for INR).
    // Ensure the `amount` from the frontend is in the major unit (e.g., rupees)
    // and convert it here.
    const amountInPaise = Math.round(amount * 100);

    const razorpayOrderPayload = {
      amount: amountInPaise,
      currency: "INR", // Assuming INR. Adjust if your projects support other currencies.
      receipt: `receipt_${projectId.substring(0, 8)}_${crypto.randomUUID().substring(0, 8)}`,
      notes: {
        user_id: user.id,
        project_id: projectId,
        project_title: project.title,
      },
      payment_capture: 1, // Automatically capture payment after successful authorization
    };
    logStep("Creating Razorpay order with payload", razorpayOrderPayload);

    const authString = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(razorpayOrderPayload),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text(); // Get raw text to avoid JSON parsing issues on error
      logStep("Razorpay API error response (raw)", { status: razorpayResponse.status, text: errorText });
      let parsedError: unknown = {};
      try {
        parsedError = JSON.parse(errorText); // Try parsing as JSON if it's valid
      } catch {
        parsedError = { message: "Non-JSON Razorpay error response", raw: errorText };
      }
      throw new PaymentError(`Failed to create Razorpay order: ${JSON.stringify(parsedError)}`, 
                             razorpayResponse.status, 
                             { provider: 'razorpay', originalError: parsedError });
    }

    const razorpayOrder: RazorpayOrderResponse = await razorpayResponse.json();
    logStep("Razorpay order created successfully", { razorpayOrderId: razorpayOrder.id });

    // 8. Create Pending Purchase Record in Supabase
    const { error: insertError } = await supabaseClient
      .from("project_purchases")
      .insert({
        user_id: user.id,
        project_id: projectId,
        razorpay_order_id: razorpayOrder.id,
        amount: amount, // Store the original amount (e.g., in rupees)
        status: "pending", // Payment is pending until Razorpay webhook confirms
      });

    if (insertError) {
      logStep("Failed to insert pending purchase record into DB", { error: insertError.message, details: insertError });
      throw new PaymentError(`Failed to record purchase: ${insertError.message}`, 500, { dbError: insertError });
    }
    logStep("Pending purchase record created in DB", { razorpayOrderId: razorpayOrder.id });

    // 9. Return Response to Frontend
    return new Response(
      JSON.stringify({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount, // Amount in paise, as expected by Razorpay.checkout.open()
        currency: razorpayOrder.currency,
        keyId: razorpayKeyId, // Essential for frontend
        projectTitle: project.title,
        userEmail: user.email,
        userName: user.user_metadata?.full_name || user.email.split('@')[0], // Assuming user_metadata might have a name
        userContact: user.phone || '' // Assuming user.phone might have contact info
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: unknown) {
    // Centralized error handling
    const status = error instanceof PaymentError ? error.status : 500;
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const errorDetails = error instanceof PaymentError ? error.details : undefined;

    logStep("ERROR in payment process", {
      message: errorMessage,
      status,
      stack: error instanceof Error ? error.stack : undefined,
      details: errorDetails,
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorDetails, // Include details for debugging on frontend (remove in production if sensitive)
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: status,
      }
    );
  }
});
