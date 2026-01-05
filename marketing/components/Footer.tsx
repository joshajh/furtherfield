import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full p-2.5 md:p-5">
      <div className="bg-gradient-brand rounded-lg p-4 md:p-5 pt-[200px] md:pt-[400px] flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-10">
        {/* Logo */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="font-display text-text-dark text-[32px] sm:text-[50px] md:text-[80px] leading-none">
            <h2 className="mb-0">Reimagine</h2>
            <h2 className="mb-0">This Coastal</h2>
            <h2>Town</h2>
          </div>
          <Image
            src="/logo-white.png"
            alt="Furtherfield"
            width={200}
            height={50}
            className="invert w-[150px] md:w-[200px] h-auto"
          />
        </div>

        {/* Footer Links */}
        <div className="flex flex-col items-start md:items-end gap-6 md:gap-10 w-full md:w-auto">
          <div className="flex gap-10 sm:gap-20">
            {/* Links Column */}
            <div className="flex flex-col gap-1.5 items-start md:items-end">
              <span className="border border-text-dark rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-dark">
                Links
              </span>
              <nav className="flex flex-col items-start md:items-end text-base sm:text-xl text-text-dark underline">
                <Link href="/" className="hover:opacity-70 transition-opacity py-1">Home</Link>
                <Link href="/events" className="hover:opacity-70 transition-opacity py-1">Events</Link>
                <Link href="/about" className="hover:opacity-70 transition-opacity py-1">About</Link>
              </nav>
            </div>

            {/* Connect Column */}
            <div className="flex flex-col gap-1.5 items-start md:items-end">
              <span className="border border-text-dark rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-dark">
                Connect
              </span>
              <nav className="flex flex-col items-start md:items-end text-base sm:text-xl text-text-dark underline">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">Instagram</a>
                <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">Threads</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity py-1">YouTube</a>
                <a href="mailto:hello@thiscoastaltown.com" className="hover:opacity-70 transition-opacity py-1">Email</a>
              </nav>
            </div>
          </div>

          <p className="text-text-dark text-sm md:text-base">
            Company number etc
          </p>
        </div>
      </div>
    </footer>
  );
}
