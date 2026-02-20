import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreenShare } from '@/hooks/useScreenShare';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { MetadataPanel } from '@/components/MetadataPanel';

const ScreenTestPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    status,
    metadata,
    videoRef,
    startScreenShare,
    stopScreenShare,
    errorMessage,
  } = useScreenShare();

  const isActive = status === 'active';
  const isRequesting = status === 'requesting';
  const isStopped = status === 'stopped';
  const isError = status === 'cancelled' || status === 'denied' || status === 'error';
  const showRetry = isStopped || isError;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${
          isActive ? 'bg-success/8' : 'bg-primary/5'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-mono"
          >
            ← Home
          </button>
          <span className="text-border">/</span>
          <span className="text-sm font-mono text-foreground">Screen Test</span>
        </div>

        {/* Status */}
        <StatusBadge status={status} errorMessage={errorMessage} />

        {/* Video Preview */}
        <div className={`relative w-full aspect-video rounded-xl border overflow-hidden transition-all duration-500 ${
          isActive
            ? 'border-success/30 glow-primary-strong'
            : 'border-border bg-secondary'
        }`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-contain bg-background ${
              isActive ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          />
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="text-sm text-muted-foreground/50 font-mono">
                {isStopped ? 'Stream ended' : 'No active stream'}
              </span>
            </div>
          )}
        </div>

        {/* Metadata */}
        {isActive && <MetadataPanel metadata={metadata} />}

        {/* Controls */}
        <div className="flex items-center gap-3 mt-2">
          {status === 'idle' && (
            <Button onClick={startScreenShare} size="lg">
              Start Screen Share
            </Button>
          )}

          {isRequesting && (
            <Button loading disabled size="lg">
              Waiting for Permission…
            </Button>
          )}

          {isActive && (
            <Button variant="danger" onClick={stopScreenShare} size="md">
              Stop Sharing
            </Button>
          )}

          {showRetry && (
            <>
              <Button onClick={startScreenShare} size="md">
                Retry Screen Test
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')} size="md">
                Back to Home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenTestPage;
