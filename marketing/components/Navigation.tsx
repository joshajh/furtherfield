"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-2.5 z-50 mx-2.5 rounded-lg bg-gradient-brand backdrop-blur-sm">
      <div className="flex items-center justify-between p-5">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-text-dark">
          <span className="block leading-none">0.5m</span>
          <span className="block leading-none">oADM</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#programme"
            className="text-text-dark font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
          >
            Programme
          </Link>
          <Link
            href="/about"
            className="text-text-dark font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
          >
            About
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-text-dark block"
          />
          <motion.span
            animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-text-dark block"
          />
          <motion.span
            animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-text-dark block"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-5 pt-0">
              <Link
                href="/#programme"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-dark font-semibold text-2xl tracking-tight"
              >
                Programme
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-dark font-semibold text-2xl tracking-tight"
              >
                About
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
