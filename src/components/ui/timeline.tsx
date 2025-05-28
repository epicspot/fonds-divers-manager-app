
import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'gray';
  status?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline = ({ items, className }: TimelineProps) => {
  const getColorClasses = (color: string = 'gray') => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 border-blue-200';
      case 'green':
        return 'bg-green-500 border-green-200';
      case 'red':
        return 'bg-red-500 border-red-200';
      default:
        return 'bg-gray-500 border-gray-200';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-start space-x-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-white',
                getColorClasses(item.color)
              )}
            >
              {item.icon || (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            {index < items.length - 1 && (
              <div className="h-8 w-0.5 bg-gray-200 mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                {item.title}
              </h4>
              <span className="text-xs text-gray-500">
                {item.timestamp}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {item.description}
            </p>
            {item.status && (
              <span className={cn(
                'inline-block mt-2 px-2 py-1 text-xs rounded-full',
                item.status === 'termine' && 'bg-green-100 text-green-800',
                item.status === 'en_cours' && 'bg-yellow-100 text-yellow-800',
                item.status === 'rejete' && 'bg-red-100 text-red-800'
              )}>
                {item.status}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
