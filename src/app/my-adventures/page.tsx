'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookmarkCheck,
  Clock,
  CheckCircle2,
  Play,
  Trash2,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';
import {
  getSavedAdventures,
  deleteAdventure,
  calculateAdventureStats,
} from '@/lib/storage/local-storage';
import { UserAdventureProgress, AdventureStats } from '@/types/adventure';

export default function MyAdventuresPage() {
  const router = useRouter();
  const [adventures, setAdventures] = useState<UserAdventureProgress[]>([]);
  const [stats, setStats] = useState<AdventureStats>({
    totalMinutes: 0,
    completedCount: 0,
    savedCount: 0,
    journalCount: 0,
    categoryCounts: {},
  });
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed' | 'saved'>('all');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    refreshData();
    setMounted(true);
  }, []);

  const refreshData = () => {
    const list = getSavedAdventures();
    setAdventures(list);
    setStats(calculateAdventureStats());
  };

  const handleDelete = (missionId: string, title: string) => {
    if (window.confirm(`Remove "${title}" from your saved adventures?`)) {
      deleteAdventure(missionId);
      refreshData();
    }
  };

  const filteredAdventures = adventures.filter((a) => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-[var(--text-muted)]">
        Loading your adventures...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf-green)] uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            My Adventures
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track your real-world time outdoors, resume saved missions, and review completed journeys.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-xs transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Adventure</span>
        </Link>
      </div>

      {/* Real Statistics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Outdoor Minutes</span>
            <Clock className="w-4 h-4 text-[var(--leaf-green)]" />
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.totalMinutes}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Verified offline screen-free time
          </p>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Completed Missions</span>
            <CheckCircle2 className="w-4 h-4 text-[var(--leaf-green)]" />
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.completedCount}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Finished real-world challenges
          </p>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Saved in Library</span>
            <BookmarkCheck className="w-4 h-4 text-[var(--leaf-green)]" />
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.savedCount}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Ready for your next free window
          </p>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Journal Reflections</span>
            <BookOpen className="w-4 h-4 text-[var(--leaf-green)]" />
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.journalCount}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Private sensory memories recorded
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'all', label: `All (${adventures.length})` },
          { id: 'in_progress', label: `In Progress (${adventures.filter((a) => a.status === 'in_progress').length})` },
          { id: 'completed', label: `Completed (${adventures.filter((a) => a.status === 'completed').length})` },
          { id: 'saved', label: `Saved (${adventures.filter((a) => a.status === 'saved').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Adventures List */}
      {filteredAdventures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdventures.map((record) => {
            const { mission, status } = record;
            return (
              <div
                key={record.missionId}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : status === 'in_progress'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                          : 'bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)]'
                      }`}
                    >
                      {status === 'in_progress' ? 'In Progress' : status}
                    </span>
                    <span className="text-[var(--text-muted)] flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {mission.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug line-clamp-1">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {mission.tagline}
                  </p>

                  <div className="text-[11px] text-[var(--text-muted)] pt-1 space-y-0.5">
                    <p>
                      <strong>Category:</strong> {mission.category.replace('_', ' ')}
                    </p>
                    <p>
                      <strong>Setting:</strong> {mission.locationType}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <Link
                    href={`/adventure/${mission.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20] hover:opacity-95 transition-opacity"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{status === 'completed' ? 'Revisit Mission' : status === 'in_progress' ? 'Resume Mission' : 'Start Mission'}</span>
                  </Link>

                  {status === 'completed' && (
                    <Link
                      href={`/journal?missionId=${mission.id}&title=${encodeURIComponent(mission.title)}`}
                      className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                      title="Write journal entry"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>
                  )}

                  <button
                    onClick={() => handleDelete(mission.id, mission.title)}
                    className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                    title="Delete saved adventure"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--soft-sage)]/50 dark:bg-[var(--soft-sage)]/20 text-[var(--leaf-green)] flex items-center justify-center mx-auto">
            <BookmarkCheck className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              No adventures in this view yet
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
              Ready to disconnect from screens? Design a 15-minute nature walk or explore our curated mission library.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/create"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20]"
            >
              Generate First Mission
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs border border-[var(--border-subtle)] text-[var(--text-primary)]"
            >
              Explore Ready Missions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
