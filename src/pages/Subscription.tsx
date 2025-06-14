
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { useStripeIntegration } from '@/hooks/useStripeIntegration';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import UsageDisplay from '@/components/subscription/UsageDisplay';
import { PaymentStatusHandler } from '@/components/subscription/PaymentStatusHandler';
import { StripeProviderWrapper } from '@/components/subscription/StripeProviderWrapper';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Settings, TrendingUp, Search, MessageSquare, RefreshCw } from 'lucide-react';

const Subscription: React.FC = () => {
  const { user, loading } = useAuthContext();
  const { currentSubscription, availablePlans, isLoading, refreshSubscription } = useSubscription();
  const { openCustomerPortal, checkSubscriptionStatus, isLoading: stripeLoading } = useStripeIntegration();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [refreshing, setRefreshing] = useState(false);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await checkSubscriptionStatus();
    await refreshSubscription();
    setRefreshing(false);
  };

  const yearlyDiscount = (monthlyPrice: number | null, yearlyPrice: number | null) => {
    if (!monthlyPrice || !yearlyPrice) return 0;
    const monthlyTotal = monthlyPrice * 12;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  };

  return (
    <StripeProviderWrapper>
      <PaymentStatusHandler />
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Unlock the full potential of AI-powered learning
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle">Monthly</Label>
            <Switch
              id="billing-toggle"
              checked={billingPeriod === 'yearly'}
              onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
            />
            <Label htmlFor="billing-toggle" className="flex items-center gap-2">
              Yearly
              <Badge variant="secondary" className="text-xs">Save up to 20%</Badge>
            </Label>
          </div>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Current Subscription</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshStatus}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Status
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{currentSubscription.plan_name}</p>
                  <p className="text-muted-foreground">
                    Status: <Badge>{currentSubscription.status}</Badge>
                  </p>
                  {currentSubscription.expires_at && (
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(currentSubscription.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {currentSubscription.tier !== 'free' && (
                  <Button 
                    variant="outline"
                    onClick={openCustomerPortal}
                    disabled={stripeLoading}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Display */}
        <UsageDisplay />

        {/* Available Plans */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Available Plans</h2>
            <p className="text-muted-foreground">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availablePlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={currentSubscription?.plan_name === plan.name}
                billingPeriod={billingPeriod}
              />
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Why Upgrade?
            </CardTitle>
            <CardDescription>
              Get more out of your AI learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Enhanced RAG Queries</h3>
                <p className="text-sm text-muted-foreground">
                  Process more documents and get better search results
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Advanced Chat Features</h3>
                <p className="text-sm text-muted-foreground">
                  Access to premium AI models and longer conversations
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Priority Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help when you need it with dedicated support
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StripeProviderWrapper>
  );
};

export default Subscription;
