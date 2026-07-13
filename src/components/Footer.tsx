
import { Code } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    Product: [
      { label: 'Learning Paths', href: '/paths' },
      { label: 'Prompt Library', href: '/prompts' },
      { label: 'RAG Lab', href: '/rag-lab' },
      { label: 'Agent Playground', href: '/agents' }
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Community', href: '/community' },
      { label: 'Blog', href: '/blog' }
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Subscription', href: '/subscription' }
    ]
  };

  return (
    <footer className="bg-card/80 border-t border-border py-16 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-display font-bold text-gradient">
                GenerateAI.dev
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your AI copilot for mastering generative AI development with interactive learning and production-ready tools.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/generateai_dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow GenerateAI.dev on X (Twitter)"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a
                href="https://dev.to/generateai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read GenerateAI.dev on dev.to"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.826 10.083a.784.784 0 00-.468-.175h-.701v4.198h.701a.786.786 0 00.469-.175c.155-.117.233-.292.233-.525v-2.798c.001-.233-.079-.408-.234-.525zM19.236 3H4.764C3.791 3 3.002 3.787 3 4.76v14.48c.002.973.791 1.76 1.764 1.76h14.473c.973 0 1.762-.787 1.763-1.76V4.76A1.765 1.765 0 0019.236 3zM9.195 13.414c0 .755-.466 1.901-1.942 1.898H5.389v-6.63h1.903c1.424 0 1.902 1.144 1.903 1.899l.001 2.833zm4.045-3.318h-2.184v1.503H12.5v1.253h-1.444v1.503h2.184v1.253h-2.523c-.485.013-.888-.371-.902-.856v-4.995c-.011-.483.371-.883.855-.896h2.57v1.235zm4.699 4.559c-.573 1.334-1.599 1.067-2.058 0l-1.665-6.208h1.469l1.225 4.687 1.219-4.687h1.468l-1.658 6.208z"/>
                </svg>
              </a>
              <a
                href="https://github.com/generateai-dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GenerateAI.dev on GitHub"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Code className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} GenerateAI.dev. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
