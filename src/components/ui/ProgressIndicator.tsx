
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  showPercentage = true,
  size = 'md',
  className
}) => {
  const isComplete = progress >= 100;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isComplete ? (
        <CheckCircle className={`text-green-500 ${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}`} />
      ) : (
        <Progress 
          value={progress} 
          className={`flex-1 ${size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3'}`} 
        />
      )}
      {showPercentage && (
        <span className={`text-muted-foreground ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {isComplete ? 'Complete' : `${progress}%`}
        </span>
      )}
    </div>
  );
};
