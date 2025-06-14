
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Users, Headphones, MapPin, Clock, Phone, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // You would typically send this to your backend
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'General Inquiries',
      description: 'For general questions about our platform',
      contact: 'hello@generateai.dev',
      responseTime: 'Within 24 hours'
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description: 'Need help with platform features?',
      contact: 'support@generateai.dev',
      responseTime: 'Within 12 hours'
    },
    {
      icon: Users,
      title: 'Partnerships',
      description: 'Interested in partnering with us?',
      contact: 'partnerships@generateai.dev',
      responseTime: 'Within 48 hours'
    },
    {
      icon: MessageSquare,
      title: 'Community',
      description: 'Join our developer community',
      contact: 'Discord Community',
      responseTime: 'Live chat available'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Innovation Street, Suite 100',
      zipCode: 'San Francisco, CA 94105',
      description: 'Our main headquarters and R&D center'
    },
    {
      city: 'Remote First',
      address: 'Distributed Team Worldwide',
      zipCode: 'Global Coverage',
      description: 'We operate as a remote-first company with team members across the globe'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with GenerateAI.dev?',
      answer: 'Simply create a free account and explore our learning paths. Start with our beginner-friendly courses and work your way up to advanced AI development topics.'
    },
    {
      question: 'Is there a free tier available?',
      answer: 'Yes! We offer a generous free tier that includes access to basic learning paths, community features, and limited API usage for experimentation.'
    },
    {
      question: 'Can I use GenerateAI.dev for commercial projects?',
      answer: 'Absolutely. Our Pro and Enterprise plans are designed for commercial use, with enhanced features, higher API limits, and dedicated support.'
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes, we work with enterprises to create custom AI development solutions, including private instances, custom integrations, and dedicated support.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-6 animate-slide-up">
            Get in Touch
          </h1>
          <p className="text-xl text-light-gray max-w-3xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Have questions about GenerateAI.dev? We're here to help. Reach out to our team 
            and we'll get back to you as soon as possible.
          </p>
        </section>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient flex items-center">
                    <Send className="w-6 h-6 mr-3" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-white font-semibold mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-navy/50 border border-white/20 rounded-lg text-white placeholder-light-gray focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-white font-semibold mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-navy/50 border border-white/20 rounded-lg text-white placeholder-light-gray focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company" className="block text-white font-semibold mb-2">
                          Company (Optional)
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-navy/50 border border-white/20 rounded-lg text-white placeholder-light-gray focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiryType" className="block text-white font-semibold mb-2">
                          Inquiry Type *
                        </label>
                        <select
                          id="inquiryType"
                          name="inquiryType"
                          required
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-navy/50 border border-white/20 rounded-lg text-white focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="enterprise">Enterprise Sales</option>
                          <option value="press">Press & Media</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-white font-semibold mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-navy/50 border border-white/20 rounded-lg text-white placeholder-light-gray focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                        placeholder="Brief subject of your inquiry"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-white font-semibold mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-navy/50 border border-white/20 rounded-lg text-white placeholder-light-gray focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal resize-vertical"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold py-3"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-gradient">Contact Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <method.icon className="w-6 h-6 text-teal flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-white mb-1">{method.title}</h3>
                        <p className="text-light-gray text-sm mb-2">{method.description}</p>
                        <p className="text-teal font-semibold text-sm">{method.contact}</p>
                        <p className="text-light-gray text-xs">{method.responseTime}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Office Locations */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-gradient flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Our Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-white mb-2">{office.city}</h3>
                      <p className="text-light-gray text-sm mb-1">{office.address}</p>
                      <p className="text-light-gray text-sm mb-2">{office.zipCode}</p>
                      <p className="text-light-gray text-xs">{office.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 mt-20">
          <h2 className="text-3xl font-display text-gradient text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass border-white/10">
                <CardContent className="py-6">
                  <h3 className="font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-light-gray">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
