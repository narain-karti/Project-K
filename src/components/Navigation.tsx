'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Live Demo' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/kmaps', label: 'K Maps' },
  { href: '/technology', label: 'Technology' },
  { href: '/impact', label: 'Impact' },
  { href: '/business', label: 'Business' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollY / windowHeight) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50 transition-all duration-300 rounded-2xl backdrop-blur-2xl border border-white/10 shadow-2xl ${scrolled ? 'bg-black/60 shadow-2xl' : 'bg-black/40 shadow-xl'
          }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title with Animations */}
            <Link href="/" className="flex items-center gap-4 group">
              <motion.div
                className="relative w-16 h-16"
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Project K Logo"
                  width={64}
                  height={64}
                  className="object-contain drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]"
                />
              </motion.div>
              <motion.div
                className="flex flex-col"
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              >
                <motion.span
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-teal via-accent-purple to-accent-teal bg-[length:200%_auto]"
                  animate={{
                    backgroundPosition: ['0% center', '200% center'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  whileHover={{
                    scale: 1.05,
                    textShadow: "0 0 20px rgba(45,212,191,0.8)",
                    transition: { duration: 0.3 }
                  }}
                >
                  PROJECT K
                </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-all duration-200 interactive relative group ${pathname === link.href
                    ? 'text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full glass-card hover:bg-white/10 transition-all interactive"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-text-primary" />
                ) : (
                  <Menu className="w-5 h-5 text-text-primary" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Scroll Progress Bar */}
        <motion.div
          className="h-1 bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-rose rounded-b-2xl"
          style={{ scaleX: scrollProgress / 100, transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
        />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute top-20 right-6 left-6 glass-card rounded-2xl p-6 shadow-2xl backdrop-blur-2xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-lg font-medium transition-all duration-200 interactive ${pathname === link.href
                        ? 'text-accent-cyan'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
