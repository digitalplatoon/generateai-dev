import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Users, Coffee, Heart, Zap, Code, Brain } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const benefits = [
    {
      icon: Coffee,
      title: 'Flexible Schedule',
      description: 'Work when you\'re most productive with flexible hours and unlimited PTO.'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness stipend.'
    },
    {
      icon: Users,
      title: 'Remote First',
      description: 'Work from anywhere with optional co-working space allowances.'
    },
    {
      icon: Zap,
      title: 'Learning Budget',
      description: '$3,000 annual budget for conferences, courses, and professional development.'
    }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead development of our AI development platform using React, Node.js, and Python.',
      requirements: [
        '5+ years experience with React and TypeScript',
        'Experience with AI/ML APIs and frameworks',
        'Strong background in full-stack development',
        'Experience with cloud platforms (AWS, GCP, Azure)'
      ],
      responsibilities: [
        'Build and maintain core platform features',
        'Integrate AI models and APIs',
        'Collaborate with design and product teams',
        'Mentor junior developers'
      ]
    },
    {
      id: 2,
      title: 'Machine Learning Engineer',
      department: 'AI Research',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design and implement ML models for our AI development tools and educational content.',
      requirements: [
        'PhD or Masters in ML/AI/Computer Science',
        'Experience with PyTorch, TensorFlow, or JAX',
        'Strong background in NLP and generative AI',
        'Experience with MLOps and model deployment'
      ],
      responsibilities: [
        'Research and develop new AI capabilities',
        'Optimize model performance and efficiency',
        'Build ML infrastructure and pipelines',
        'Collaborate with product team on AI features'
      ]
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-time',
      description: 'Scale our infrastructure to support millions of developers building AI applications.',
      requirements: [
        '3+ years experience with Kubernetes and Docker',
        'Strong background in cloud infrastructure',
        'Experience with CI/CD pipelines',
        'Knowledge of monitoring and observability tools'
      ],
      responsibilities: [
        'Maintain and scale cloud infrastructure',
        'Implement security best practices',
        'Build deployment automation',
        'Monitor system performance and reliability'
      ]
    },
    {
      id: 4,
      title: 'Technical Content Creator',
      department: 'Education',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create engaging educational content about AI development for our learning platform.',
      requirements: [
        'Strong technical writing skills',
        'Experience with AI/ML development',
        'Ability to explain complex concepts simply',
        'Experience with video production is a plus'
      ],
      responsibilities: [
        'Create comprehensive learning paths',
        'Write technical tutorials and guides',
        'Develop interactive coding exercises',
        'Collaborate with subject matter experts'
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="Careers at GenerateAI.dev - Join Our Team"
        description="Explore career opportunities at GenerateAI.dev. Help us democratize AI development and shape the future of intelligent applications."
        keywords="careers, jobs, AI jobs, engineering jobs, remote work, tech careers"
        canonical="https://generateai.dev/careers"
      />
      <div className="bg-gradient-to-br from-navy via-navy/95 to-navy/90">
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-6 text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-6 animate-slide-up">
              Join Our Team
            </h1>
            <p className="text-xl text-light-gray max-w-3xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
              Help us democratize AI development and shape the future of how developers build intelligent applications.
              We're looking for passionate individuals who want to make AI accessible to everyone.
            </p>
          </section>

          {/* Company Culture */}
          <section className="container mx-auto px-6 mb-20">
            <h2 className="text-3xl font-display text-gradient text-center mb-12">Why Work With Us?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="glass border-white/10 text-center hover:border-teal/30 transition-all">
                  <CardHeader>
                    <benefit.icon className="w-12 h-12 text-teal mx-auto mb-4" />
                    <CardTitle className="text-white">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-light-gray text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Open Positions */}
          <section className="container mx-auto px-6 mb-20">
            <h2 className="text-3xl font-display text-gradient text-center mb-12">Open Positions</h2>
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Job List */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Card 
                        key={job.id} 
                        className={`glass border-white/10 cursor-pointer transition-all hover:border-teal/30 ${
                          selectedJob?.id === job.id ? 'border-teal ring-1 ring-teal/30' : ''
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="text-teal">{job.department}</span>
                            <span className="text-light-gray flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </span>
                            <span className="text-light-gray flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {job.type}
                            </span>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Job Details */}
                <div className="lg:col-span-2">
                  {selectedJob ? (
                    <Card className="glass border-white/10">
                      <CardHeader>
                        <CardTitle className="text-2xl text-gradient">{selectedJob.title}</CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-teal font-semibold">{selectedJob.department}</span>
                          <span className="text-light-gray flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {selectedJob.location}
                          </span>
                          <span className="text-light-gray flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {selectedJob.type}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">About the Role</h3>
                          <p className="text-light-gray">{selectedJob.description}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Key Responsibilities</h3>
                          <ul className="space-y-2">
                            {selectedJob.responsibilities.map((resp, index) => (
                              <li key={index} className="text-light-gray flex items-start">
                                <Code className="w-4 h-4 text-teal mr-2 mt-0.5 flex-shrink-0" />
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
                          <ul className="space-y-2">
                            {selectedJob.requirements.map((req, index) => (
                              <li key={index} className="text-light-gray flex items-start">
                                <Brain className="w-4 h-4 text-teal mr-2 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4">
                          <Button className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold w-full">
                            Apply for This Position
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="glass border-white/10 h-full flex items-center justify-center">
                      <CardContent className="text-center py-20">
                        <Users className="w-16 h-16 text-teal mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-white mb-2">Select a Position</h3>
                        <p className="text-light-gray">Click on any job listing to view details and requirements.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Application Process */}
          <section className="container mx-auto px-6">
            <Card className="glass border-white/10 max-w-4xl mx-auto">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-display text-gradient mb-6">Ready to Apply?</h2>
                <p className="text-light-gray text-lg mb-8 max-w-2xl mx-auto">
                  Don't see a perfect fit? We're always looking for exceptional talent. 
                  Send us your resume and tell us how you'd like to contribute to democratizing AI development.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                    View All Positions
                  </Button>
                  <Button variant="outline" className="border-teal/30 text-teal hover:bg-teal/10">
                    General Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
};

export default Careers;
