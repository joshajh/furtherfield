'use client';

import { ReactNode } from 'react';

type FloatingPanelProps = {
  children: ReactNode;
  className?: string;
  withGradient?: boolean;
};

export function FloatingPanel({
  children,
  className = '',
  withGradient = false,
}: FloatingPanelProps) {
  if (withGradient) {
    return (
      <div
        className={`relative isolate bg-gradient-brand border-2 border-text-dark rounded-lg p-6 ${className}`}
      >
        {/* Film grain overlay */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none rounded-lg -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`bg-bg-light border-2 border-text-dark rounded-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}
