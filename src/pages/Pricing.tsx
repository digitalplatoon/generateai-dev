import { Check, Zap, Rocket, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1,000 AI tokens/month',
        'Basic chat features',
        'Community support',
        '5 RAG documents',
        'Public prompt library access'
      ],
      popular: false,
      cta: 'Start Free',
      link: '/auth'
    },
    {
      name: 'Developer',
      icon: Rocket,
      price: '$19.99',
      period: 'per month',
      description: 'For serious developers',
      features: [
        '50,000 AI tokens/month',
        'Advanced chat features',
        'Priority support',
        'Unlimited RAG documents',
        'API access',
        'Custom prompt templates',
        'Team collaboration (5 users)'
      ],
      popular: true,
      cta: 'Start 14-Day Trial',
      link: '/auth'
    },
    {
      name: 'Pro',
      icon: Building,
      price: '$49.99',
      period: 'per month',
      description: 'Maximum performance',
      features: [
        '200,000 AI tokens/month',
        'All chat features',
        '24/7 priority support',
        'Unlimited RAG documents',
        'Full API access',
        'Custom models',
        'Advanced analytics',
        'Team collaboration (20 users)',
        'SSO integration'
      ],
      popular: false,
      cta: 'Start 14-Day Trial',
      link: '/auth'
    },
    {
      name: 'Enterprise',
      icon: Building,
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      features: [
        'Unlimited AI tokens',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees',
        'On-premise deployment option',
        'Custom training',
        'Unlimited team members',
        'Advanced security features',
        'Custom contracts'
      ],
      popular: false,
      cta: 'Contact Sales',
      link: '/contact'
    }
  ];

  const faqItems = [
    { q: 'What are AI tokens?', a: 'AI tokens represent the amount of text processed by our AI models. Approximately 750 words equals 1,000 tokens. Your usage is tracked in real-time.' },
    { q: 'Can I upgrade or downgrade anytime?', a: 'Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing period.' },
    { q: 'What happens if I exceed my token limit?', a: "We'll notify you when you reach 80% and 100% of your limit. You can purchase additional tokens or upgrade your plan at any time." },
    { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.' },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SEOHead
        title="Pricing - Choose Your Plan | GenerateAI.dev"
        description="Transparent pricing for AI development tools. Start free, upgrade as you grow. From hobbyists to enterprises."
        keywords="AI pricing, developer tools pricing, subscription plans, API pricing"
        canonical="https://generateai.dev/pricing"
        schema={faqSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Start free, upgrade as you grow. No hidden fees. Cancel anytime.
            </p>
            
            <div className="flex justify-center gap-4 mb-12">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                ✓ 14-day free trial on paid plans
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                ✓ No credit card required
              </Badge>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-16 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`flex flex-col relative ${
                    plan.popular ? 'border-primary shadow-lg scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <plan.icon className="h-6 w-6 text-primary" />
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period !== 'contact us' && (
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to={plan.link}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What are AI tokens?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI tokens represent the amount of text processed by our AI models. Approximately 750 words equals 1,000 tokens. Your usage is tracked in real-time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I upgrade or downgrade anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing period.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens if I exceed my token limit?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We'll notify you when you reach 80% and 100% of your limit. You can purchase additional tokens or upgrade your plan at any time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-24 px-6">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join 15,600+ developers building with AI
                </p>
                <div className="flex justify-center gap-4">
                  <Button size="lg" asChild>
                    <Link to="/auth">Start Free Trial</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;
