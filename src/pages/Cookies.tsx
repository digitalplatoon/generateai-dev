
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, BarChart, Shield, Globe, Calendar, Mail } from 'lucide-react';

const Cookies = () => {
  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      icon: Shield,
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: [
        'Authentication tokens to keep you logged in',
        'Security cookies to prevent CSRF attacks',
        'Session cookies to maintain your preferences',
        'Load balancing cookies for optimal performance'
      ],
      canDisable: false
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      icon: Settings,
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: [
        'Language preference settings',
        'Theme and display preferences',
        'Form auto-fill information',
        'Chat and support widget settings'
      ],
      canDisable: true
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: BarChart,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: [
        'Google Analytics tracking',
        'Page view and navigation patterns',
        'User engagement metrics',
        'Performance and error tracking'
      ],
      canDisable: true
    },
    {
      id: 'advertising',
      title: 'Advertising Cookies',
      icon: Globe,
      description: 'These cookies are used to deliver relevant advertisements and track campaign effectiveness.',
      examples: [
        'Targeted advertising preferences',
        'Social media integration cookies',
        'Remarketing and conversion tracking',
        'Third-party advertising networks'
      ],
      canDisable: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-6 animate-slide-up">
            Cookie Policy
          </h1>
          <p className="text-xl text-light-gray max-w-3xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            This Cookie Policy explains how GenerateAI.dev uses cookies and similar technologies 
            to recognize you when you visit our platform.
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

        {/* Cookie Policy Content */}
        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient flex items-center">
                  <Cookie className="w-6 h-6 mr-3" />
                  What are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-light-gray leading-relaxed">
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                  Cookies are widely used by website owners to make their websites work, work more efficiently, 
                  and to provide reporting information.
                </p>
                <p className="text-light-gray leading-relaxed">
                  We use cookies to enhance your experience on GenerateAI.dev, remember your preferences, 
                  and provide you with personalized content and features.
                </p>
              </CardContent>
            </Card>

            {/* Cookie Types */}
            {cookieTypes.map((cookieType, index) => (
              <Card key={cookieType.id} className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient flex items-center justify-between">
                    <div className="flex items-center">
                      <cookieType.icon className="w-6 h-6 mr-3" />
                      {cookieType.title}
                    </div>
                    <div className="flex items-center">
                      {cookieType.canDisable ? (
                        <span className="text-sm bg-teal/20 text-teal px-3 py-1 rounded-full">
                          Optional
                        </span>
                      ) : (
                        <span className="text-sm bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-light-gray leading-relaxed">{cookieType.description}</p>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Examples include:</h4>
                    <ul className="list-disc list-inside space-y-1 text-light-gray">
                      {cookieType.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Managing Cookies */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient flex items-center">
                  <Settings className="w-6 h-6 mr-3" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Browser Settings</h3>
                  <p className="text-light-gray leading-relaxed mb-4">
                    Most web browsers allow you to control cookies through their settings. You can usually find 
                    these settings in the "Options" or "Preferences" menu of your browser.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Popular Browsers:</h4>
                      <ul className="text-light-gray space-y-1">
                        <li>• Chrome: Settings → Privacy and Security → Cookies</li>
                        <li>• Firefox: Preferences → Privacy & Security</li>
                        <li>• Safari: Preferences → Privacy</li>
                        <li>• Edge: Settings → Cookies and Site Permissions</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Cookie Options:</h4>
                      <ul className="text-light-gray space-y-1">
                        <li>• Accept all cookies</li>
                        <li>• Block all cookies</li>
                        <li>• Block third-party cookies only</li>
                        <li>• Prompt before accepting cookies</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Platform Controls</h3>
                  <p className="text-light-gray leading-relaxed">
                    We provide cookie preference controls within our platform settings. You can access these 
                    by going to your account settings and selecting "Privacy Preferences" to customize your 
                    cookie settings specifically for GenerateAI.dev.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    <strong>Note:</strong> Disabling certain cookies may impact your experience on our platform. 
                    Essential cookies cannot be disabled as they are necessary for the website to function properly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient flex items-center">
                  <Globe className="w-6 h-6 mr-3" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-light-gray leading-relaxed">
                  We use several third-party services that may set their own cookies. These services help us 
                  provide better functionality and understand how our platform is used.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Analytics Services:</h4>
                    <ul className="text-light-gray space-y-1">
                      <li>• Google Analytics</li>
                      <li>• Mixpanel</li>
                      <li>• Hotjar</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Support Services:</h4>
                    <ul className="text-light-gray space-y-1">
                      <li>• Intercom</li>
                      <li>• Zendesk</li>
                      <li>• LiveChat</li>
                    </ul>
                  </div>
                </div>
                <p className="text-light-gray text-sm">
                  Each of these services has their own privacy policies and cookie practices. 
                  Please refer to their respective privacy policies for more information.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient flex items-center">
                  <Mail className="w-6 h-6 mr-3" />
                  Questions About Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-gray leading-relaxed mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="space-y-2 text-light-gray">
                  <p>Email: privacy@generateai.dev</p>
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

export default Cookies;
