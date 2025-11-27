'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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


  {/* Desktop Navigation */ }
  <div className="hidden md:flex items-center gap-8">
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

  {/* Mobile Menu Button */ }
  <div className="flex items-center gap-4 md:hidden">
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
          </div >
        </nav >

    {/* Scroll Progress Bar */ }
    < motion.div
  className = "h-1 bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-rose rounded-b-2xl"
  style = {{ scaleX: scrollProgress / 100, transformOrigin: 'left' }
}
initial = {{ scaleX: 0 }}
        />
      </motion.header >

  {/* Mobile Menu */ }
  <AnimatePresence>
{
  mobileMenuOpen && (
    <motion.div
      className="fixed inset-0 z-40 md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
  ))
}
        </div >
      </motion.div >
    </motion.div >
  )
}
      </AnimatePresence >
    </>
  );
}
