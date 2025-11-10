import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, BookOpen, MessageSquare, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InsightsPanel from '@/components/analytics/InsightsPanel';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { logs } = useAuditLog();
  const { progress } = useUserProgress();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Calculate engagement metrics
  const metrics = useMemo(() => {
    const totalActions = logs.length;
    const successRate = logs.length > 0 
      ? (logs.filter(log => log.status === 'success').length / logs.length * 100).toFixed(1)
      : 0;
    const avgResponseTime = logs.length > 0
      ? (logs.reduce((acc, log) => acc + (log.processing_time_ms || 0), 0) / logs.length).toFixed(0)
      : 0;
    const totalProgress = progress.length > 0
      ? (progress.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / progress.length).toFixed(0)
      : 0;

    return {
      totalActions,
      successRate,
      avgResponseTime,
      totalProgress
    };
  }, [logs, progress]);

  // Feature usage data
  const featureUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    logs.forEach(log => {
      const action = log.action_type || 'unknown';
      usage[action] = (usage[action] || 0) + 1;
    });
    
    return Object.entries(usage)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [logs]);

  // Activity over time (last 7 days)
  const activityData = useMemo(() => {
    const days = 7;
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.created_at);
        return logDate.toDateString() === date.toDateString();
      });

      data.push({
        date: dateStr,
        actions: dayLogs.length,
        success: dayLogs.filter(l => l.status === 'success').length,
        errors: dayLogs.filter(l => l.status !== 'success').length
      });
    }

    return data;
  }, [logs]);

  // Learning progress by path
  const progressByPath = useMemo(() => {
    const pathProgress: Record<string, { total: number; count: number }> = {};
    
    progress.forEach(p => {
      if (!pathProgress[p.learning_path_id]) {
        pathProgress[p.learning_path_id] = { total: 0, count: 0 };
      }
      pathProgress[p.learning_path_id].total += p.progress_percentage || 0;
      pathProgress[p.learning_path_id].count += 1;
    });

    return Object.entries(pathProgress).map(([path, data]) => ({
      path: path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      progress: Math.round(data.total / data.count)
    }));
  }, [progress]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--chart-1))'];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your engagement, feature usage, and learning progress</p>
        </div>

        {/* Personalized Insights */}
        <InsightsPanel />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalActions}</div>
              <p className="text-xs text-muted-foreground">All time activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.successRate}%</div>
              <p className="text-xs text-muted-foreground">Successful operations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">Processing speed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalProgress}%</div>
              <p className="text-xs text-muted-foreground">Average completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
            <TabsTrigger value="features">Feature Usage</TabsTrigger>
            <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Over Time</CardTitle>
                <CardDescription>Your actions and success rate over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="actions" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Actions" />
                      <Line type="monotone" dataKey="success" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Successful" />
                      <Line type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" strokeWidth={2} name="Errors" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No activity data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Features</CardTitle>
                <CardDescription>Distribution of your top 5 feature interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {featureUsage.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={featureUsage}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                        >
                          {featureUsage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={featureUsage}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No feature usage data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress by Path</CardTitle>
                <CardDescription>Your progress across different learning paths</CardDescription>
              </CardHeader>
              <CardContent>
                {progressByPath.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressByPath} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                      <YAxis dataKey="path" type="category" stroke="hsl(var(--muted-foreground))" width={150} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Start a learning path to track your progress
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
