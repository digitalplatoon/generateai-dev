
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const PrivacyInternational = () => {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-gradient flex items-center">
          <Globe className="w-6 h-6 mr-3" />
          International Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">GDPR Compliance</h3>
          <p className="text-light-gray leading-relaxed">
            For users in the European Union, we comply with the General Data Protection Regulation (GDPR). 
            You have additional rights including the right to object to processing, data portability, and the right to lodge a complaint with supervisory authorities.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">CCPA Compliance</h3>
          <p className="text-light-gray leading-relaxed">
            For California residents, we comply with the California Consumer Privacy Act (CCPA). 
            You have the right to know what personal information we collect, the right to delete your information, and the right to opt-out of the sale of your information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyInternational;
