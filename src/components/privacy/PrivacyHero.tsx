
import { Calendar, Mail } from 'lucide-react';

const PrivacyHero = () => {
  return (
    <section className="container mx-auto px-6 text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-6 animate-slide-up">
        Privacy Policy
      </h1>
      <p className="text-xl text-light-gray max-w-3xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
        Your privacy is important to us. This policy explains how we collect, use, and protect 
        your personal information when you use GenerateAI.dev.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-light-gray">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Last updated: December 14, 2024</span>
        </div>
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          <span>Questions? Contact us at privacy@generateai.dev</span>
        </div>
      </div>
    </section>
  );
};

export default PrivacyHero;
