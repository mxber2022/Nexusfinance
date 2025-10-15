import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className = '' 
}: StatCardProps) {
  const variants = {
    default: 'from-slate-600 to-slate-700',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-indigo-500'
  };
  
  return (
    <div className={`bg-gradient-to-r ${variants[variant]} rounded-2xl p-6 text-white ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">{title}</h3>
          {subtitle && <p className="text-sm opacity-75">{subtitle}</p>}
        </div>
        {Icon && (
          <Icon className="h-6 w-6" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center space-x-2 text-sm opacity-90">
            <span className={trend.value >= 0 ? 'text-green-200' : 'text-red-200'}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="opacity-75">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}