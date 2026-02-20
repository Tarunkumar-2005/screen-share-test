import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const isSupported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getDisplayMedia;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center glow-primary">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-gradient">Screen Share</span>{' '}
            <span className="text-foreground">Test App</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Validate browser screen-sharing capabilities with real-time preview and stream lifecycle management.
          </p>
        </div>

        {isSupported ? (
          <Button
            size="lg"
            onClick={() => navigate('/screen-test')}
          >
            Start Screen Test
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-mono">
              ⚠ Your browser does not support screen sharing.
            </div>
            <p className="text-xs text-muted-foreground">
              Please use Chrome or Edge for full support.
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-8">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Chrome
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Edge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            Local preview only
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
