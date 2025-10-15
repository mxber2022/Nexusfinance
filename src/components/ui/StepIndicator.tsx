import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  className?: string;
  variant?: 'horizontal' | 'compact';
}

export function StepIndicator({ steps, currentStep, className = '', variant = 'horizontal' }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : isCompleted
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}>
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : Icon ? (
                  <Icon className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              {isCompleted ? (
                <Check className={`h-5 w-5 transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600' 
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-slate-400'
                }`} />
              ) : Icon ? (
                <Icon className={`h-5 w-5 transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600' 
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-slate-400'
                }`} />
              ) : (
                <span className={`text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600' 
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-slate-400'
                }`}>{index + 1}</span>
              )}
              <span className={`mt-2 text-sm font-medium text-center max-w-20 ${
                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                isCompleted ? 'bg-green-600' : 'bg-slate-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}