import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import { useWebVitals } from "@/hooks/useWebVitals";
import "./App.css";

// Lazy-loaded page components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EnhancedAI = lazy(() => import("./pages/EnhancedAI"));
const LearningPaths = lazy(() => import("./pages/LearningPaths"));
const PromptLibrary = lazy(() => import("./pages/PromptLibrary"));
const RagLabFunctional = lazy(() => import("./pages/RagLabFunctional"));
const AgentsFunctional = lazy(() => import("./pages/AgentsFunctional"));
const Documentation = lazy(() => import("./pages/Documentation"));
const ApiReference = lazy(() => import("./pages/ApiReference"));
const Prompts = lazy(() => import("./pages/Prompts"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Community = lazy(() => import("./pages/Community"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SitemapXml = lazy(() => import("./pages/SitemapXml"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SeoProjects = lazy(() => import("./pages/SeoProjects"));
const SeoProjectDetail = lazy(() => import("./pages/SeoProjectDetail"));
const SeoAuditReport = lazy(() => import("./pages/SeoAuditReport"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const WebVitalsMonitor = ({ children }: { children: React.ReactNode }) => {
  useWebVitals();
  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WebVitalsMonitor>
            <GoogleAnalytics />
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-dark">
              <Header />
              <main className="flex-1">
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
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
                      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/seo-projects" element={<ProtectedRoute><SeoProjects /></ProtectedRoute>} />
                      <Route path="/seo-projects/:id" element={<ProtectedRoute><SeoProjectDetail /></ProtectedRoute>} />
                      <Route path="/seo-audit/:scanRunId" element={<ProtectedRoute><SeoAuditReport /></ProtectedRoute>} />
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
                  </Suspense>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
          </WebVitalsMonitor>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
