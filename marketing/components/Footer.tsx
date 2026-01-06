import Link from "next/link";
import Image from "next/image";
import { Brandmark3D } from "./Brandmark3D";

export function Footer() {
  return (
    <footer className="w-full p-2.5 md:p-5">
      <div className="relative bg-gradient-brand rounded-lg p-4 md:p-8 overflow-hidden">
        {/* Lichen growing up from bottom */}
        <img
          src="/lichen/acid-footer.png"
          alt=""
          className="absolute inset-x-0 bottom-0 w-full object-contain object-bottom pointer-events-none z-10"
        />

        {/* Mobile Layout */}
        <div className="flex flex-col gap-8 md:hidden">
          <div className="font-display text-text-dark text-[32px] sm:text-[50px] leading-none">
            <h2 className="mb-0">Reimagine</h2>
            <h2 className="mb-0">This Coastal</h2>
            <h2>Town</h2>
          </div>
          <Image
            src="/logo-white.png"
            alt="Furtherfield"
            width={200}
            height={50}
            className="invert w-[150px] h-auto"
          />
          <div className="flex gap-10">
            <div className="flex flex-col gap-1.5 items-start">
              <span className="border border-text-dark rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-dark">
                Links
              </span>
              <nav className="flex flex-col items-start text-base text-text-dark underline">
                <Link href="/" className="hover:opacity-70 transition-opacity py-1">Home</Link>
                <Link href="/events" className="hover:opacity-70 transition-opacity py-1">Events</Link>
                <Link href="/about" className="hover:opacity-70 transition-opacity py-1">About</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-1.5 items-start">
              <span className="border border-text-dark rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-dark">
                Connect
              </span>
              <nav className="flex flex-col items-start text-base text-text-dark underline">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">Instagram</a>
                <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">Threads</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">YouTube</a>
                <a href="mailto:hello@thiscoastaltown.com" className="hover:opacity-70 transition-opacity py-1">Email</a>
              </nav>
            </div>
          </div>
          <p className="text-text-dark text-sm">Company number etc</p>
        </div>

        {/* Centered Rotating Brandmark - Desktop */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center z-0 pointer-events-none">
          <Brandmark3D size={80} />
        </div>

        {/* Desktop Layout - 2x2 Grid */}
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-8 min-h-[400px] relative z-[1]">
          {/* TL: Reimagine This Coastal Town */}
          <div className="flex items-start justify-start">
            <div className="font-display text-text-dark text-[80px] leading-none">
              <h2 className="mb-0">Reimagine</h2>
              <h2 className="mb-0">This Coastal</h2>
              <h2>Town</h2>
            </div>
          </div>

          {/* TR: Furtherfield Logo */}
          <div className="flex items-start justify-end">
            <Image
              src="/logo-white.png"
              alt="Furtherfield"
              width={250}
              height={63}
              className="invert"
            />
          </div>

          {/* BL: Empty */}
          <div></div>

          {/* BR: Navigation */}
          <div className="flex items-end justify-end">
            <div className="flex flex-col items-end gap-6">
              <div className="flex gap-20">
                <div className="flex flex-col gap-1.5 items-end">
                  <span className="border border-text-dark rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-dark">
                    Links
                  </span>
                  <nav className="flex flex-col items-end text-xl text-text-dark underline">
                    <Link href="/" className="hover:opacity-70 transition-opacity py-1">Home</Link>
                    <Link href="/events" className="hover:opacity-70 transition-opacity py-1">Events</Link>
                    <Link href="/about" className="hover:opacity-70 transition-opacity py-1">About</Link>
                  </nav>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  <span className="border border-text-dark rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-dark">
                    Connect
                  </span>
                  <nav className="flex flex-col items-end text-xl text-text-dark underline">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">Instagram</a>
                    <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">Threads</a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">YouTube</a>
                    <a href="mailto:hello@thiscoastaltown.com" className="hover:opacity-70 transition-opacity py-1">Email</a>
                  </nav>
                </div>
              </div>
              <p className="text-text-dark text-base">Company number etc</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
