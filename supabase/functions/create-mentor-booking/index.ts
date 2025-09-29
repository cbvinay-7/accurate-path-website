// In your index.ts file

// --- CHANGE THIS LINE ---
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"; // <-- CHANGE THIS LINE

interface BookingRequest {
  mentorId: string;
  amount: number;
  sessionDate?: string;
  sessionDuration?: number;
  notes?: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  [key: string]: unknown; // RazorpayOrder structure can have arbitrary additional properties
}

class BookingError extends Error {
  // Changed 'any' to 'unknown' for better type safety.
  // When accessing 'details', you'll need to narrow its type (e.g., with 'if (typeof details === "object" && details !== null)')
  constructor(message: string, public status = 400, public details?: unknown) {
  super(message);
 }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Changed 'any' to 'Record<string, unknown>' for the 'data' parameter,
// which is a good type for arbitrary key-value logging data.
const log = (level: 'info' | 'error' | 'warn', message: string, data?: Record<string, unknown>) => {
    const logData = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
};
 console.log(JSON.stringify(logData));
};

const validateEnv = () => {
  const requiredVars = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET"
];

const missing = requiredVars.filter(v => !Deno.env.get(v));
  if (missing.length) {
    throw new BookingError(`Missing environment variables: ${missing.join(', ')}`, 500);
}
};

const validateBookingRequest = (data: BookingRequest) => {
  if (!data.mentorId) throw new BookingError("Mentor ID is required");
  if (!data.amount || data.amount <= 0) throw new BookingError("Amount must be greater than 0");

  if (data.sessionDate) {
    const sessionDate = new Date(data.sessionDate);
  if (isNaN(sessionDate.getTime())) throw new BookingError("Invalid session date");
  if (sessionDate < new Date()) throw new BookingError("Session date cannot be in the past");
}

  if (data.sessionDuration && (data.sessionDuration < 30 || data.sessionDuration > 240)) {
    throw new BookingError("Session duration must be between 30 and 240 minutes");
}
};

  const createRazorpayOrder = async (data: {
    keyId: string;
    keySecret: string;
    amount: number;
    userId: string;
    mentorId: string;
    mentorName: string;
    sessionDate?: string;
    sessionDuration?: number;
}) => {
  const idempotencyKey = crypto.randomUUID();
  const orderData = {
    amount: Math.round(data.amount * 100), // Razorpay expects amount in paise
    currency: "INR",
    // --- UPDATED RECEIPT GENERATION FOR MENTOR BOOKINGS ---
    // Use truncated mentorId and a short random string for uniqueness
    receipt: `mentor_${data.mentorId.substring(0, 8)}_${crypto.randomUUID().substring(0, 8)}`,
    notes: {
      user_id: data.userId,
      mentor_id: data.mentorId,
      mentor_name: data.mentorName,
      session_date: data.sessionDate || '',
      session_duration: data.sessionDuration?.toString() || '60'
  },
  payment_capture: 1
};
const auth = btoa(`${data.keyId}:${data.keySecret}`);
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
      "X-Razorpay-Account": data.keyId,
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    // Error data can be highly variable from external APIs, 'unknown' is appropriate here.
    const errorData: unknown = await response.json();
    log('error', 'Razorpay API error', { errorData: errorData as Record<string, unknown> }); // Cast for log function
    throw new BookingError("Payment service unavailable", 503, {
      provider: 'razorpay',
      // Safely access properties of errorData if you know their potential shape,
      // otherwise, you might need type assertions or checks here.
      code: typeof errorData === 'object' && errorData !== null && 'error' in errorData &&
            typeof (errorData as Record<string, unknown>).error === 'object' &&
            (errorData as Record<string, unknown>).error !== null &&
            'code' in ((errorData as Record<string, unknown>).error as Record<string, unknown>)
            ? ((errorData as Record<string, unknown>).error as Record<string, unknown>).code : undefined
    });
  }

  return {
    order: await response.json() as RazorpayOrder,
    idempotencyKey
  };
};

