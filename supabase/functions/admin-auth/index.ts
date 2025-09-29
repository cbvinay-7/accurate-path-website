
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== Admin Auth Function Called ===')
  console.log('Method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Reading request body...')
    const body = await req.json()
    console.log('Request body parsed:', { email: body.email, hasPassword: !!body.password })
    
    const { email, password } = body

    if (!email || !password) {
      console.log('Missing credentials')
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      urlValue: supabaseUrl
    })
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Creating Supabase client...')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Querying admin_users table...')
    
    // First, let's check if the table exists and what data is there
    const { data: allAdmins, error: listError } = await supabase
      .from('admin_users')
      .select('*')
    
    console.log('All admin users in database:', allAdmins)
    console.log('List error:', listError)

    // Now query for specific user
    const { data: adminData, error: dbError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    console.log('Admin user query result:', {
      found: !!adminData,
      error: dbError,
      adminId: adminData?.id,
      adminEmail: adminData?.email,
      hasPasswordHash: !!adminData?.password_hash
    })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Database error occurred' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!adminData) {
      console.log('No admin user found with email:', email)
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Found admin user, checking password...')
    
    // For now, let's try a simple string comparison to test
    // We'll also try bcrypt but fall back to string comparison if needed
    let isValidPassword = false;
    
    try {
      // Import bcrypt dynamically
      const bcrypt = await import("https://deno.land/x/bcrypt@v0.4.1/mod.ts")
      console.log('Bcrypt loaded, attempting comparison...')
      console.log('Password hash from DB:', adminData.password_hash?.substring(0, 20) + '...')
      
      isValidPassword = await bcrypt.compare(password, adminData.password_hash)
      console.log('Bcrypt comparison result:', isValidPassword)
      
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError)
      
      // Fallback: check if it's a plain text password (for testing)
      if (adminData.password_hash === password) {
        console.log('Plain text password match (fallback)')
        isValidPassword = true
      }
    }

    if (!isValidPassword) {
      console.log('Password verification failed')
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Authentication successful!')

    // Return admin user data (without password hash)
    const { password_hash, ...adminUser } = adminData
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        admin: adminUser 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('=== Function Error ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Authentication service error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
