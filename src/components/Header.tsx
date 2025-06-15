import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
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

const Header = () => {
  const { user, signOut } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-dark-blue border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <EnhancedLogo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/paths" className="text-light-gray hover:text-teal transition-colors">
              Learning Paths
            </Link>
            <Link to="/prompts" className="text-light-gray hover:text-teal transition-colors">
              Prompts
            </Link>
            <Link to="/rag-lab" className="text-light-gray hover:text-teal transition-colors">
              RAG Lab
            </Link>
            <Link to="/agents" className="text-light-gray hover:text-teal transition-colors">
              Agents
            </Link>
            <Link to="/enhanced-ai" className="text-light-gray hover:text-teal transition-colors flex items-center gap-1">
              Enhanced AI
              <Badge variant="secondary" className="text-xs">New</Badge>
            </Link>
            <Link to="/docs" className="text-light-gray hover:text-teal transition-colors">
              Docs
            </Link>
          </nav>

          {/* User Menu / Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth" className="text-light-gray hover:text-teal transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-teal text-dark-blue rounded-md px-4 py-2 hover:bg-teal-600 transition-colors"
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
              className="text-light-gray focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 bg-dark-blue border border-gray-800 rounded-md shadow-lg mt-2 py-2 w-48 z-50">
                <Link to="/paths" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
                  Learning Paths
                </Link>
                <Link to="/prompts" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
                  Prompts
                </Link>
                <Link to="/rag-lab" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
                  RAG Lab
                </Link>
                <Link to="/agents" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
                  Agents
                </Link>
                 <Link to="/enhanced-ai" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors flex items-center gap-1">
                  Enhanced AI
                  <Badge variant="secondary" className="text-xs">New</Badge>
                </Link>
                <Link to="/docs" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
                  Docs
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
                      Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="block px-4 py-2 text-light-gray hover:text-teal transition-colors w-full text-left">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
                      Sign In
                    </Link>
                    <Link to="/auth" className="block px-4 py-2 text-light-gray hover:text-teal transition-colors">
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