// --- MAIN SERVER LOGIC ---
// Explicitly type 'req' as Request to resolve 'implicitly has an any type' error
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    log('info', 'Booking process started');
    validateEnv();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Authentication
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) throw new BookingError("Authorization required", 401);

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) throw new BookingError("Invalid credentials", 401);
    log('info', 'User authenticated', { userId: user.id });

    // Request validation
    if (!req.body) throw new BookingError("Request body required", 400);
    const requestData: BookingRequest = await req.json();
    log('info', 'Received mentor booking request data', { mentorId: requestData.mentorId, amount: requestData.amount }); // This log line is already here
    validateBookingRequest(requestData);

    // Database transaction
    log('info', 'Attempting to fetch mentor', { queryId: requestData.mentorId }); // NEW LOG
    const { data: mentor, error: mentorError } = await supabase
      .from('mentors')
      .select('id, name, price, is_available, min_duration, max_duration')
      .eq('id', requestData.mentorId)
      .single();

    // Detailed error checking and logging for mentor fetch
    if (mentorError) {
      log('error', 'Supabase mentor fetch error', { errorMessage: mentorError.message, errorDetails: mentorError.details, errorCode: mentorError.code, queryId: requestData.mentorId }); // NEW LOG
      throw new BookingError(`Mentor not found or DB error: ${mentorError.message}`, 404, { dbError: mentorError }); // Modified error message
    }
    if (!mentor) {
      log('error', 'Mentor data is null after successful query (unexpected)', { queryId: requestData.mentorId }); // NEW LOG
      throw new BookingError("Mentor not found (unexpected null data)", 404); // Modified error message
    }

    if (!mentor.is_available) throw new BookingError("Mentor not available", 403);

    // Validate against mentor's pricing and duration constraints
    if (mentor.price && requestData.amount < mentor.price) {
      throw new BookingError(`Amount must be at least ${mentor.price}`);
    }

    if (requestData.sessionDuration) {
      if (mentor.min_duration && requestData.sessionDuration < mentor.min_duration) {
        throw new BookingError(`Minimum duration is ${mentor.min_duration} minutes`);
      }
      if (mentor.max_duration && requestData.sessionDuration > mentor.max_duration) {
        throw new BookingError(`Maximum duration is ${mentor.max_duration} minutes`);
      }
    }

    // Check for existing bookings
    if (requestData.sessionDate) {
      const { count } = await supabase
        .from('mentor_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('mentor_id', requestData.mentorId)
        .eq('session_date', requestData.sessionDate)
        .neq('status', 'failed');

      if (count && count > 0) {
        throw new BookingError("You already have a booking with this mentor at this time", 409);
      }
    }

    // Create Razorpay order
    const { order: razorpayOrder, idempotencyKey } = await createRazorpayOrder({
      keyId: Deno.env.get("RAZORPAY_KEY_ID")!,
      keySecret: Deno.env.get("RAZORPAY_KEY_SECRET")!,
      amount: requestData.amount,
      userId: user.id,
      mentorId: requestData.mentorId,
      mentorName: mentor.name,
      sessionDate: requestData.sessionDate,
      sessionDuration: requestData.sessionDuration
    });

    // Create booking record
    const { error: insertError } = await supabase
      .from("mentor_bookings")
      .insert({
        user_id: user.id,
        mentor_id: requestData.mentorId,
        razorpay_order_id: razorpayOrder.id,
        amount: requestData.amount,
        session_date: requestData.sessionDate,
        session_duration: requestData.sessionDuration || 60,
        notes: requestData.notes,
        status: "pending",
        payment_provider: "razorpay",
        idempotency_key: idempotencyKey
      });

    if (insertError) {
      throw new BookingError("Failed to create booking", 500, { details: insertError });
    }

    // Async email notification (don't await)
    supabase.functions.invoke('send-booking-confirmation', {
      body: {
        user_email: user.email,
        mentor_name: mentor.name,
        session_date: requestData.sessionDate,
        order_id: razorpayOrder.id
      }
    }).catch(err => log('error', 'Email sending failed', { error: err.message }));

    return new Response(
      JSON.stringify({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount / 100, // Convert back to rupees
        currency: razorpayOrder.currency,
        keyId: Deno.env.get("RAZORPAY_KEY_ID"),
        mentorName: mentor.name,
        userEmail: user.email
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    const status = error instanceof BookingError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Internal server error";

    log('error', 'Booking failed', {
      error: message,
      status,
      stack: error instanceof Error ? error.stack : undefined,
      // Safely include details from BookingError
      ...(error instanceof BookingError && typeof error.details === 'object' && error.details !== null
          ? { details: error.details as Record<string, unknown> } // Cast to a known object type for logging
          : {})
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
        // Safely include details in the response
        ...(error instanceof BookingError && typeof error.details === 'object' && error.details !== null
            ? { details: error.details }
            : {})
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status,
      }
    );
  }
});