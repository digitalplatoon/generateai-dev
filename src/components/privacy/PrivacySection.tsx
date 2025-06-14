
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PrivacySectionProps {
  title: string;
  icon: LucideIcon;
  content: {
    subtitle: string;
    text: string;
  }[];
}

const PrivacySection = ({ title, icon: Icon, content }: PrivacySectionProps) => {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-gradient flex items-center">
          <Icon className="w-6 h-6 mr-3" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {content.map((item, itemIndex) => (
          <div key={itemIndex}>
            <h3 className="text-lg font-semibold text-white mb-3">{item.subtitle}</h3>
            <p className="text-light-gray leading-relaxed">{item.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PrivacySection;
