
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrivacyHero from '@/components/privacy/PrivacyHero';
import PrivacyIntroduction from '@/components/privacy/PrivacyIntroduction';
import PrivacySection from '@/components/privacy/PrivacySection';
import PrivacyInternational from '@/components/privacy/PrivacyInternational';
import PrivacyContact from '@/components/privacy/PrivacyContact';
import PrivacyUpdates from '@/components/privacy/PrivacyUpdates';
import { privacySections } from '@/data/privacySections';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90">
      <Header />
      
      <main className="pt-24 pb-16">
        <PrivacyHero />

        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <PrivacyIntroduction />

            {privacySections.map((section) => (
              <PrivacySection
                key={section.id}
                title={section.title}
                icon={section.icon}
                content={section.content}
              />
            ))}

            <PrivacyInternational />
            <PrivacyContact />
            <PrivacyUpdates />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
