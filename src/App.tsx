
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/seo/Breadcrumbs";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import LearningPaths from "./pages/LearningPaths";
import PromptLibrary from "./pages/PromptLibrary";
import RagLab from "./pages/RagLab";
import AgentPlayground from "./pages/AgentPlayground";
import Documentation from "./pages/Documentation";
import ApiReference from "./pages/ApiReference";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white flex flex-col">
              <Header />
              <Breadcrumbs />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/paths" element={<LearningPaths />} />
                  <Route path="/prompts" element={<PromptLibrary />} />
                  <Route path="/rag-lab" element={<RagLab />} />
                  <Route path="/agents" element={<AgentPlayground />} />
                  <Route path="/docs" element={<Documentation />} />
                  <Route path="/api" element={<ApiReference />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
