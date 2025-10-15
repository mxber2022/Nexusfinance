import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-100 focus:ring-gray-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500',
    outline: 'border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white focus:ring-gray-500',
    ghost: 'text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    dark: 'bg-black/40 backdrop-blur-2xl border border-white/20 text-white hover:bg-black/60 hover:border-white/30 focus:ring-white/20 shadow-2xl hover:shadow-3xl ring-1 ring-white/10'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}