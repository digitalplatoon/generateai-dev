
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, User, Globe, AlertTriangle, Scale, Calendar, Mail } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing and using GenerateAI.dev, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
        },
        {
          subtitle: 'Updates to Terms',
          text: 'We reserve the right to change these terms and conditions at any time. Your continued use of GenerateAI.dev following the posting of changes to these terms will be deemed your acceptance of those changes.'
        }
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: User,
      content: [
        {
          subtitle: 'Account Creation',
          text: 'To access certain features of our platform, you must create an account. You are responsible for safeguarding your account credentials and for all activities that occur under your account.'
        },
        {
          subtitle: 'Account Responsibilities',
          text: 'You agree to provide accurate and complete information when creating your account and to keep this information updated. You are solely responsible for all content and activity in your account.'
        },
        {
          subtitle: 'Account Termination',
          text: 'We reserve the right to suspend or terminate your account at any time if you violate these terms or engage in activities that could harm our platform or other users.'
        }
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      icon: Shield,
      content: [
        {
          subtitle: 'Permitted Uses',
          text: 'You may use our platform for lawful purposes only. This includes learning AI development, creating educational content, and building applications using our tools and resources.'
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You may not use our service to: distribute malware, engage in illegal activities, violate intellectual property rights, harass other users, or attempt to gain unauthorized access to our systems.'
        },
        {
          subtitle: 'Content Guidelines',
          text: 'All content you create or share must comply with applicable laws and regulations. We reserve the right to remove content that violates our community guidelines.'
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      icon: Globe,
      content: [
        {
          subtitle: 'Our Content',
          text: 'The service and its original content, features, and functionality are and will remain the exclusive property of GenerateAI.dev and its licensors. The service is protected by copyright, trademark, and other laws.'
        },
        {
          subtitle: 'User Content',
          text: 'You retain ownership of content you create using our platform. By using our service, you grant us a license to use, modify, and distribute your content as necessary to provide our services.'
        },
        {
          subtitle: 'Respect for IP',
          text: 'You must respect the intellectual property rights of others and may not use our platform to infringe on copyrights, trademarks, or other proprietary rights.'
        }
      ]
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      icon: AlertTriangle,
      content: [
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain high availability of our services, but cannot guarantee uninterrupted access. We are not liable for temporary interruptions or technical issues beyond our control.'
        },
        {
          subtitle: 'Damages Limitation',
          text: 'In no event shall GenerateAI.dev be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.'
        },
        {
          subtitle: 'Maximum Liability',
          text: 'Our total liability to you for all damages shall not exceed the amount you paid us in the twelve months preceding the claim, or $100, whichever is greater.'
        }
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: Scale,
      content: [
        {
          subtitle: 'Jurisdiction',
          text: 'These Terms shall be interpreted and governed by the laws of the State of California, without regard to its conflict of law provisions.'
        },
        {
          subtitle: 'Dispute Resolution',
          text: 'Any disputes arising from these terms or your use of our service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.'
        },
        {
          subtitle: 'Class Action Waiver',
          text: 'You agree that any arbitration or legal proceeding shall be limited to the dispute between us and you individually. You waive any right to participate in class actions or class-wide arbitration.'
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
            Terms of Service
          </h1>
          <p className="text-xl text-light-gray max-w-3xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Please read these terms carefully before using GenerateAI.dev. By using our platform, 
            you agree to be bound by these terms and conditions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-light-gray">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Last updated: December 14, 2024</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>Questions? Contact us at legal@generateai.dev</span>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
            <Card className="glass border-white/10">
              <CardContent className="py-8">
                <p className="text-light-gray leading-relaxed mb-4">
                  Welcome to GenerateAI.dev. These Terms of Service ("Terms") govern your use of our website, 
                  platform, and services. By accessing or using our service, you agree to be bound by these Terms.
                </p>
                <p className="text-light-gray leading-relaxed">
                  If you disagree with any part of these terms, then you may not access the service. 
                  These Terms apply to all visitors, users, and others who access or use the service.
                </p>
              </CardContent>
            </Card>

            {/* Terms Sections */}
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

            {/* Contact Information */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient flex items-center">
                  <Mail className="w-6 h-6 mr-3" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-gray leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-light-gray">
                  <p>Email: legal@generateai.dev</p>
                  <p>Address: 123 Innovation Street, Suite 100, San Francisco, CA 94105</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
