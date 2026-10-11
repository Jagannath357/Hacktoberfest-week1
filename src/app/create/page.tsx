'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Clock,
  MapPin,
  Shield,
  Smartphone,
  CheckCircle2,
  Bookmark,
  Play,
  RotateCcw,
  ArrowLeft,
  Info,
  AlertTriangle,
  Flame,
  Users,
  Compass,
} from 'lucide-react';
import {
  ActivityCategory,
  EffortLevel,
  GroupType,
  BudgetType,
  AdventureMission,
  AdventureRequestInput,
} from '@/types/adventure';
import { saveAdventure, getSavedPreferences, savePreferences } from '@/lib/storage/local-storage';

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form states
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [category, setCategory] = useState<ActivityCategory>('surprise_me');
  const [effort, setEffort] = useState<EffortLevel>('relaxed');
  const [group, setGroup] = useState<GroupType>('solo');
  const [budget, setBudget] = useState<BudgetType>('free_only');
  const [location, setLocation] = useState<string>('');
  const [accessibilityNotes, setAccessibilityNotes] = useState<string>('');

  // UI status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedMission, setGeneratedMission] = useState<AdventureMission | null>(null);
  const [generationMeta, setGenerationMeta] = useState<{
    source: string;
    model: string;
    notice?: string;
  } | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Initialize from query parameters or saved preferences
  useEffect(() => {
    const qDuration = searchParams.get('duration');
    const qCategory = searchParams.get('category') as ActivityCategory | null;
    const qEffort = searchParams.get('effort') as EffortLevel | null;
    const qLocation = searchParams.get('location');

    if (qDuration) setDurationMinutes(Number(qDuration) || 15);
    if (qCategory) setCategory(qCategory);
    if (qEffort) setEffort(qEffort);
    if (qLocation) setLocation(qLocation);

    if (!qDuration && !qCategory && !qEffort) {
      const savedPrefs = getSavedPreferences();
      if (savedPrefs) {
        if (savedPrefs.durationMinutes) setDurationMinutes(savedPrefs.durationMinutes);
        if (savedPrefs.category) setCategory(savedPrefs.category);
        if (savedPrefs.effort) setEffort(savedPrefs.effort);
        if (savedPrefs.group) setGroup(savedPrefs.group);
        if (savedPrefs.budget) setBudget(savedPrefs.budget);
        if (savedPrefs.location) setLocation(savedPrefs.location);
        if (savedPrefs.accessibilityNotes) setAccessibilityNotes(savedPrefs.accessibilityNotes);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedMission(null);
    setIsSaved(false);

    const payload: AdventureRequestInput = {
      durationMinutes,
      category,
      effort,
      group,
      budget,
      location: location.trim(),
      accessibilityNotes: accessibilityNotes.trim(),
    };

    savePreferences(payload);

    try {
      const res = await fetch('/api/adventures/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate adventure');
      }

      setGeneratedMission(data.data);
      setGenerationMeta(data.meta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during generation';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedMission) return;
    saveAdventure(generatedMission);
    setIsSaved(true);
  };

  const handleStart = () => {
    if (!generatedMission) return;
    saveAdventure(generatedMission);
    router.push(`/adventure/${generatedMission.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => (generatedMission ? setGeneratedMission(null) : router.push('/'))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{generatedMission ? 'Back to Preferences' : 'Back to Home'}</span>
        </button>

        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {generatedMission ? 'Your Outdoor Mission Card' : 'Design Your Adventure'}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {generatedMission
            ? 'Review essentials, prepare your senses, and step away from the screen.'
            : 'Customized to your schedule, location, and mobility. Zero conversational fluff.'}
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Generation Notice</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs underline hover:no-underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* View 1: Preference Input Form */}
      {!generatedMission && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* 1. Time Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--leaf-green)]" />
                <span>Available Outdoor Time</span>
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[10, 15, 30, 60, 120].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center border ${
                      durationMinutes === mins
                        ? 'bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] border-transparent shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--leaf-green)]'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                Activity Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'surprise_me', label: '✨ Surprise Me' },
                  { id: 'walking', label: '🚶 Mindful Walking' },
                  { id: 'birdwatching', label: '🐦 Birding & Sound' },
                  { id: 'gardening', label: '🌱 Balcony / Soil' },
                  { id: 'nature_photography', label: '📷 Nature Photography' },
                  { id: 'mindful_observation', label: '🧘 Sensory Stillness' },
                  { id: 'family_exploration', label: '👨‍👩‍👦 Family Safari' },
                  { id: 'outdoor_fitness', label: '⚡ Natural Terrain Agility' },
                  { id: 'local_discovery', label: '🧭 Urban Wilderness Trail' },
                ].map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id as ActivityCategory)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left border transition-all ${
                      category === cat.id
                        ? 'bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] border-transparent font-semibold shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--leaf-green)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Energy Level & Group Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[var(--leaf-green)]" />
                  <span>Energy &amp; Effort Level</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'relaxed', label: 'Relaxed' },
                    { id: 'moderate', label: 'Moderate' },
                    { id: 'adventurous', label: 'Adventurous' },
                  ].map((eff) => (
                    <button
                      type="button"
                      key={eff.id}
                      onClick={() => setEffort(eff.id as EffortLevel)}
                      className={`py-2 text-center rounded-xl text-xs font-medium border transition-all ${
                        effort === eff.id
                          ? 'bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] border-transparent font-semibold shadow-xs'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--leaf-green)]'
                      }`}
                    >
                      {eff.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--leaf-green)]" />
                  <span>Group Dynamics</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'solo', label: 'Solo' },
                    { id: 'friends', label: 'Friends' },
                    { id: 'family', label: 'Family' },
                    { id: 'any', label: 'Any' },
                  ].map((grp) => (
                    <button
                      type="button"
                      key={grp.id}
                      onClick={() => setGroup(grp.id as GroupType)}
                      className={`py-2 text-center rounded-xl text-xs font-medium border transition-all ${
                        group === grp.id
                          ? 'bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] border-transparent font-semibold shadow-xs'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--leaf-green)]'
                      }`}
                    >
                      {grp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Location & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--leaf-green)]" />
                    <span>Nearby Location / Setting (Optional)</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. City park, leafy neighborhood, balcony, river trail..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  Budget Preference
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as BudgetType)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                >
                  <option value="free_only">Free Only (Zero Cost)</option>
                  <option value="low_cost">Low Cost (Household items / seeds)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* 5. Accessibility Considerations */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                Accessibility or Mobility Considerations (Optional)
              </label>
              <input
                type="text"
                value={accessibilityNotes}
                onChange={(e) => setAccessibilityNotes(e.target.value)}
                placeholder="e.g. Paved wheelchair accessible paths, seated-only, low-impact knees..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-base bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Architecting Real-World Mission...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Outdoor Mission</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View 2: Generated Mission Card */}
      {generatedMission && (
        <div className="space-y-6">
          {/* Transparency / Source Notice Badge */}
          {generationMeta && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[var(--leaf-green)] shrink-0" />
                <span>{generationMeta.notice || 'Generated successfully.'}</span>
              </div>
              <span className="font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)]">
                {generationMeta.source === 'ai_gemma' ? 'Gemma Open-Weight' : 'Curated Engine'}
              </span>
            </div>
          )}

          {/* Main Mission Card */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header / Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)]">
                  {generatedMission.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] capitalize">
                  Effort: {generatedMission.effort}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--leaf-green)] bg-[var(--leaf-green)]/10 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span>{generatedMission.durationMinutes} Minutes</span>
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {generatedMission.title}
              </h2>
              <p className="text-sm font-medium text-[var(--leaf-green)] mt-1">
                {generatedMission.tagline}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                {generatedMission.description}
              </p>
            </div>

            {/* Location & Equipment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--bg-subtle)]/60 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Setting / Space
                </span>
                <p className="text-[var(--text-primary)] font-medium">
                  {generatedMission.locationType}
                </p>
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  What to Bring
                </span>
                <ul className="text-[var(--text-primary)] font-medium list-disc list-inside space-y-0.5">
                  {generatedMission.equipment.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Preparation Steps */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--leaf-green)]" />
                <span>Before Stepping Outside</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {generatedMission.preparation.map((prep, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  >
                    &bull; {prep}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Sequence */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
                Action Sequence ({generatedMission.steps.length} Steps)
              </h3>
              <div className="space-y-3">
                {generatedMission.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--forest-deep)] dark:bg-[var(--leaf-green)] text-white dark:text-[#102A20] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">
                          {step.title}
                        </h4>
                        <span className="text-xs font-semibold text-[var(--leaf-green)]">
                          {step.durationMinutes} min
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Screen-Free Challenge Box */}
            <div className="p-4 rounded-xl border border-[var(--leaf-green)]/40 bg-[var(--leaf-green)]/10 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[var(--leaf-green)]">
                <Smartphone className="w-4 h-4" />
                <span>Screen-Free Challenge</span>
              </div>
              <p className="text-[var(--text-primary)] font-medium">
                {generatedMission.screenFreeChallenge}
              </p>
            </div>

            {/* Observation Prompts & Safety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)]/60 space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Sensory Observation Prompts
                </h4>
                <ul className="space-y-1 text-[var(--text-secondary)] list-disc list-inside">
                  {generatedMission.observationPrompts.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-subtle)]/60 space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[var(--leaf-green)]" />
                  <span>Outdoor Safety &amp; Ethics</span>
                </h4>
                <ul className="space-y-1 text-[var(--text-secondary)] list-disc list-inside">
                  {generatedMission.safetyNotes.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Post-Mission Reflection */}
            <div className="p-4 rounded-xl bg-[var(--bg-subtle)]/60 text-xs">
              <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                Post-Adventure Reflection Prompt
              </h4>
              <p className="italic text-[var(--text-secondary)]">
                &ldquo;{generatedMission.reflectionPrompt}&rdquo;
              </p>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleStart}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-sm transition-all hover:shadow"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Distraction-Free Adventure</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaved}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors disabled:opacity-60"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[var(--leaf-green)] text-[var(--leaf-green)]' : ''}`} />
                <span>{isSaved ? 'Saved to My Adventures' : 'Save Mission'}</span>
              </button>

              <button
                onClick={() => setGeneratedMission(null)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Adjust Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateAdventurePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--text-muted)]">Loading Adventure Generator...</div>}>
      <CreatePageContent />
    </Suspense>
  );
}
