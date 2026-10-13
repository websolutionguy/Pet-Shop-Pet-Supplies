'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  variant?: 'underline' | 'segmented';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs({
  tabs,
  activeTabId,
  onTabChange,
  variant = 'segmented',
  size = 'md',
  className,
}: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('flex items-center gap-6 border-b border-stone-200 overflow-x-auto scrollbar-none', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'pb-3 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap cursor-pointer',
                size === 'sm' ? 'text-xs' : 'text-sm',
                isActive
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'font-mono text-[10px] px-1.5 py-0.2 rounded-xs',
                    isActive ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented control style (Anti-slop: clean rectangular segmented button group)
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-stone-100/80 rounded-xs border border-stone-200/80',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'font-medium rounded-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none',
              size === 'sm' ? 'text-xs py-1 px-2.5' : 'text-xs sm:text-sm py-1.5 px-3',
              isActive
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50/50'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'font-mono text-[10px] px-1.5 py-0.2 rounded-xs',
                  isActive ? 'bg-stone-100 text-stone-800' : 'bg-stone-200/80 text-stone-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
