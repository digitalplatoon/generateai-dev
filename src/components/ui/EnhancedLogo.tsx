interface EnhancedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const EnhancedLogo = ({
  size = 'md',
  showText = true
}: EnhancedLogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className={`${sizeClasses[size]} shrink-0 overflow-visible text-primary transition-transform duration-300 group-hover:scale-105`}
      >
        <rect x="2" y="2" width="44" height="44" rx="10" className="fill-navy stroke-border" strokeWidth="1.5" />
        <path
          d="M18 14 9.5 24 18 34M30 14l8.5 10L30 34"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.5 18.2a8 8 0 1 0 0 11.6V25H24"
          fill="none"
          className="stroke-foreground"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28.5" cy="18.2" r="2.1" className="fill-primary" />
        <circle cx="28.5" cy="29.8" r="2.1" className="fill-primary" />
      </svg>
      {showText && (
        <span className={`font-display font-bold ${textSizeClasses[size]} tracking-normal text-foreground`}>
          GenerateAI<span className="text-primary">.dev</span>
        </span>
      )}
    </div>
  );
};

export default EnhancedLogo;