import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'TerraQuest AI — Less Scrolling. More Exploring.',
  description:
    'An AI-powered outdoor adventure companion that converts your free time, energy, and interests into practical, real-world outdoor missions. Designed to get you outdoors, not keep you scrolling.',
  keywords: [
    'Touch Grass',
    'Outdoor adventure',
    'Open-weight AI',
    'Gemma AI',
    'Mindful walking',
    'Nature scavenger hunt',
    'Hacktoberfest 2026',
    'Digital detox',
  ],
  authors: [{ name: 'TerraQuest AI Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('terraquest_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors">
        <ThemeProvider>
          <Suspense fallback={<div className="h-16 border-b border-[var(--border-subtle)]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
