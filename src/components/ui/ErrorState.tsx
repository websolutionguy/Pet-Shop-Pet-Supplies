import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something unexpected happened',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'p-6 bg-[#FDF0F0] border border-[#F4C8C8] rounded-xs text-center flex flex-col items-center justify-center max-w-md mx-auto my-6',
        className
      )}
      role="alert"
    >
      <div className="w-10 h-10 rounded-xs bg-white border border-[#E9A4A4] flex items-center justify-center text-[#9A2B2B] mb-3">
        <AlertCircle className="w-5 h-5 stroke-[1.75]" />
      </div>

      <h4 className="font-serif text-base text-stone-900 font-medium">{title}</h4>
      <p className="mt-1 text-xs text-stone-600 leading-relaxed max-w-sm">
        {message}
      </p>

      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}
