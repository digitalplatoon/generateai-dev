
import { useParams, Link } from 'react-router-dom';
import { featuredPost, blogPosts as allPosts } from '@/data/blogPosts';
import SEOHead from '@/components/seo/SEOHead';
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import NotFound from './NotFound';
import { createBlogPostingSchema } from '@/components/seo/StructuredData';

const BlogPost = () => {
  const { slug } = useParams();
  const allBlogPosts = [featuredPost, ...allPosts];
  const post = allBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  const postUrl = `https://generateai.dev/blog/${post.slug}`;
  const articleSchema = createBlogPostingSchema(post, postUrl);
  const relatedPosts = allPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        keywords={post.tags?.join(', ')}
        image={post.image}
        type="article"
        canonical={postUrl}
        schema={articleSchema}
      />
      <div className="bg-navy text-white">
        <article>
          {/* Post Header */}
          <header className="pt-32 pb-16 px-6 text-center bg-white/5">
            <div className="container mx-auto">
              <span className="px-3 py-1 bg-teal/20 text-teal rounded-full text-sm mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 max-w-4xl mx-auto">
                {post.title}
              </h1>
              <div className="flex justify-center items-center space-x-4 text-sm text-light-gray">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Post Image */}
          <div className="container mx-auto -mt-8 px-6">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full max-w-5xl mx-auto h-auto md:h-[480px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Post Content */}
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-3xl mx-auto">
              <p className="text-light-gray text-lg leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="max-w-3xl mx-auto mt-8 flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                        <span
                        key={tag}
                        className="flex items-center text-sm text-light-gray bg-white/10 px-3 py-1 rounded-full"
                        >
                        <Tag className="w-4 h-4 mr-2" />
                        {tag}
                        </span>
                    ))}
                </div>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
            <section className="py-16 px-6 bg-white/5">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-display font-bold text-white text-center mb-12">Related Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPosts.map((relatedPost) => (
                            <article key={relatedPost.slug} className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-teal/50 transition-colors flex flex-col">
                                <div className="p-6 flex flex-col flex-grow">
                                    <span className="px-3 py-1 bg-teal/20 text-teal rounded-full text-sm mb-4 inline-block self-start">
                                        {relatedPost.category}
                                    </span>
                                    <h3 className="text-xl font-display font-semibold text-white mb-3 line-clamp-2 flex-grow">
                                        <Link to={`/blog/${relatedPost.slug}`} className="hover:text-teal transition-colors">{relatedPost.title}</Link>
                                    </h3>
                                    <p className="text-light-gray text-sm mb-4 line-clamp-3">
                                        {relatedPost.excerpt}
                                    </p>
                                    <Link to={`/blog/${relatedPost.slug}`} className="flex items-center text-teal hover:text-teal/80 transition-colors text-sm mt-auto">
                                        Read More
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* Back to Blog Button */}
        <div className="text-center py-16">
            <Link to="/blog" className="inline-flex items-center px-6 py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal/90 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
                Back to All Articles
            </Link>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
