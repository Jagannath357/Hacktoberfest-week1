import React from 'react';
import Link from 'next/link';
import { Compass, Heart, Shield, Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-secondary)] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-[var(--text-primary)]">
                TerraQuest AI
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              &ldquo;Less scrolling. More exploring.&rdquo; An AI adventure companion transforming screen time into real-world mindful experiences.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[var(--soft-sage)]/50 dark:bg-[var(--soft-sage)]/10 text-[var(--forest-deep)] dark:text-[var(--leaf-light)]">
              <Sparkles className="w-3 h-3" />
              <span>Gemma Open-Weight Architecture</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/create" className="hover:text-[var(--text-primary)] transition-colors">
                  Create Adventure
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[var(--text-primary)] transition-colors">
                  Curated Mission Library
                </Link>
              </li>
              <li>
                <Link href="/my-adventures" className="hover:text-[var(--text-primary)] transition-colors">
                  My Adventures
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[var(--text-primary)] transition-colors">
                  Nature Reflection Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Open Source */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">
              Open Technology
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/settings" className="hover:text-[var(--text-primary)] transition-colors">
                  Model &amp; Privacy Settings
                </Link>
              </li>
              <li>
                <a
                  href="https://dev.to/challenges/hacktoberfest-week1-2026-10-05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>DEV Touch Grass Challenge</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-[var(--text-muted)]">Local-First Storage</span>
              </li>
              <li>
                <span className="text-[var(--text-muted)]">Deterministic Fallback</span>
              </li>
            </ul>
          </div>

          {/* Outdoor Safety & Ethics */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--leaf-green)]" />
              <span>Outdoor Safety</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-2">
              Always verify local weather and trail conditions independently. Respect private property, wildlife, and Leave No Trace principles.
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              AI crafts the plan; your senses experience the real world.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-3">
          <p>
            Built for Hacktoberfest 2026 Week 1 (Touch Grass). Designed with care.
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for human wellbeing outdoors</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
