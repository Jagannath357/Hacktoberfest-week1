'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, BookmarkCheck, Menu, X, Sparkles, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/explore', label: 'Explore Missions', icon: Compass },
    { href: '/my-adventures', label: 'My Adventures', icon: BookmarkCheck },
    { href: '/journal', label: 'Nature Journal', icon: BookOpen },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg-app)]/90 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[var(--leaf-green)] rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
                  TerraQuest
                </span>
                <span className="text-xs px-1.5 py-0.5 font-semibold rounded bg-[var(--soft-sage)] dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)]">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] hidden sm:block leading-tight">
                Less scrolling. More exploring.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--soft-sage)]/60 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle + Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/create"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--forest-deep)] hover:bg-[#1f5038] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find My Adventure</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-app)] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[var(--soft-sage)]/60 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20] shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find My Adventure</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
