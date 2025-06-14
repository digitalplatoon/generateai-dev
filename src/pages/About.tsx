
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Lightbulb, Code, Database, Zap, Heart } from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { label: 'Active Developers', value: '50K+', icon: Users },
    { label: 'Learning Paths', value: '200+', icon: Target },
    { label: 'AI Projects Built', value: '10K+', icon: Code },
    { label: 'Community Members', value: '25K+', icon: Heart }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible in AI development education and tooling.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Our platform is built by developers, for developers, with community feedback at its core.'
    },
    {
      icon: Target,
      title: 'Practical Learning',
      description: 'Every feature is designed to provide hands-on, real-world AI development experience.'
    },
    {
      icon: Zap,
      title: 'Speed to Market',
      description: 'We help developers go from AI concept to production deployment faster than ever.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former ML engineer at Google. PhD in Computer Science from Stanford.',
      image: '/placeholder.svg'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-founder', 
      bio: 'Ex-principal architect at OpenAI. 15+ years in distributed systems.',
      image: '/placeholder.svg'
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Head of AI Research',
      bio: 'Former research scientist at DeepMind. Published 50+ papers in ML.',
      image: '/placeholder.svg'
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      bio: 'Product leader from Microsoft Azure AI. Expert in developer tools.',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-6 animate-slide-up">
            Democratizing AI Development
          </h1>
          <p className="text-xl text-light-gray max-w-3xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            GenerateAI.dev is the world's leading platform for learning, building, and deploying 
            generative AI applications. We're on a mission to make AI development accessible to every developer.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.4s'}}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-teal mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-light-gray text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="container mx-auto px-6 mb-16">
          <div className="flex justify-center mb-12">
            <div className="glass rounded-lg p-2">
              {['mission', 'values', 'team'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md capitalize font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-teal text-navy'
                      : 'text-light-gray hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Mission Tab */}
          {activeTab === 'mission' && (
            <div className="animate-slide-up">
              <div className="max-w-4xl mx-auto">
                <Card className="glass border-white/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-display text-gradient mb-4">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg text-light-gray mb-8 leading-relaxed">
                      We believe that generative AI will transform every industry, and developers are the key to unlocking this potential. 
                      Our mission is to provide the most comprehensive, practical, and accessible platform for learning and building with AI.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 text-teal mr-2" />
                          Our Vision
                        </h3>
                        <p className="text-light-gray">
                          A world where every developer has the tools, knowledge, and confidence to build 
                          intelligent applications that solve real problems and create meaningful impact.
                        </p>
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Database className="w-5 h-5 text-teal mr-2" />
                          Our Approach
                        </h3>
                        <p className="text-light-gray">
                          Hands-on learning combined with production-ready tools. We bridge the gap between 
                          AI theory and practical implementation through interactive experiences.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Values Tab */}
          {activeTab === 'values' && (
            <div className="animate-slide-up">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-display text-gradient text-center mb-12">Our Core Values</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {values.map((value, index) => (
                    <Card key={index} className="glass border-white/10 hover:border-teal/30 transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <value.icon className="w-6 h-6 text-teal mr-3" />
                          {value.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-light-gray">{value.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="animate-slide-up">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-display text-gradient text-center mb-12">Meet Our Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {team.map((member, index) => (
                    <Card key={index} className="glass border-white/10 text-center hover:border-teal/30 transition-all">
                      <CardHeader>
                        <div className="w-20 h-20 bg-gradient-to-br from-teal to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl font-bold text-navy">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <CardTitle className="text-white text-lg">{member.name}</CardTitle>
                        <p className="text-teal text-sm font-semibold">{member.role}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-light-gray text-sm">{member.bio}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 text-center">
          <Card className="glass border-white/10 max-w-4xl mx-auto">
            <CardContent className="py-12">
              <h2 className="text-3xl font-display text-gradient mb-6">Join Our Mission</h2>
              <p className="text-light-gray text-lg mb-8">
                Ready to be part of the AI revolution? Start building with GenerateAI.dev today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                  Start Learning
                </Button>
                <Button variant="outline" className="border-teal/30 text-teal hover:bg-teal/10">
                  View Careers
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
