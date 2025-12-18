import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[NEWSLETTER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      logStep("ERROR: RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email } = await req.json();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      logStep("Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Processing subscription request");

    const resend = new Resend(resendKey);

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "GenerateAI.dev <newsletter@generateai.dev>",
      to: [email],
      subject: "Welcome to GenerateAI.dev Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #14b8a6; margin: 0; font-size: 28px;">Welcome to GenerateAI.dev!</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Thanks for subscribing to our newsletter!</p>
            <p style="font-size: 16px; margin-bottom: 20px;">You'll now receive:</p>
            <ul style="font-size: 15px; margin-bottom: 25px; padding-left: 20px;">
              <li style="margin-bottom: 8px;">🚀 Latest AI development tutorials</li>
              <li style="margin-bottom: 8px;">💡 Prompt engineering tips & tricks</li>
              <li style="margin-bottom: 8px;">🔧 RAG system best practices</li>
              <li style="margin-bottom: 8px;">📊 Industry insights & trends</li>
            </ul>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://generateai.dev/blog" style="display: inline-block; background: #14b8a6; color: #0f172a; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Explore Our Blog</a>
            </div>
            <p style="font-size: 14px; color: #64748b; margin-top: 30px; text-align: center;">
              You can unsubscribe at any time by clicking the link in our emails.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    logStep("Email sent successfully", { messageId: emailResponse.data?.id });

    return new Response(
      JSON.stringify({ success: true, message: "Successfully subscribed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: "Failed to process subscription" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
