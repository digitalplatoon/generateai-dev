import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const ALLOWED_ORIGINS = [
  'https://generateai.dev',
  'https://www.generateai.dev',
  'https://generateai-dev.lovable.app',
  'https://preview--generateai-dev.lovable.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isLovablePreview = origin.match(/^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.lovable\.app$/);
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) || isLovablePreview ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
}

const checkoutRequestSchema = z.object({
  planId: z.string().uuid('Invalid plan ID format'),
  billingPeriod: z.enum(['monthly', 'yearly']).default('monthly'),
});

function validateOrigin(origin: string | null): string {
  if (!origin) return ALLOWED_ORIGINS[0];
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin.match(/^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.lovable\.app$/)) return origin;
  return ALLOWED_ORIGINS[0];
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("Missing Stripe secret key");
      return new Response(JSON.stringify({ error: "Stripe not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id });

    const rawBody = await req.json();
    const parseResult = checkoutRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      logStep("Validation failed", { errors: parseResult.error.errors });
      return new Response(JSON.stringify({ 
        error: "Invalid request parameters",
        details: parseResult.error.errors.map(e => e.message)
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const { planId, billingPeriod } = parseResult.data;

    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("Creating new customer");
    }

    const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
    if (!price || price === 0) {
      throw new Error("Invalid plan pricing");
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `${plan.name} Plan`,
            },
            unit_amount: Math.round(price * 100),
            recurring: { 
              interval: billingPeriod === 'monthly' ? "month" : "year"
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${validateOrigin(req.headers.get("origin"))}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${validateOrigin(req.headers.get("origin"))}/subscription?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        billing_period: billingPeriod
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: "Failed to create checkout session. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
