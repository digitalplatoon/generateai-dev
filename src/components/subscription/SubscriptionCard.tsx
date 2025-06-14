
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSelect?: (planId: string) => void;
  billingPeriod?: 'monthly' | 'yearly';
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  isCurrentPlan = false,
  onSelect,
  billingPeriod = 'monthly'
}) => {
  const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
  const period = billingPeriod === 'monthly' ? 'month' : 'year';

  const getTierIcon = () => {
    switch (plan.tier) {
      case 'free': return <Zap className="h-5 w-5" />;
      case 'basic': return <Star className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'enterprise': return <Crown className="h-5 w-5 text-yellow-500" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getTierColor = () => {
    switch (plan.tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const features = Object.entries(plan.features)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

  const limits = Object.entries(plan.limits)
    .map(([key, value]) => ({
      feature: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      limit: value === -1 ? 'Unlimited' : value.toString()
    }));

  return (
    <Card className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''} ${plan.tier === 'premium' ? 'border-purple-200' : ''}`}>
      {plan.tier === 'premium' && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-purple-500 text-white">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getTierIcon()}
          <Badge className={getTierColor()}>{plan.tier.toUpperCase()}</Badge>
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>
          <div className="text-3xl font-bold">
            {price === 0 ? 'Free' : `$${price}`}
            {price !== 0 && <span className="text-base font-normal">/{period}</span>}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Features</h4>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Usage Limits</h4>
          <ul className="space-y-1">
            {limits.map((limit, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span>{limit.feature}:</span>
                <span className="font-medium">{limit.limit}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan}
          onClick={() => onSelect?.(plan.id)}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
