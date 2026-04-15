
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react';
import EnhancedLogo from '@/components/ui/EnhancedLogo';
import GlobalSearch from '@/components/search/GlobalSearch';

const Header = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin } = useAdminRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <EnhancedLogo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/paths" className="text-muted-foreground hover:text-primary transition-colors">
              Learning Paths
            </Link>
            <Link to="/prompts" className="text-muted-foreground hover:text-primary transition-colors">
              Prompts
            </Link>
            <Link to="/rag-lab" className="text-muted-foreground hover:text-primary transition-colors">
              RAG Lab
            </Link>
            <Link to="/agents" className="text-muted-foreground hover:text-primary transition-colors">
              Agents
            </Link>
            <Link to="/analytics" className="text-muted-foreground hover:text-primary transition-colors">
              Analytics
            </Link>
            <Link to="/enhanced-ai" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              Enhanced AI
              <Badge variant="secondary" className="text-xs">New</Badge>
            </Link>
            <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">
              Docs
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            {isAdmin && (
              <Link to="/seo-projects" className="text-muted-foreground hover:text-primary transition-colors">
                SEO Copilot
              </Link>
            )}
          </nav>

          {/* Search & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <GlobalSearch />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                      <AvatarFallback>{user.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full block">Dashboard</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="w-full block">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 bg-card border border-border rounded-md shadow-lg mt-2 py-2 w-48 z-50">
                <Link to="/paths" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Learning Paths
                </Link>
                <Link to="/prompts" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Prompts
                </Link>
                <Link to="/rag-lab" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  RAG Lab
                </Link>
                <Link to="/agents" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Agents
                </Link>
                <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Analytics
                </Link>
                 <Link to="/enhanced-ai" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  Enhanced AI
                  <Badge variant="secondary" className="text-xs">New</Badge>
                </Link>
                <Link to="/docs" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Docs
                </Link>
                {isAdmin && (
                  <Link to="/seo-projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                    SEO Copilot
                  </Link>
                )}
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors w-full text-left">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                      Sign In
                    </Link>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
