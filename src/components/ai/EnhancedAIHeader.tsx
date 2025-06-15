
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, Zap, Users } from 'lucide-react';

const EnhancedAIHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8" />
            Enhanced AI Platform
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced AI with context awareness, enhanced security, and real-time collaboration
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Enhanced
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Collaborative
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIHeader;
