
import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface StripeProviderWrapperProps {
  children: React.ReactNode;
}

export const StripeProviderWrapper: React.FC<StripeProviderWrapperProps> = ({ children }) => {
  const { toast } = useToast();

  // Error boundary for Stripe-related errors
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('stripe') || event.error?.message?.includes('payment')) {
        toast({
          title: "Payment System Error",
          description: "There was an issue with the payment system. Please try again later.",
          variant: "destructive"
        });
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [toast]);

  return <>{children}</>;
};
