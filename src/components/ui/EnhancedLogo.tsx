import React from 'react';
import { Brain } from 'lucide-react';
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
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };
  return <div className="flex items-center space-x-2 whitespace-nowrap">
      <div className={`${sizeClasses[size]} shrink-0 bg-gradient-to-br from-teal via-teal-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg hover-glow transition-all duration-300 hover:scale-105`}>
        <Brain className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-5 w-5' : 'h-7 w-7'} text-white`} />
      </div>
      {showText && <span className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-foreground to-teal bg-clip-text text-transparent`}>GenerateAI</span>}
    </div>;
};
export default EnhancedLogo;