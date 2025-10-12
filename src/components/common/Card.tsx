import React from 'react';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  gradient = false,
  glass = false 
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  
  const cardStyles = glass
    ? 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl'
    : gradient
    ? 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 shadow-xl hover:shadow-2xl'
    : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl';

  return (
    <div className={cn(baseStyles, cardStyles, className)}>
      {children}
    </div>
  );
};
