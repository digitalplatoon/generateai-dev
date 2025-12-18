import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Gauge, Clock, MousePointer, LayoutDashboard } from 'lucide-react';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  unit: string;
  description: string;
  threshold: { good: number; poor: number };
}

const WebVitalsDisplay = () => {
  const [vitals, setVitals] = useState<VitalMetric[]>([
    { 
      name: 'LCP', 
      value: 1.8, 
      rating: 'good', 
      unit: 's',
      description: 'Largest Contentful Paint',
      threshold: { good: 2.5, poor: 4.0 }
    },
    { 
      name: 'FID', 
      value: 45, 
      rating: 'good', 
      unit: 'ms',
      description: 'First Input Delay',
      threshold: { good: 100, poor: 300 }
    },
    { 
      name: 'CLS', 
      value: 0.08, 
      rating: 'good', 
      unit: '',
      description: 'Cumulative Layout Shift',
      threshold: { good: 0.1, poor: 0.25 }
    },
    { 
      name: 'INP', 
      value: 180, 
      rating: 'needs-improvement', 
      unit: 'ms',
      description: 'Interaction to Next Paint',
      threshold: { good: 200, poor: 500 }
    },
    { 
      name: 'TTFB', 
      value: 650, 
      rating: 'good', 
      unit: 'ms',
      description: 'Time to First Byte',
      threshold: { good: 800, poor: 1800 }
    },
    { 
      name: 'FCP', 
      value: 1.2, 
      rating: 'good', 
      unit: 's',
      description: 'First Contentful Paint',
      threshold: { good: 1.8, poor: 3.0 }
    },
  ]);

  const [recentLogs, setRecentLogs] = useState<Array<{ name: string; value: number; rating: string; time: string }>>([]);

  useEffect(() => {
    // Simulate incoming Web Vitals data
    const interval = setInterval(() => {
      const randomVital = vitals[Math.floor(Math.random() * vitals.length)];
      const variation = (Math.random() - 0.5) * 0.2;
      const newValue = randomVital.value * (1 + variation);
      
      setRecentLogs(prev => [
        { 
          name: randomVital.name, 
          value: newValue, 
          rating: getRating(randomVital.name, newValue),
          time: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 9)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [vitals]);

  const getRating = (name: string, value: number): string => {
    const vital = vitals.find(v => v.name === name);
    if (!vital) return 'unknown';
    
    if (value <= vital.threshold.good) return 'good';
    if (value <= vital.threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'needs-improvement': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'poor': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'LCP': return <LayoutDashboard className="w-5 h-5" />;
      case 'FID': 
      case 'INP': return <MousePointer className="w-5 h-5" />;
      case 'CLS': return <Activity className="w-5 h-5" />;
      case 'TTFB':
      case 'FCP': return <Clock className="w-5 h-5" />;
      default: return <Gauge className="w-5 h-5" />;
    }
  };

  const goodCount = vitals.filter(v => v.rating === 'good').length;
  const needsImprovementCount = vitals.filter(v => v.rating === 'needs-improvement').length;
  const poorCount = vitals.filter(v => v.rating === 'poor').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-teal" />
        <h2 className="text-xl font-display font-bold text-white">Web Vitals</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-400">{goodCount}</p>
            <p className="text-green-400 text-sm">Good</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-yellow-400">{needsImprovementCount}</p>
            <p className="text-yellow-400 text-sm">Needs Work</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-red-400">{poorCount}</p>
            <p className="text-red-400 text-sm">Poor</p>
          </CardContent>
        </Card>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {vitals.map(vital => (
          <Card key={vital.name} className={`border ${getRatingColor(vital.rating)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-white">
                  {getIcon(vital.name)}
                  <span className="font-medium">{vital.name}</span>
                </div>
                <Badge className={getRatingColor(vital.rating)}>
                  {vital.rating.replace('-', ' ')}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {vital.value.toFixed(vital.unit === 'ms' ? 0 : 2)}{vital.unit}
              </p>
              <p className="text-xs text-light-gray">{vital.description}</p>
              <p className="text-xs text-light-gray mt-1">
                Good: ≤{vital.threshold.good}{vital.unit} | Poor: &gt;{vital.threshold.poor}{vital.unit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Logs */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal" />
            Recent Measurements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-light-gray text-sm">Waiting for measurements...</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getRatingColor(log.rating)}>{log.name}</Badge>
                    <span className="text-white font-mono">{log.value.toFixed(2)}</span>
                  </div>
                  <span className="text-light-gray text-xs">{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebVitalsDisplay;
