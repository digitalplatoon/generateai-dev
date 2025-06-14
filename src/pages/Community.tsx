
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, MessageCircle, Github, Twitter, Linkedin, Calendar } from "lucide-react";

const Community = () => {
  const communityStats = [
    { label: "Active Members", value: "12,500+", icon: Users },
    { label: "Projects Shared", value: "3,200+", icon: Github },
    { label: "Monthly Events", value: "15+", icon: Calendar },
    { label: "Discussion Topics", value: "8,900+", icon: MessageCircle }
  ];

  const channels = [
    {
      title: "Discord Community",
      description: "Join our active Discord server for real-time discussions, help, and collaboration.",
      icon: MessageCircle,
      members: "8,500+ members",
      link: "#discord"
    },
    {
      title: "GitHub Discussions",
      description: "Contribute to open discussions, report issues, and share your projects.",
      icon: Github,
      members: "2,100+ contributors",
      link: "#github"
    },
    {
      title: "Monthly Meetups",
      description: "Virtual and in-person meetups featuring expert talks and networking.",
      icon: Calendar,
      members: "500+ attendees",
      link: "#meetups"
    }
  ];

  const upcomingEvents = [
    {
      title: "AI Agent Workshop",
      date: "June 20, 2024",
      time: "2:00 PM PST",
      type: "Workshop"
    },
    {
      title: "Community Showcase",
      date: "June 25, 2024",
      time: "6:00 PM PST",
      type: "Showcase"
    },
    {
      title: "RAG Systems Deep Dive",
      date: "July 2, 2024",
      time: "3:00 PM PST",
      type: "Webinar"
    }
  ];

  return (
    <div className="min-h-screen bg-navy">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Join Our Community
          </h1>
          <p className="text-xl text-light-gray mb-8 max-w-3xl mx-auto">
            Connect with AI developers, share knowledge, and build the future of AI together. 
            Our vibrant community is here to support your journey.
          </p>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-teal mx-auto mb-4" />
                <div className="text-3xl font-display font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-light-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-16 px-6 bg-white/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">
            Community Channels
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {channels.map((channel, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <channel.icon className="w-8 h-8 text-teal mb-4" />
                <h3 className="text-xl font-display font-semibold text-white mb-3">
                  {channel.title}
                </h3>
                <p className="text-light-gray mb-4">{channel.description}</p>
                <p className="text-teal text-sm mb-4">{channel.members}</p>
                <a
                  href={channel.link}
                  className="inline-flex items-center px-4 py-2 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors"
                >
                  Join Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">
            Upcoming Events
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-6 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-light-gray">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-teal/20 text-teal rounded text-sm">
                      {event.type}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 border border-teal text-teal rounded-lg hover:bg-teal hover:text-navy transition-colors">
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 px-6 bg-white/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-8">
            Follow Us
          </h2>
          <div className="flex justify-center space-x-6">
            {[
              { icon: Twitter, label: "Twitter", href: "#twitter" },
              { icon: Github, label: "GitHub", href: "#github" },
              { icon: Linkedin, label: "LinkedIn", href: "#linkedin" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                <social.icon className="w-5 h-5" />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
