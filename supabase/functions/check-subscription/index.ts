
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGINS = [
  'https://generateai.dev',
  'https://www.generateai.dev',
  'https://generateai-dev.lovable.app',
  'https://preview--generateai-dev.lovable.app',
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

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("Missing Stripe secret key - returning free plan");
      return new Response(JSON.stringify({ 
        subscribed: true,
        subscription_tier: "free",
        subscription_end: null,
        plan_name: "Starter"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      
      if (customers.data.length === 0) {
        logStep("No customer found, returning free plan");
        return new Response(JSON.stringify({ 
          subscribed: true,
          subscription_tier: "free",
          subscription_end: null,
          plan_name: "Starter"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      const hasActiveSub = subscriptions.data.length > 0;
      let subscriptionTier = "free";
      let subscriptionEnd = null;
      let planName = "Starter";

      if (hasActiveSub) {
        const subscription = subscriptions.data[0];
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
        
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount <= 2000) {
          subscriptionTier = "basic";
          planName = "Developer";
        } else if (amount <= 5000) {
          subscriptionTier = "premium";
          planName = "Pro";
        } else {
          subscriptionTier = "enterprise";
          planName = "Enterprise";
        }
        logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
      }

      // Update user subscription in database
      const { error: upsertError } = await supabaseClient.rpc('upsert_user_subscription', {
        p_user_id: user.id,
        p_plan_id: subscriptions.data[0]?.metadata?.plan_id || null,
        p_status: hasActiveSub ? 'active' : 'canceled',
        p_stripe_subscription_id: hasActiveSub ? subscriptions.data[0].id : null,
        p_stripe_customer_id: customerId,
        p_current_period_start: hasActiveSub ? new Date(subscriptions.data[0].current_period_start * 1000).toISOString() : null,
        p_current_period_end: subscriptionEnd,
      });

      if (upsertError) {
        logStep("Database update error", upsertError);
      }

      logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
      
      return new Response(JSON.stringify({
        subscribed: hasActiveSub || subscriptionTier === "free",
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        plan_name: planName
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    
    // Return error state - do NOT grant access on failure
    return new Response(JSON.stringify({
      subscribed: false,
      subscription_tier: "free",
      subscription_end: null,
      plan_name: "Starter",
      error: "Unable to verify subscription status"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
