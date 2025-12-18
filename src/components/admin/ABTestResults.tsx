import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FlaskConical, TrendingUp, Users, MousePointerClick } from 'lucide-react';

interface ABTestData {
  testId: string;
  variants: {
    id: string;
    name: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }[];
  startDate: string;
  status: 'running' | 'completed' | 'paused';
}

// Simulated A/B test data - in production, fetch from your analytics backend
const mockTests: ABTestData[] = [
  {
    testId: 'hero_cta_2024',
    variants: [
      { id: 'control', name: 'Start Building Free', impressions: 1247, conversions: 89, conversionRate: 7.14 },
      { id: 'variant_a', name: 'Get Started Now', impressions: 623, conversions: 52, conversionRate: 8.35 },
      { id: 'variant_b', name: 'Try Free Today', impressions: 618, conversions: 41, conversionRate: 6.63 },
    ],
    startDate: '2024-12-15',
    status: 'running',
  },
];

const ABTestResults = () => {
  const [tests, setTests] = useState<ABTestData[]>(mockTests);
  const [localAssignments, setLocalAssignments] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get local A/B test assignments
    const assignments: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ab_test_')) {
        const testId = key.replace('ab_test_', '');
        assignments[testId] = localStorage.getItem(key) || '';
      }
    }
    setLocalAssignments(assignments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getWinningVariant = (variants: ABTestData['variants']) => {
    return variants.reduce((prev, current) => 
      current.conversionRate > prev.conversionRate ? current : prev
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="w-5 h-5 text-teal" />
        <h2 className="text-xl font-display font-bold text-white">A/B Test Results</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-light-gray text-sm">Active Tests</p>
                <p className="text-2xl font-bold text-white">{tests.filter(t => t.status === 'running').length}</p>
              </div>
              <FlaskConical className="w-8 h-8 text-teal" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-light-gray text-sm">Total Impressions</p>
                <p className="text-2xl font-bold text-white">
                  {tests.reduce((sum, t) => sum + t.variants.reduce((s, v) => s + v.impressions, 0), 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-light-gray text-sm">Total Conversions</p>
                <p className="text-2xl font-bold text-white">
                  {tests.reduce((sum, t) => sum + t.variants.reduce((s, v) => s + v.conversions, 0), 0).toLocaleString()}
                </p>
              </div>
              <MousePointerClick className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Details */}
      {tests.map(test => {
        const winner = getWinningVariant(test.variants);
        const totalImpressions = test.variants.reduce((sum, v) => sum + v.impressions, 0);

        return (
          <Card key={test.testId} className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  {test.testId}
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </CardTitle>
                <p className="text-light-gray text-sm mt-1">Started: {test.startDate}</p>
              </div>
              {localAssignments[test.testId] && (
                <Badge variant="outline" className="border-teal/50 text-teal">
                  You: {localAssignments[test.testId]}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {test.variants.map(variant => {
                  const isWinner = variant.id === winner.id;
                  const trafficShare = (variant.impressions / totalImpressions) * 100;
                  
                  return (
                    <div key={variant.id} className={`p-4 rounded-lg ${isWinner ? 'bg-teal/10 border border-teal/30' : 'bg-white/5'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{variant.name}</span>
                          {isWinner && (
                            <Badge className="bg-teal/20 text-teal">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Leading
                            </Badge>
                          )}
                        </div>
                        <span className="text-2xl font-bold text-white">{variant.conversionRate.toFixed(2)}%</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-light-gray">Impressions</p>
                          <p className="text-white font-medium">{variant.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-light-gray">Conversions</p>
                          <p className="text-white font-medium">{variant.conversions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-light-gray">Traffic Share</p>
                          <p className="text-white font-medium">{trafficShare.toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <Progress value={variant.conversionRate * 10} className="mt-3 h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ABTestResults;
