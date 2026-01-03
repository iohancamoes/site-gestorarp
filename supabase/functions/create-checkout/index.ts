import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import Stripe from 'https://esm.sh/stripe@16.5.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // 1. Autenticação Manual (Obrigatório no Edge Functions)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  
  const token = authHeader.replace('Bearer ', '')
  
  // 2. Inicializar Supabase com Service Role Key para obter o usuário
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // 3. Inicializar Stripe com Chave Secreta
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
  if (!stripeSecretKey) {
    return new Response(JSON.stringify({ error: 'Stripe secret key not configured' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',
    httpClient: Stripe.createFetchHttpClient(),
  })

  try {
    const { planSlug } = await req.json()

    // 4. Buscar Price ID do plano no banco de dados (usando Service Role)
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('stripe_price_id')
      .eq('slug', planSlug)
      .single()

    if (planError || !planData?.stripe_price_id) {
      console.error('Error fetching plan:', planError)
      return new Response(JSON.stringify({ error: 'Plan not found or missing Stripe Price ID' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const priceId = planData.stripe_price_id
    
    // 5. Buscar Organization ID do usuário
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profileData?.organization_id) {
      console.error('Error fetching organization ID:', profileError)
      return new Response(JSON.stringify({ error: 'User is not associated with an organization' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const organizationId = profileData.organization_id
    
    // 6. Criar ou obter Stripe Customer ID
    let stripeCustomerId: string | undefined
    
    const { data: subData, error: subError } = await supabase
      .from('organization_subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', organizationId)
      .maybeSingle()

    if (subError) throw subError

    if (subData?.stripe_customer_id) {
      stripeCustomerId = subData.stripe_customer_id
    } else {
      // Criar novo cliente Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
          organization_id: organizationId,
        },
      })
      stripeCustomerId = customer.id
      
      // Atualizar o banco de dados com o novo Customer ID (usando Service Role)
      await supabase
        .from('organization_subscriptions')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('organization_id', organizationId)
    }

    // 7. Criar sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${Deno.env.get('SITE_URL')}/conta?success=true`,
      cancel_url: `${Deno.env.get('SITE_URL')}/precos?canceled=true`,
      metadata: {
        organization_id: organizationId,
      },
    })

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})