
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';

export const PaymentStatusHandler: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { refreshSubscription } = useSubscription();
  
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. Welcome aboard!",
        variant: "default"
      });
      
      // Refresh subscription status after successful payment
      setTimeout(() => {
        refreshSubscription();
      }, 2000);
      
      // Clean up URL parameters
      setSearchParams({});
    } else if (canceled === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again anytime.",
        variant: "destructive"
      });
      
      // Clean up URL parameters
      setSearchParams({});
    }
  }, [searchParams, toast, refreshSubscription, setSearchParams]);

  return null; // This component doesn't render anything
};
