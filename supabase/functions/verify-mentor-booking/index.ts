import { createClient } from "https://esm.sh/@supabase/supabase-js@2"; // <-- CHANGE THIS LINE


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface VerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-MENTOR-BOOKING] ${step}${detailsStr}`);
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Validate environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL"); // <-- CORRECTED NAME
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // <-- CORRECTED NAME
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID"); // This was already correct
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET"); // This was already correct

    if (!supabaseUrl || !supabaseKey || !razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Missing required environment variables for Supabase or Razorpay");
    }

    // Initialize Supabase client with retry logic
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: {
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          const maxRetries = 3;
          let lastError: unknown;

          for (let i = 0; i < maxRetries; i++) {
            try {
              return await fetch(input, init);
            } catch (error) {
              lastError = error;
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
          }
          throw lastError;
        }
      }
    });

    // Authenticate user with token validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);

    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Validate request body for Razorpay details
    if (!req.body) throw new Error("No request body provided");

    const requestData: VerificationRequest = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = requestData;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error("Missing Razorpay payment verification details");
    }
    logStep("Received Razorpay details", { razorpay_order_id, razorpay_payment_id });

    // --- Razorpay Signature Verification ---
    // Create the string to sign: order_id + '|' + payment_id
    const bodyToVerify = razorpay_order_id + '|' + razorpay_payment_id;

    // Convert secret to Uint8Array
    const secretBuffer = new TextEncoder().encode(razorpayKeySecret);
    // Convert body to Uint8Array
    const bodyBuffer = new TextEncoder().encode(bodyToVerify);

    // Import the HMAC key
    const key = await crypto.subtle.importKey(
      "raw",
      secretBuffer,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    // Sign the body
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      bodyBuffer
    );

    // Convert the signature to base64
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

    if (expectedSignature !== razorpay_signature) {
      logStep("Signature mismatch", { expectedSignature, receivedSignature: razorpay_signature });
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment verification failed: Signature mismatch"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400, // Bad Request or Unauthorized
        }
      );
    }
    logStep("Signature verified successfully");

    // Optional: Fetch payment details from Razorpay API for additional verification (e.g., amount, status)
    // This is a good practice to prevent tampering even if signature is valid
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const razorpayResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      }
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json();
      logStep("Razorpay API fetch failed", { status: razorpayResponse.status, error: errorData });
      throw new Error("Failed to retrieve payment details from Razorpay");
    }

    const paymentDetails = await razorpayResponse.json();
    logStep("Razorpay payment details fetched", { status: paymentDetails.status, amount: paymentDetails.amount / 100 });

    if (paymentDetails.status !== 'captured') {
      return new Response(
        JSON.stringify({
          success: false,
          status: paymentDetails.status,
          message: "Payment not captured by Razorpay"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Not an error, just not 'paid' yet
        }
      );
    }


    // Verify the booking exists and belongs to this user
    const { data: booking, error: bookingError } = await supabaseClient
      .from('mentor_bookings')
      .select('id, mentor_id, amount, status, metadata')
      .eq('razorpay_order_id', razorpay_order_id) // Use razorpay_order_id for lookup
      .eq('user_id', user.id)
      .single();

    if (bookingError) throw new Error(`Booking not found for order ID: ${bookingError.message}`);
    if (booking.status === 'paid') {
      logStep("Booking already marked as paid", { bookingId: booking.id });
      return new Response(
        JSON.stringify({
          success: true,
          status: 'paid',
          message: "Booking already confirmed"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Update the booking record with transaction
    const { error: updateError } = await supabaseClient
      .from('mentor_bookings')
      .update({
        status: 'paid',
        payment_received_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Update to Razorpay specific fields
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        metadata: {
          ...(booking.metadata as Record<string, unknown> || {}),
          razorpay_payment_details: {
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            method: paymentDetails.method,
            vpa: paymentDetails.vpa, // UPI details
            card_id: paymentDetails.card_id, // Card details
          }
        }
      })
      .eq('id', booking.id)
      .eq('user_id', user.id);

    if (updateError) throw new Error(`Failed to update booking: ${updateError.message}`);

    logStep("Payment verified and booking updated", { bookingId: booking.id });

    // Send confirmation (pseudo-code)
    try {
      await supabaseClient.functions.invoke('send-booking-confirmation', {
        body: {
          user_id: user.id,
          booking_id: booking.id,
          // Pass Razorpay IDs for confirmation if needed
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id
        }
      });
    } catch (emailError: unknown) {
      console.error("Failed to send confirmation:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'paid',
        bookingId: booking.id,
        mentorId: booking.mentor_id,
        amount: booking.amount,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        // Assuming receipt_url might come from Razorpay payment details if needed
        receiptUrl: paymentDetails.receipt // Check if Razorpay API provides this
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logStep("ERROR", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: Deno.env.get("NODE_ENV") === "development"
          ? (error instanceof Error ? error.stack : undefined)
          : undefined
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});