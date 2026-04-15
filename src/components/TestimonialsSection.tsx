import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "ML Engineer at Stripe",
    quote: "GenerateAI.dev cut our AI agent development time from weeks to days. The RAG Lab alone saved us hundreds of hours.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "CTO, AIStartup.io",
    quote: "The prompt library is incredible. We went from zero to a production chatbot in under a week using their battle-tested templates.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Full-Stack Developer",
    quote: "As someone new to AI, the learning paths gave me a clear roadmap. I built my first RAG system in 3 weeks.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Loved by <span className="text-gradient">Developers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers building production AI with GenerateAI.dev
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass border-border hover-glow transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-display font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {["Vercel", "Supabase", "Stripe", "Linear", "Notion"].map((company) => (
              <span key={company} className="text-lg font-display font-semibold text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
