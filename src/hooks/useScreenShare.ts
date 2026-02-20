import { useState, useCallback, useRef, useEffect } from 'react';

export type ScreenShareStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'cancelled'
  | 'denied'
  | 'error'
  | 'stopped'
  | 'unsupported';

export interface ScreenShareMetadata {
  displaySurface: string | null;
  width: number | null;
  height: number | null;
  frameRate: number | null;
}

interface UseScreenShareReturn {
  status: ScreenShareStatus;
  metadata: ScreenShareMetadata;
  videoRef: React.RefObject<HTMLVideoElement>;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  isSupported: boolean;
  errorMessage: string | null;
}

const emptyMetadata: ScreenShareMetadata = {
  displaySurface: null,
  width: null,
  height: null,
  frameRate: null,
};

export function useScreenShare(): UseScreenShareReturn {
  const [status, setStatus] = useState<ScreenShareStatus>('idle');
  const [metadata, setMetadata] = useState<ScreenShareMetadata>(emptyMetadata);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getDisplayMedia;

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMetadata(emptyMetadata);
  }, []);

  const stopScreenShare = useCallback(() => {
    cleanup();
    setStatus('stopped');
  }, [cleanup]);

  const startScreenShare = useCallback(async () => {
    if (!isSupported) {
      setStatus('unsupported');
      return;
    }

    // Clean up any previous stream
    cleanup();
    setStatus('requesting');
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: false,
      });

      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) {
        setStatus('error');
        setErrorMessage('No video track found in the stream.');
        cleanup();
        return;
      }

      // Listen for user stopping via browser UI
      videoTrack.onended = () => {
        setStatus('stopped');
        cleanup();
      };

      // Extract metadata
      const settings = videoTrack.getSettings();
      setMetadata({
        displaySurface: (settings as any).displaySurface ?? null,
        width: settings.width ?? null,
        height: settings.height ?? null,
        frameRate: settings.frameRate ?? null,
      });

      // Attach to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStatus('active');
    } catch (err: any) {
      cleanup();
      if (err.name === 'NotAllowedError') {
        // Distinguish between user cancellation and permission denial
        if (err.message?.toLowerCase().includes('denied')) {
          setStatus('denied');
          setErrorMessage('Screen sharing permission was denied by the browser.');
        } else {
          setStatus('cancelled');
          setErrorMessage('Screen share picker was closed without selection.');
        }
      } else if (err.name === 'NotFoundError') {
        setStatus('error');
        setErrorMessage('No screen source was found.');
      } else if (err.name === 'NotReadableError') {
        setStatus('error');
        setErrorMessage('Could not read the selected screen source.');
      } else {
        setStatus('error');
        setErrorMessage(err.message || 'An unknown error occurred.');
      }
    }
  }, [isSupported, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    status,
    metadata,
    videoRef,
    startScreenShare,
    stopScreenShare,
    isSupported,
    errorMessage,
  };
}
