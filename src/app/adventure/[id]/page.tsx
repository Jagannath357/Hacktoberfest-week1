'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Clock,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Eye,
  Shield,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
} from 'lucide-react';
import {
  getAdventureById,
  updateAdventureProgress,
  saveAdventure,
} from '@/lib/storage/local-storage';
import { CURATED_MISSIONS } from '@/data/curated-missions';
import { AdventureMission, UserAdventureProgress } from '@/types/adventure';

import { Suspense } from 'react';

function MissionModeContent() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.id as string;

  const [adventureRecord, setAdventureRecord] = useState<UserAdventureProgress | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isScreenFreeMode, setIsScreenFreeMode] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Load mission from local storage or curated library
  useEffect(() => {
    let rec = getAdventureById(missionId);
    if (!rec) {
      // Check if it's one of the curated missions
      const curated = CURATED_MISSIONS.find((m) => m.id === missionId);
      if (curated) {
        rec = saveAdventure(curated);
      }
    }

    if (rec) {
      setAdventureRecord(rec);
      setCurrentStep(rec.currentStepIndex || 0);

      // Mark as in-progress if not completed
      if (rec.status !== 'completed') {
        updateAdventureProgress(rec.missionId, {
          status: 'in_progress',
          startedAt: rec.startedAt || new Date().toISOString(),
        });
      }
    }
  }, [missionId]);

  // Timer loop
  useEffect(() => {
    if (isPaused || isFinished || !adventureRecord) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isFinished, adventureRecord]);

  if (!adventureRecord) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Mission Not Found</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Could not find an active adventure with ID: {missionId}
        </p>
        <button
          onClick={() => router.push('/explore')}
          className="px-4 py-2 rounded-xl bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20] text-sm font-semibold"
        >
          Browse Mission Library
        </button>
      </div>
    );
  }

  const mission = adventureRecord.mission;
  const totalSteps = mission.steps.length;
  const stepData = mission.steps[currentStep] || mission.steps[0];

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      updateAdventureProgress(mission.id, { currentStepIndex: nextIdx });
    } else {
      handleFinish();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      updateAdventureProgress(mission.id, { currentStepIndex: prevIdx });
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    const minutesSpent = Math.max(1, Math.round(secondsElapsed / 60));

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7BAE70', '#173D2B', '#E8BE71', '#2E7D32'],
      });
    } catch (_) {}

    updateAdventureProgress(mission.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      timeSpentMinutes: minutesSpent,
    });
  };

  const handleGoToJournal = () => {
    const minutesSpent = Math.max(1, Math.round(secondsElapsed / 60));
    const query = new URLSearchParams({
      missionId: mission.id,
      missionTitle: mission.title,
      duration: minutesSpent.toString(),
    });
    router.push(`/journal?${query.toString()}`);
  };

  return (
    <div
      className={`min-h-[85vh] transition-colors ${
        isScreenFreeMode
          ? 'bg-[#0A1610] text-[#F8F7F0] flex flex-col justify-between p-6 sm:p-12'
          : 'max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6'
      }`}
    >
      {/* SCREEN-FREE ULTRA MINIMAL MODE */}
      {isScreenFreeMode ? (
        <div className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full space-y-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7BAE70] uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Screen-Free Focus Mode</span>
            </div>
            <button
              onClick={() => setIsScreenFreeMode(false)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
            >
              Exit Minimal Mode
            </button>
          </div>

          {/* Current Step Instruction (High Contrast & Large Typography) */}
          <div className="space-y-6 my-auto text-center">
            <div className="text-xs font-bold tracking-widest text-[#7BAE70] uppercase">
              Step {currentStep + 1} of {totalSteps} &bull; {stepData.durationMinutes} min
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {stepData.title}
            </h1>
            <p className="text-lg sm:text-xl text-[#D4DDD5] leading-relaxed max-w-xl mx-auto">
              {stepData.description}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-sm text-[#E8BE71] font-medium">
              &ldquo;{mission.screenFreeChallenge}&rdquo;
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-xl text-white tracking-widest">
                {formatTimer(secondsElapsed)}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-xs px-3 py-1.5 rounded bg-white/10 text-white flex items-center gap-1.5"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevStep}
                  className="py-3 px-5 rounded-xl bg-white/10 text-white font-semibold text-sm"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="flex-1 py-4 px-6 rounded-xl bg-[#7BAE70] text-[#102A20] font-bold text-base shadow-lg hover:bg-[#8cc281]"
              >
                {currentStep === totalSteps - 1 ? 'Finish Adventure' : 'Next Step →'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD POLISHED MISSION MODE */
        <>
          {/* Top Header & Reminder */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf-green)]">
                  Active Outdoor Adventure
                </span>
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
                  {mission.title}
                </h1>
              </div>

              {/* Screen Free Toggle */}
              <button
                onClick={() => setIsScreenFreeMode(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] hover:opacity-90 transition-opacity"
              >
                <Smartphone className="w-4 h-4" />
                <span>Screen-Free Mode</span>
              </button>
            </div>

            {/* Motivational Banner */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/70 text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-[var(--leaf-green)] shrink-0 mt-0.5" />
              <p>
                <strong>Remember:</strong> Your adventure is out there. Check your essentials, then give yourself permission to put your phone away.
              </p>
            </div>

            {/* Timer & Progress Bar */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--text-muted)]">
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-[var(--text-primary)] font-bold">
                    ⏱ {formatTimer(secondsElapsed)}
                  </span>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--leaf-green)] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Step Active Card */}
          {!isFinished ? (
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Current Step Action
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--soft-sage)]/60 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)]">
                  ~{stepData.durationMinutes} Minutes
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  {stepData.title}
                </h2>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                  {stepData.description}
                </p>
              </div>

              {/* Screen Free Challenge Reminder */}
              <div className="p-4 rounded-xl bg-[var(--leaf-green)]/10 border border-[var(--leaf-green)]/30 text-xs text-[var(--text-primary)] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[var(--leaf-green)]">
                  <Smartphone className="w-4 h-4" />
                  <span>Screen-Free Challenge</span>
                </div>
                <p>{mission.screenFreeChallenge}</p>
              </div>

              {/* Observation Prompts */}
              {mission.observationPrompts && mission.observationPrompts.length > 0 && (
                <div className="p-4 rounded-xl bg-[var(--bg-subtle)]/60 text-xs space-y-1.5">
                  <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                    Sensory Focus
                  </span>
                  <p className="text-[var(--text-secondary)] italic">
                    &ldquo;{mission.observationPrompts[currentStep % mission.observationPrompts.length]}&rdquo;
                  </p>
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-sm transition-all"
                >
                  <span>
                    {currentStep === totalSteps - 1 ? 'Finish Adventure' : 'Next Step'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* MISSION COMPLETED CELEBRATION CARD */
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-8 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[var(--leaf-green)] text-white dark:text-[#102A20] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-9 h-9 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
                  Adventure Completed!
                </h2>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  You spent approximately{' '}
                  <strong className="text-[var(--leaf-green)]">
                    {Math.max(1, Math.round(secondsElapsed / 60))} minutes
                  </strong>{' '}
                  exploring the physical world without screen distractions.
                </p>
              </div>

              {/* Reflection question */}
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] max-w-lg mx-auto italic">
                &ldquo;{mission.reflectionPrompt}&rdquo;
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleGoToJournal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-[var(--forest-deep)] hover:bg-[#1a4732] text-white dark:bg-[var(--leaf-green)] dark:hover:bg-[#8cc281] dark:text-[#102A20] shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Record Nature Reflection in Journal</span>
                </button>

                <button
                  onClick={() => router.push('/my-adventures')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                >
                  View My Adventures
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MissionModePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--text-muted)]">Loading Adventure Mission...</div>}>
      <MissionModeContent />
    </Suspense>
  );
}
