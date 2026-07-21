import React, { useEffect, useRef, useState } from 'react';
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/');

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard handling: Escape closes menu, focus trap within mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus first item when menu opens
    firstMobileLinkRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navLinkClasses = (active: boolean) =>
    cn(
      "relative px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
      "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      active && "text-foreground"
    );

  const mobileLinkClasses = (active: boolean) =>
    cn(
      "flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active && "text-foreground bg-accent border-l-2 border-primary pl-[10px]"
    );

  return (
    <header className="bg-background/80 border-b border-border sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link
            to="/"
            className="flex items-center shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="GenerateAI home"
          >
            <EnhancedLogo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={navLinkClasses(active)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-3 right-3 -bottom-[13px] h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/seo-projects"
                aria-current={isActive('/seo-projects') ? 'page' : undefined}
                className={navLinkClasses(isActive('/seo-projects'))}
              >
                SEO Copilot
                {isActive('/seo-projects') && (
                  <span
                    aria-hidden="true"
                    className="absolute left-3 right-3 -bottom-[13px] h-0.5 bg-primary rounded-full"
                  />
                )}
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
                  <Button variant="ghost" className="h-9 w-9 p-0 rounded-full" aria-label="Open account menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="" />
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
              ref={mobileToggleRef}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="lg:hidden border-t border-border py-3 space-y-1"
          >
            <nav aria-label="Mobile primary" className="space-y-1">
              {navItems.map((item, idx) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    ref={idx === 0 ? firstMobileLinkRef : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={mobileLinkClasses(active)}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{item.badge}</Badge>
                      )}
                    </span>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to="/seo-projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActive('/seo-projects') ? 'page' : undefined}
                  className={mobileLinkClasses(isActive('/seo-projects'))}
                >
                  SEO Copilot
                </Link>
              )}
            </nav>
            <div className="border-t border-border pt-2 mt-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive('/dashboard') ? 'page' : undefined}
                    className={mobileLinkClasses(isActive('/dashboard'))}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive('/admin') ? 'page' : undefined}
                      className={mobileLinkClasses(isActive('/admin'))}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
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
