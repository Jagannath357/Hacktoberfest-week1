'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={toggleTheme}
      aria-label={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
    >
      {mounted && theme === 'dark' ? (
        <Sun className="w-5 h-5 text-[var(--sunlight)]" />
      ) : mounted ? (
        <Moon className="w-5 h-5 text-[var(--forest-deep)]" />
      ) : (
        <span className="w-5 h-5 block" />
      )}
    </button>
  );
}
