import { useState } from "react";
import { Calendar, User, ArrowRight, Tag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import { featuredPost, blogPosts } from "@/data/blogPosts";
import { createBreadcrumbSchema } from "@/components/seo/StructuredData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const Blog = () => {
  const categories = ["All", "Tutorial", "Industry Insights", "Community", "Technical", "Education", "Ethics"];
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://generateai.dev" },
    { name: "Blog", url: "https://generateai.dev/blog" }
  ]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim() }
      });

      if (error) throw error;
      
      toast.success("Successfully subscribed! Check your email for confirmation.");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <SEOHead
        title="AI Development Blog - Insights & Tutorials | GenerateAI.dev"
        description="Stay updated with the latest insights, tutorials, and trends in AI development. Learn from experts and discover new techniques to enhance your AI projects."
        keywords="AI blog, AI development, machine learning tutorials, prompt engineering, RAG systems, AI agents"
        canonical="https://generateai.dev/blog"
        schema={breadcrumbSchema}
      />
      <div className="bg-navy">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                AI Development Blog
              </h1>
              <p className="text-xl text-light-gray max-w-3xl mx-auto">
                Stay updated with the latest insights, tutorials, and trends in AI development. 
                Learn from experts and discover new techniques to enhance your AI projects.
              </p>
            </div>

            {/* Featured Post */}
            <div className="bg-white/5 rounded-lg p-8 border border-white/10 mb-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-teal/20 text-teal rounded-full text-sm">
                      {featuredPost.category}
                    </span>
                    <span className="text-light-gray text-sm">Featured</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-light-gray mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-light-gray mb-6">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredPost.date}
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center px-6 py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
                <div className="relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 object-cover rounded-lg"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 px-6 bg-white/5">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white/10 text-light-gray rounded-lg hover:bg-teal hover:text-navy transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article key={index} className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-teal/50 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-teal/20 text-teal rounded-full text-sm">
                        {post.category}
                      </span>
                    </div>
                  
                    <h3 className="text-xl font-display font-semibold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                  
                    <p className="text-light-gray text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="flex items-center text-xs text-light-gray bg-white/5 px-2 py-1 rounded"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  
                    <div className="flex items-center justify-between text-xs text-light-gray mb-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                  
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-light-gray">{post.readTime}</span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-center text-teal hover:text-teal/80 transition-colors text-sm"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 px-6 bg-white/5">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-light-gray mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest AI development insights, 
              tutorials, and community updates.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubscribing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
