import { cn } from '@/lib/utils';

interface ScoreCardProps {
  label: string;
  score: number | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 90) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

function getScoreBackground(score: number | null): string {
  if (score === null) return 'stroke-muted';
  if (score >= 90) return 'stroke-green-500';
  if (score >= 50) return 'stroke-yellow-500';
  return 'stroke-red-500';
}

export function ScoreCard({ label, score, size = 'md', showLabel = true }: ScoreCardProps) {
  const displayScore = score !== null ? Math.round(score) : '--';
  
  const sizes = {
    sm: { container: 'w-12 h-12', text: 'text-sm', stroke: 3, label: 'text-xs' },
    md: { container: 'w-20 h-20', text: 'text-xl', stroke: 4, label: 'text-sm' },
    lg: { container: 'w-28 h-28', text: 'text-3xl', stroke: 5, label: 'text-base' },
  };

  const config = sizes[size];
  const circumference = 2 * Math.PI * 40;
  const offset = score !== null ? circumference - (score / 100) * circumference : circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('relative', config.container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className="stroke-muted"
            strokeWidth={config.stroke}
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className={cn('transition-all duration-500', getScoreBackground(score))}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={cn(
          'absolute inset-0 flex items-center justify-center font-bold',
          config.text,
          getScoreColor(score)
        )}>
          {displayScore}
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-muted-foreground text-center', config.label)}>
          {label}
        </span>
      )}
    </div>
  );
}

export function ScoreRow({ 
  performance, 
  accessibility, 
  bestPractices, 
  seo 
}: { 
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
}) {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      <ScoreCard label="Performance" score={performance} size="md" />
      <ScoreCard label="Accessibility" score={accessibility} size="md" />
      <ScoreCard label="Best Practices" score={bestPractices} size="md" />
      <ScoreCard label="SEO" score={seo} size="md" />
    </div>
  );
}
