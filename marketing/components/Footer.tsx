import Image from "next/image";
import { Brandmark3D } from "./Brandmark3D";

function SocialIcon({ type }: { type: 'instagram' | 'vimeo' | 'bluesky' | 'facebook' | 'email' }) {
  const icons = {
    instagram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    vimeo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
      </svg>
    ),
    bluesky: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
      </svg>
    ),
    facebook: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    email: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  };
  return icons[type];
}

export function Footer() {
  return (
    <footer className="w-full px-2.5 py-2.5 flex flex-col gap-2.5">
      {/* Main Footer */}
      <div className="relative bg-gradient-brand rounded-lg px-6 py-4 pb-20 md:px-12 md:py-8 md:pb-24 overflow-hidden">
        {/* Ruth Border Bottom decoration at bottom */}
        <img
          src="/lichen-ruth-web/ruth-border-bottom.png"
          alt=""
          className="absolute bottom-0 left-0 right-0 w-full h-auto object-cover object-top pointer-events-none"
          style={{ maxHeight: '80px' }}
        />
        {/* Mobile Layout */}
        <div className="flex flex-col gap-8 md:hidden relative z-[1]">
          <div className="font-display text-text-dark text-[32px] sm:text-[50px] leading-none italic">
            <h2 className="mb-0 glitch-base-text" data-text="Reimagine">
              <span className="relative z-10">Reimagine</span>
            </h2>
            <h2 className="mb-0">This Coastal</h2>
            <h2>Town</h2>
          </div>
          <div className="flex flex-col gap-4">
            <Image
              src="/logo-white.png"
              alt="Furtherfield"
              width={200}
              height={50}
              className="invert w-[150px] h-auto"
            />
            <div className="flex gap-4">
              <a href="https://www.instagram.com/furtherfield/" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="instagram" />
              </a>
              <a href="https://vimeo.com/furtherfield" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="vimeo" />
              </a>
              <a href="https://bsky.app/profile/furtherfield.bsky.social" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="bluesky" />
              </a>
              <a href="https://www.facebook.com/Furtherfield/" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="facebook" />
              </a>
              <a href="mailto:info@furtherfield.org" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="email" />
              </a>
            </div>
          </div>
        </div>

        {/* Centered Rotating Brandmark - Desktop */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center z-0 pointer-events-none">
          <Brandmark3D size={80} />
        </div>

        {/* Desktop Layout - 2x2 Grid */}
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-8 min-h-[400px] relative z-[1]">
          {/* TL: Reimagine This Coastal Town */}
          <div className="flex items-start justify-start">
            <div className="font-display text-text-dark text-[80px] leading-none italic">
              <h2 className="mb-0 glitch-base-text" data-text="Reimagine">
                <span className="relative z-10">Reimagine</span>
              </h2>
              <h2 className="mb-0">This Coastal</h2>
              <h2>Town</h2>
            </div>
          </div>

          {/* TR: Furtherfield Logo with Social Icons */}
          <div className="flex flex-col items-end gap-6">
            <Image
              src="/logo-white.png"
              alt="Furtherfield"
              width={250}
              height={63}
              className="invert"
            />
            <div className="flex gap-4">
              <a href="https://www.instagram.com/furtherfield/" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="instagram" />
              </a>
              <a href="https://vimeo.com/furtherfield" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="vimeo" />
              </a>
              <a href="https://bsky.app/profile/furtherfield.bsky.social" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="bluesky" />
              </a>
              <a href="https://www.facebook.com/Furtherfield/" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="facebook" />
              </a>
              <a href="mailto:info@furtherfield.org" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="email" />
              </a>
            </div>
          </div>

          {/* BL: Empty */}
          <div></div>

          {/* BR: Empty */}
          <div></div>
        </div>
      </div>

      {/* Dev Credits Footer */}
      <div className="bg-gradient-brand rounded-lg px-6 py-3 md:px-12 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-text-dark text-xs font-mono">
          <p>Unless otherwise specified all content is published by Furtherfield 2025-26 licensed under CC BY 4.0</p>
          <p>
            Design and development by{' '}
            <a
              href="https://possibleworlds.space"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-0.5 bg-text-dark text-text-light rounded-full hover:bg-treatment-acid hover:text-text-dark transition-colors"
            >
              Possible Worlds
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
