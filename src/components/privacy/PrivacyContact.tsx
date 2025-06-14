
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const PrivacyContact = () => {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-gradient flex items-center">
          <Mail className="w-6 h-6 mr-3" />
          Contact Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-light-gray leading-relaxed mb-4">
          If you have any questions about this Privacy Policy or our privacy practices, please contact us:
        </p>
        <div className="space-y-2 text-light-gray">
          <p>Email: privacy@generateai.dev</p>
          <p>Address: 123 Innovation Street, Suite 100, San Francisco, CA 94105</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <p className="text-light-gray leading-relaxed mt-4">
          We will respond to your inquiry within 5 business days and work with you to resolve any privacy concerns.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrivacyContact;
