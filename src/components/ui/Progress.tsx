import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  size = 'md',
  variant = 'default' 
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const variants = {
    default: 'bg-white',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };
  
  return (
    <div className={`w-full bg-gray-800/50 rounded-full overflow-hidden ${sizes[size]} ${className}`}>
      <div 
        className={`${sizes[size]} ${variants[variant]} transition-all duration-300 ease-out rounded-full`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}