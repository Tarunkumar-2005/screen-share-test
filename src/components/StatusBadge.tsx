import React from 'react';
import type { ScreenShareStatus } from '@/hooks/useScreenShare';

interface StatusBadgeProps {
  status: ScreenShareStatus;
  errorMessage?: string | null;
}

const statusConfig: Record<
  ScreenShareStatus,
  { label: string; color: string; dotColor: string }
> = {
  idle: {
    label: 'Ready',
    color: 'text-muted-foreground',
    dotColor: 'bg-muted-foreground',
  },
  requesting: {
    label: 'Requesting Permission…',
    color: 'text-warning',
    dotColor: 'bg-warning animate-pulse-slow',
  },
  active: {
    label: 'Screen Stream Active',
    color: 'text-success',
    dotColor: 'bg-success',
  },
  cancelled: {
    label: 'Picker Cancelled',
    color: 'text-warning',
    dotColor: 'bg-warning',
  },
  denied: {
    label: 'Permission Denied',
    color: 'text-destructive',
    dotColor: 'bg-destructive',
  },
  error: {
    label: 'Error',
    color: 'text-destructive',
    dotColor: 'bg-destructive',
  },
  stopped: {
    label: 'Screen Sharing Stopped',
    color: 'text-muted-foreground',
    dotColor: 'bg-muted-foreground',
  },
  unsupported: {
    label: 'Browser Unsupported',
    color: 'text-destructive',
    dotColor: 'bg-destructive',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, errorMessage }) => {
  const config = statusConfig[status];

  return (
    <div className="animate-fade-in">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border ${config.color}`}>
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        <span className="text-sm font-medium font-mono">{config.label}</span>
      </div>
      {errorMessage && (
        <p className="mt-2 text-sm text-destructive/80 font-mono">{errorMessage}</p>
      )}
    </div>
  );
};
