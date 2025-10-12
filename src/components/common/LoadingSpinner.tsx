import React from 'react';
import { cn } from '../../utils/helpers';
import ktlLogo from '../../assets/logo/ktl-logo.png';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  message
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const glowSizes = {
    sm: 'shadow-lg shadow-blue-500/50',
    md: 'shadow-xl shadow-blue-500/60',
    lg: 'shadow-2xl shadow-blue-500/70',
    xl: 'shadow-2xl shadow-blue-500/80',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {/* Animated Logo Container */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin',
            sizes[size]
          )}
          style={{ animationDuration: '1.5s' }}
        />

        {/* Inner pulsing ring */}
        <div
          className={cn(
            'absolute inset-2 rounded-full border-2 border-blue-400/30 animate-ping',
            sizes[size]
          )}
          style={{ animationDuration: '2s' }}
        />

        {/* Logo with glow and rotation */}
        <div
          className={cn(
            'relative rounded-full overflow-hidden',
            glowSizes[size],
            sizes[size]
          )}
          style={{
            animation: 'spin 2s linear infinite, pulse 1.5s ease-in-out infinite alternate',
            transformOrigin: 'center'
          }}
        >
          <img
            src={ktlLogo}
            alt="KTL Loading"
            className="w-full h-full object-contain p-1 animate-pulse"
          />

          {/* Overlay gradient for extra effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 animate-pulse" />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-bounce"
               style={{ animationDelay: '0s', animationDuration: '1s' }} />
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-purple-400 rounded-full animate-bounce"
               style={{ animationDelay: '0.2s', animationDuration: '1.2s' }} />
          <div className="absolute bottom-0 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-bounce"
               style={{ animationDelay: '0.4s', animationDuration: '0.8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
               style={{ animationDelay: '0.6s', animationDuration: '1.5s' }} />
        </div>
      </div>

      {/* Enhanced message with animation */}
      {message && (
        <div className="text-center">
          <p className="text-lg font-semibold text-white animate-pulse">
            {message}
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      )}

    </div>
  );
};
