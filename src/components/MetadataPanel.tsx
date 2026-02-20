import React from 'react';
import type { ScreenShareMetadata } from '@/hooks/useScreenShare';

interface MetadataPanelProps {
  metadata: ScreenShareMetadata;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata }) => {
  const items = [
    {
      label: 'Display Type',
      value: metadata.displaySurface ?? 'Unknown',
    },
    {
      label: 'Resolution',
      value:
        metadata.width && metadata.height
          ? `${metadata.width} × ${metadata.height}`
          : '—',
    },
    {
      label: 'Frame Rate',
      value: metadata.frameRate ? `${Math.round(metadata.frameRate)} fps` : '—',
    },
  ];

  return (
    <div className="animate-fade-in grid grid-cols-3 gap-4 w-full max-w-lg">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary border border-border"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {item.label}
          </span>
          <span className="text-sm font-mono font-medium text-foreground">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
