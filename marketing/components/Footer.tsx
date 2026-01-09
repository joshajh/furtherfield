import Image from "next/image";
import { Brandmark3D } from "./Brandmark3D";

function SocialIcon({ type }: { type: 'instagram' | 'threads' | 'youtube' | 'email' }) {
  const icons = {
    instagram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    threads: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.855-.71 2.037-1.127 3.318-1.175.93-.035 1.791.055 2.573.266.029-.418.024-.845-.012-1.282-.102-1.197-.483-2.107-1.134-2.705-.73-.672-1.842-1.012-3.314-.99-1.394-.015-2.532.344-3.305 1.032l-1.31-1.588c1.134-.999 2.72-1.52 4.64-1.503 1.937-.028 3.51.486 4.684 1.522 1.09 1.006 1.715 2.396 1.87 4.086.04.393.053.802.036 1.225.712.29 1.328.675 1.836 1.148 1.003.932 1.633 2.2 1.821 3.665.21 1.643-.16 3.417-1.2 4.868-1.156 1.614-2.99 2.598-5.301 2.866-.59.068-1.2.102-1.821.102zm.123-8.831c-.901.035-1.655.284-2.196.722-.476.387-.725.89-.69 1.396.037.536.347.99.874 1.283.542.302 1.29.446 2.108.4 1.036-.056 1.862-.425 2.455-1.096.37-.42.65-.962.836-1.62-.908-.235-1.88-.34-2.857-.34-.18 0-.356.003-.53.01z"/>
      </svg>
    ),
    youtube: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
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
      <div className="relative bg-gradient-brand rounded-lg px-6 py-4 md:px-12 md:py-8 overflow-hidden">
        {/* Lichen growing up from bottom */}
        <img
          src="/lichen/acid-footer.png"
          alt=""
          className="absolute inset-x-0 bottom-0 w-full object-contain object-bottom pointer-events-none z-10"
        />

        {/* Mobile Layout */}
        <div className="flex flex-col gap-8 md:hidden">
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
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="instagram" />
              </a>
              <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="threads" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="youtube" />
              </a>
              <a href="mailto:hello@thiscoastaltown.com" className="text-text-dark hover:opacity-70 transition-opacity">
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
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="instagram" />
              </a>
              <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="threads" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-text-dark hover:opacity-70 transition-opacity">
                <SocialIcon type="youtube" />
              </a>
              <a href="mailto:hello@thiscoastaltown.com" className="text-text-dark hover:opacity-70 transition-opacity">
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
          <p>Content licensed under CC BY 4.0</p>
          <p>
            Design and development by{' '}
            <a
              href="https://possibleworlds.space"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center px-2 py-0.5 bg-text-dark text-text-light rounded-full hover:bg-treatment-acid hover:text-text-dark transition-colors overflow-hidden"
            >
              Possible Worlds
              <img
                src="/lichen/lichen-1.png"
                alt=""
                className="absolute bottom-0 left-0 right-0 w-full h-[8px] object-cover object-top pointer-events-none opacity-80"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
