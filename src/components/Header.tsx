import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import EnhancedLogo from '@/components/ui/EnhancedLogo';
import GlobalSearch from '@/components/search/GlobalSearch';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/paths', label: 'Learning Paths' },
  { to: '/prompts', label: 'Prompts' },
  { to: '/rag-lab', label: 'RAG Lab' },
  { to: '/agents', label: 'Agents' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/enhanced-ai', label: 'Enhanced AI', badge: 'New' },
  { to: '/docs', label: 'Docs' },
  { to: '/pricing', label: 'Pricing' },
];

const Header = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin } = useAdminRole();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/');

  return (
    <header className="bg-background/80 border-b border-border sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center shrink-0" aria-label="GenerateAI home">
            <EnhancedLogo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  isActive(item.to) && "text-foreground bg-accent"
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {item.badge}
                    </Badge>
                  )}
                </span>
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/seo-projects"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  isActive('/seo-projects') && "text-foreground bg-accent"
                )}
              >
                SEO Copilot
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <GlobalSearch />
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                      <AvatarFallback>{user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full block">Dashboard</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full block">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2">
            <GlobalSearch />
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  isActive(item.to) && "text-foreground bg-accent"
                )}
              >
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{item.badge}</Badge>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/seo-projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50">
                SEO Copilot
              </Link>
            )}
            <div className="border-t border-border pt-2 mt-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50">
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50">
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
