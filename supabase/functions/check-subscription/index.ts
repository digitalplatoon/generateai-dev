
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
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
      // Return default free subscription when Stripe is not configured
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
    logStep("User authenticated", { userId: user.id, email: user.email });

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
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      if (amount <= 2000) { // $20 or less
        subscriptionTier = "basic";
        planName = "Developer";
      } else if (amount <= 5000) { // $50 or less
        subscriptionTier = "premium";
        planName = "Pro";
      } else {
        subscriptionTier = "enterprise";
        planName = "Enterprise";
      }
      logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
    }

    // Update user subscription in database using SECURITY DEFINER function
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    
    // Return free plan on error
    return new Response(JSON.stringify({
      subscribed: true,
      subscription_tier: "free", 
      subscription_end: null,
      plan_name: "Starter",
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
