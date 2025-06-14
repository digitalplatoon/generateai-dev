
import { Card, CardContent } from '@/components/ui/card';

const PrivacyIntroduction = () => {
  return (
    <Card className="glass border-white/10">
      <CardContent className="py-8">
        <p className="text-light-gray leading-relaxed mb-4">
          At GenerateAI.dev, we are committed to protecting your privacy and ensuring the security of your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>
        <p className="text-light-gray leading-relaxed">
          By using our services, you agree to the collection and use of information in accordance with this policy. 
          If you do not agree with our policies and practices, please do not use our services.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrivacyIntroduction;
