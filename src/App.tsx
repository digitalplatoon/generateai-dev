
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import EnhancedAI from "./pages/EnhancedAI";
import LearningPaths from "./pages/LearningPaths";
import PromptLibrary from "./pages/PromptLibrary";
import RagLab from "./pages/RagLab";
import AgentPlayground from "./pages/AgentPlayground";
import Documentation from "./pages/Documentation";
import ApiReference from "./pages/ApiReference";
import Prompts from "./pages/Prompts";
import Pricing from "./pages/Pricing";
import RagLabFunctional from "./pages/RagLabFunctional";
import AgentsFunctional from "./pages/AgentsFunctional";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Subscription from "./pages/Subscription";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import SitemapXml from "./pages/SitemapXml";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <GoogleAnalytics />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-dark">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/enhanced-ai" element={<ProtectedRoute><EnhancedAI /></ProtectedRoute>} />
                  <Route path="/paths" element={<LearningPaths />} />
                  <Route path="/prompts" element={<Prompts />} />
                  <Route path="/prompt-library" element={<PromptLibrary />} />
                  <Route path="/rag-lab" element={<ProtectedRoute><RagLabFunctional /></ProtectedRoute>} />
                  <Route path="/agents" element={<ProtectedRoute><AgentsFunctional /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/docs" element={<Documentation />} />
                  <Route path="/api" element={<ApiReference />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/sitemap.xml" element={<SitemapXml />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
