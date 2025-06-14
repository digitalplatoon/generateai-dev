
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Code, Search, BookOpen, Folder, ChevronDown, FileText, Users, Github, Newspaper } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Learning Paths', href: '/paths', icon: BookOpen },
    { label: 'Prompt Library', href: '/prompts', icon: Search },
    { label: 'RAG Lab', href: '/rag-lab', icon: Folder },
    { label: 'Agent Playground', href: '/agents', icon: Code }
  ];

  const resourceItems = [
    { label: 'Documentation', href: '/docs', icon: FileText, description: 'Complete guides and tutorials' },
    { label: 'API Reference', href: '/api', icon: Code, description: 'RESTful API endpoints' },
    { label: 'Community', href: '/community', icon: Users, description: 'Join our developer community' },
    { label: 'Blog', href: '/blog', icon: Newspaper, description: 'Latest updates and insights' }
  ];

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-teal to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-navy font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-display font-bold text-gradient">
              GenerateAI.dev
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <Link
                      to={item.href}
                      className="text-light-gray hover:text-teal transition-colors duration-300 flex items-center space-x-2 px-3 py-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuItem>
                ))}
                
                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-light-gray hover:text-teal transition-colors duration-300 bg-transparent">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] bg-navy/95 backdrop-blur-sm border border-white/10">
                      {resourceItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-teal focus:bg-white/10 focus:text-teal"
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <item.icon className="w-4 h-4 text-teal" />
                            <div className="text-sm font-medium leading-none text-white">
                              {item.label}
                            </div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-light-gray">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <Button 
                    onClick={handleAuthClick}
                    className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleAuthClick}
                      variant="outline" 
                      className="border-teal/30 text-teal hover:bg-teal/10"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={handleAuthClick}
                      className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                    >
                      Start Building
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-light"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="text-light-gray hover:text-teal transition-colors duration-300 flex items-center space-x-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Resources Section */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-white font-semibold mb-2">Resources</div>
                {resourceItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="text-light-gray hover:text-teal transition-colors duration-300 flex items-center space-x-2 py-2 pl-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                {!loading && (
                  <>
                    {user ? (
                      <Button 
                        onClick={handleAuthClick}
                        className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                      >
                        Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={handleAuthClick}
                          variant="outline" 
                          className="border-teal/30 text-teal hover:bg-teal/10"
                        >
                          Sign In
                        </Button>
                        <Button 
                          onClick={handleAuthClick}
                          className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                        >
                          Start Building
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
