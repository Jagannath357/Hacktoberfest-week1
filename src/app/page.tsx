'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Sparkles,
  Clock,
  MapPin,
  ArrowRight,
  Shield,
  Smartphone,
  CheckCircle2,
  TreePine,
  Footprints,
  Eye,
  Camera,
  Heart,
  Users,
} from 'lucide-react';
import { CURATED_MISSIONS } from '@/data/curated-missions';
import { saveAdventure } from '@/lib/storage/local-storage';

export default function HomePage() {
  const router = useRouter();
  const [quickDuration, setQuickDuration] = useState<number>(15);
  const [quickCategory, setQuickCategory] = useState<string>('surprise_me');
  const [quickEffort, setQuickEffort] = useState<string>('relaxed');
  const [quickLocation, setQuickLocation] = useState<string>('');

  const featuredMissions = CURATED_MISSIONS.slice(0, 3);

  const handleQuickStart = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      duration: quickDuration.toString(),
      category: quickCategory,
      effort: quickEffort,
      ...(quickLocation.trim() ? { location: quickLocation.trim() } : {}),
    });
    router.push(`/create?${query.toString()}`);
  };

  const handleStartMission = (mission: typeof CURATED_MISSIONS[0]) => {
    saveAdventure(mission);
    router.push(`/adventure/${mission.id}`);
  };

  return (
    <div className="w-full pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--soft-sage),_transparent_70%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Supporting Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] border border-[var(--border-subtle)] shadow-xs">
              <TreePine className="w-4 h-4 text-[var(--leaf-green)]" />
              <span>Designed to get you outdoors, not keep you scrolling</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.12]">
              Your next great adventure{' '}
              <span className="text-[var(--leaf-green)] underline decoration-[var(--sunlight)] decoration-wavy decoration-2 underline-offset-8">
                starts outside.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-normal max-w-2xl mx-auto">
              Tell us how much time you have, step away from your screen, and discover a little more of the physical world around you.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-5 h-5" />
                <span>Find My Adventure</span>
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs transition-colors"
              >
                <Compass className="w-5 h-5 text-[var(--leaf-green)]" />
                <span>Explore Nature Missions</span>
              </Link>
            </div>
          </div>

          {/* Quick-Start Experience Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-5 border-b border-[var(--border-subtle)] mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-[var(--leaf-green)]" />
                    <span>Quick-Start Adventure Planner</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Tailor your outdoor mission in 10 seconds. AI handles preparation; you step outdoors.
                  </p>
                </div>
                <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-1 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                  Free &bull; No Login Required
                </span>
              </div>

              <form onSubmit={handleQuickStart} className="space-y-6">
                {/* Available Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[var(--leaf-green)]" />
                    <span>Available Time</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {[10, 15, 30, 60, 120].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setQuickDuration(mins)}
                        className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center border ${
                          quickDuration === mins
                            ? 'bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] border-transparent shadow-xs'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--leaf-green)]'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                      Activity Focus
                    </label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                    >
                      <option value="surprise_me">✨ Surprise Me (Balanced Mix)</option>
                      <option value="walking">🚶 Mindful Nature Walk</option>
                      <option value="gardening">🌱 Balcony &amp; Soil Gardening</option>
                      <option value="birdwatching">🐦 Birdwatching &amp; Acoustics</option>
                      <option value="nature_photography">📷 Nature Photography</option>
                      <option value="mindful_observation">🧘 Sensory Observation</option>
                      <option value="family_exploration">👨‍👩‍👦 Family Exploration</option>
                      <option value="outdoor_fitness">⚡ Outdoor Vitality &amp; Fitness</option>
                      <option value="local_discovery">🧭 Local Discovery Trail</option>
                    </select>
                  </div>

                  {/* Energy Level */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                      Energy Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'relaxed', label: 'Relaxed' },
                        { id: 'moderate', label: 'Moderate' },
                        { id: 'adventurous', label: 'Adventurous' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setQuickEffort(item.id)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                            quickEffort === item.id
                              ? 'bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] border-transparent font-semibold'
                              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--leaf-green)]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optional Location Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--leaf-green)]" />
                      <span>Nearby Setting or Neighborhood (Optional)</span>
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-normal">
                      No precise GPS required
                    </span>
                  </label>
                  <input
                    type="text"
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                    placeholder="e.g. City park, leafy suburban street, river greenway, balcony..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-base bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Personalized Outdoor Mission</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Missions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf-green)] uppercase tracking-wider mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Curated Ready-to-Go Activities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Featured Nature Missions
            </h2>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--leaf-green)] hover:underline"
          >
            <span>Browse Full Library ({CURATED_MISSIONS.length}+ missions)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMissions.map((mission) => (
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

                <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-1">
                  {mission.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                  {mission.description}
                </p>

                <div className="pt-2 text-xs space-y-1 text-[var(--text-muted)]">
                  <p>
                    <strong className="text-[var(--text-primary)]">Setting:</strong> {mission.locationType}
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)]">Equipment:</strong> {mission.equipment[0]}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => handleStartMission(mission)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--forest-deep)] hover:text-white dark:hover:bg-[var(--leaf-green)] dark:hover:text-[#102A20] text-[var(--text-primary)] transition-all"
                >
                  <span>Start Distraction-Free Adventure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[var(--bg-subtle)]/50 border-y border-[var(--border-subtle)] py-16 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              How TerraQuest Works
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Three simple steps engineered to break infinite scrolling loops and reconnect you with reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-subtle)] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] flex items-center justify-center mx-auto font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Share Available Time &amp; Energy
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Whether you have 10 minutes between video calls or an unhurried weekend hour, pick your preferred pace.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-subtle)] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] flex items-center justify-center mx-auto font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Get a Practical Outdoor Mission
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Receive a structured mission card with safety notes, observation sensory prompts, and a screen-free challenge.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-subtle)] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] flex items-center justify-center mx-auto font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Put Your Phone Away &amp; Explore
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Enter minimal mission mode, pocket your device, experience the living world, and reflect in your journal afterward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Product Philosophy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf-green)]">
              Core Product Principle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              &ldquo;AI creates the plan. The user experiences the world.&rdquo;
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Most AI apps compete for your screen time with endless conversational threads. TerraQuest AI does the exact opposite: it provides concise, structured guidance so you can turn off notifications, leave your desk, and engage your sight, hearing, touch, and breath with the physical earth.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--leaf-green)]" />
                <span>Zero Chatbot Fluff</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--leaf-green)]" />
                <span>Open-Weight Gemma AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--leaf-green)]" />
                <span>100% Private In-Browser Storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
