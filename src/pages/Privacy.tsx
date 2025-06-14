
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, Globe, FileText, Calendar, Mail } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FileText,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, subscribe to our service, participate in our community, or contact us for support. This may include your name, email address, username, and any other information you choose to provide.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect certain information about your use of our platform, including your IP address, browser type, operating system, pages viewed, time spent on pages, and other usage statistics to improve our service.'
        },
        {
          subtitle: 'Device Information',
          text: 'We may collect information about the devices you use to access our service, including hardware model, operating system version, unique device identifiers, and mobile network information.'
        }
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our AI development platform, including personalizing your learning experience and providing customer support.'
        },
        {
          subtitle: 'Communication',
          text: 'We may use your contact information to send you technical notices, updates, security alerts, and administrative messages related to your account and our services.'
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'We analyze usage patterns to understand how our platform is used, identify areas for improvement, and develop new features that better serve our community.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Users,
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with third-party service providers who assist us in operating our platform, conducting our business, or serving our users, provided they agree to keep this information confidential.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required to do so by law or if we believe that such action is necessary to comply with legal processes, protect our rights, or ensure the safety of our users.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to the same privacy protections outlined in this policy.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Encryption',
          text: 'All data transmission between your device and our servers is encrypted using industry-standard SSL/TLS protocols. Sensitive data is encrypted at rest using AES-256 encryption.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We maintain strict access controls and regularly audit access to personal data. Only authorized personnel with a legitimate business need can access your information.'
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      icon: Shield,
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us directly.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You can request a copy of your personal data in a structured, commonly used, and machine-readable format. We will provide this data within 30 days of your request.'
        },
        {
          subtitle: 'Deletion',
          text: 'You can request deletion of your personal information at any time. We will delete your data within 30 days, except where we are required to retain it for legal or business purposes.'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: Globe,
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies that are necessary for the operation of our platform, including authentication, security, and basic functionality cookies.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We use analytics cookies to understand how users interact with our platform, which helps us improve our services. You can opt out of these cookies through your browser settings.'
        },
        {
          subtitle: 'Third-Party Cookies',
          text: 'Our platform may include third-party services that set their own cookies. These are governed by the respective third parties\' privacy policies.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
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

        {/* Privacy Policy Content */}
        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
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

            {/* Policy Sections */}
            {sections.map((section, index) => (
              <Card key={section.id} className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient flex items-center">
                    <section.icon className="w-6 h-6 mr-3" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-white mb-3">{item.subtitle}</h3>
                      <p className="text-light-gray leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* International Users */}
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

            {/* Contact Information */}
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

            {/* Policy Updates */}
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
