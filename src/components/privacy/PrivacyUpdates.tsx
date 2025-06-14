
import { Card, CardContent } from '@/components/ui/card';

const PrivacyUpdates = () => {
  return (
    <Card className="glass border-white/10">
      <CardContent className="py-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-3">Policy Updates</h3>
        <p className="text-light-gray">
          We may update this Privacy Policy from time to time. We will notify you of any material changes 
          by posting the new policy on this page and updating the "Last updated" date. We encourage you to 
          review this policy periodically to stay informed about how we protect your information.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrivacyUpdates;
