'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Search,
  Filter,
  Clock,
  RotateCcw,
  ArrowRight,
  Shield,
  Eye,
  CheckCircle2,
  TreePine,
} from 'lucide-react';
import { CURATED_MISSIONS } from '@/data/curated-missions';
import { saveAdventure } from '@/lib/storage/local-storage';
import { ActivityCategory, EffortLevel } from '@/types/adventure';

export default function ExplorePage() {
  const router = useRouter();

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEffort, setSelectedEffort] = useState<string>('all');
  const [maxDuration, setMaxDuration] = useState<number>(0); // 0 means all

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'walking', label: '🚶 Mindful Walking' },
    { id: 'gardening', label: '🌱 Balcony & Gardening' },
    { id: 'birdwatching', label: '🐦 Birding & Sound' },
    { id: 'nature_photography', label: '📷 Photography' },
    { id: 'mindful_observation', label: '🧘 Sensory Stillness' },
    { id: 'family_exploration', label: '👨‍👩‍👦 Family Safari' },
    { id: 'outdoor_fitness', label: '⚡ Natural Fitness' },
    { id: 'local_discovery', label: '🧭 Urban Trail' },
  ];

  const filteredMissions = useMemo(() => {
    return CURATED_MISSIONS.filter((m) => {
      // Search match
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tagline.toLowerCase().includes(q) ||
          m.locationType.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // Category match
      if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }

      // Effort match
      if (selectedEffort !== 'all' && m.effort !== selectedEffort) {
        return false;
      }

      // Duration filter
      if (maxDuration > 0 && m.durationMinutes > maxDuration) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedEffort, maxDuration]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedEffort('all');
    setMaxDuration(0);
  };

  const handleStartMission = (mission: typeof CURATED_MISSIONS[0]) => {
    saveAdventure(mission);
    router.push(`/adventure/${mission.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Intro */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf-green)] uppercase tracking-wider">
          <TreePine className="w-3.5 h-3.5" />
          <span>Curated Nature Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Explore Outdoor Missions
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          A collection of verified, ready-to-use outdoor activities requiring zero API calls and zero setup. Filter by your schedule, effort level, and sensory focus.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by title, texture, birding, trees, park..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Category Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-1 focus:ring-[var(--leaf-green)]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Effort */}
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-2">
              Effort:
            </span>
            <select
              value={selectedEffort}
              onChange={(e) => setSelectedEffort(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-1 focus:ring-[var(--leaf-green)]"
            >
              <option value="all">All Efforts</option>
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="adventurous">Adventurous</option>
            </select>

            {/* Duration Filter */}
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-2">
              Max Time:
            </span>
            <select
              value={maxDuration}
              onChange={(e) => setMaxDuration(Number(e.target.value))}
              className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-1 focus:ring-[var(--leaf-green)]"
            >
              <option value={0}>Any Duration</option>
              <option value={15}>Up to 15 min</option>
              <option value={30}>Up to 30 min</option>
              <option value={45}>Up to 45 min</option>
              <option value={60}>Up to 60 min</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Grid of Missions */}
      {filteredMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--soft-sage)]/60 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] font-semibold capitalize">
                    {mission.category.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {mission.durationMinutes} min
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                  {mission.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {mission.description}
                </p>

                <div className="pt-2 text-xs space-y-1 text-[var(--text-muted)]">
                  <p>
                    <strong className="text-[var(--text-primary)]">Setting:</strong> {mission.locationType}
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)]">Effort:</strong>{' '}
                    <span className="capitalize">{mission.effort}</span>
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)]">Equipment:</strong>{' '}
                    {mission.equipment.join(', ')}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[var(--border-subtle)] space-y-2">
                <button
                  onClick={() => handleStartMission(mission)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] transition-all shadow-xs"
                >
                  <span>Start Distraction-Free Adventure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              No matching outdoor missions found
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Try adjusting your search terms or relaxing category and duration filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20]"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
