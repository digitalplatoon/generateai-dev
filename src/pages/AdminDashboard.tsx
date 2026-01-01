import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FlaskConical, Gauge, Shield, ShieldX } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';
import ContentCalendar from '@/components/blog/ContentCalendar';
import ABTestResults from '@/components/admin/ABTestResults';
import WebVitalsDisplay from '@/components/admin/WebVitalsDisplay';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const { isAdmin, loading } = useAdminRole();

  if (loading) {
    return (
      <>
        <SEOHead
          title="Admin Dashboard | GenerateAI.dev"
          description="Manage content, monitor performance, and track A/B tests."
        />
        <div className="bg-navy min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto mb-4"></div>
            <p className="text-light-gray">Verifying access...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <SEOHead
          title="Access Denied | GenerateAI.dev"
          description="You don't have permission to access this page."
        />
        <div className="bg-navy min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <ShieldX className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Access Denied
            </h1>
            <p className="text-light-gray mb-8">
              You don't have permission to access the Admin Dashboard. This area is restricted to users with administrator privileges.
            </p>
            <Button asChild className="bg-teal hover:bg-teal/90 text-navy">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Admin Dashboard | GenerateAI.dev"
        description="Manage content, monitor performance, and track A/B tests."
      />
      <div className="bg-navy min-h-screen">
        <section className="pt-24 pb-16 px-6">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-teal" />
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-light-gray">
                Manage content, monitor performance, and track experiments.
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white/5 border border-white/10 p-1">
                <TabsTrigger 
                  value="calendar" 
                  className="data-[state=active]:bg-teal data-[state=active]:text-navy flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Content Calendar
                </TabsTrigger>
                <TabsTrigger 
                  value="ab-tests" 
                  className="data-[state=active]:bg-teal data-[state=active]:text-navy flex items-center gap-2"
                >
                  <FlaskConical className="w-4 h-4" />
                  A/B Tests
                </TabsTrigger>
                <TabsTrigger 
                  value="web-vitals" 
                  className="data-[state=active]:bg-teal data-[state=active]:text-navy flex items-center gap-2"
                >
                  <Gauge className="w-4 h-4" />
                  Web Vitals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-6">
                <ContentCalendar />
              </TabsContent>

              <TabsContent value="ab-tests" className="mt-6">
                <ABTestResults />
              </TabsContent>

              <TabsContent value="web-vitals" className="mt-6">
                <WebVitalsDisplay />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;
