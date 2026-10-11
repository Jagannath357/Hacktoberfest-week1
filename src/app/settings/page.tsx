'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Cpu,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Wifi,
  Sparkles,
  Info,
} from 'lucide-react';
import { clearAllLocalData } from '@/lib/storage/local-storage';

interface HealthData {
  status: string;
  application: string;
  version: string;
  aiConfig: {
    provider: string;
    model: string;
    apiKeyConfigured: boolean;
    fallbackEngine: string;
  };
  timestamp: string;
}

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);
  const [clearedNotice, setClearedNotice] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoadingHealth(false);
      })
      .catch((err) => {
        console.error('Failed to load health info:', err);
        setLoadingHealth(false);
      });
  }, []);

  const handleClearData = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }

    clearAllLocalData();
    setConfirmClear(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf-green)] uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>System Transparency &amp; Privacy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Settings &amp; Architecture
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          TerraQuest AI operates on a local-first philosophy. Read transparent details on data storage, AI model configuration, and manage your browser storage.
        </p>
      </div>

      {/* Cleared Notification */}
      {clearedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All saved missions, journal reflections, and preferences have been cleared.</span>
        </div>
      )}

      {/* Section 1: AI Provider Status */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              AI Model &amp; Provider Configuration
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Live server-side diagnostic status
            </p>
          </div>
        </div>

        {loadingHealth ? (
          <p className="text-xs text-[var(--text-muted)]">Querying AI diagnostic endpoint...</p>
        ) : health ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/60 space-y-1">
              <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
                Configured Model
              </span>
              <p className="font-mono font-bold text-[var(--text-primary)]">
                {health.aiConfig.model}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Compatible with Gemma open-weight architecture
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/60 space-y-1">
              <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
                Active AI Provider
              </span>
              <p className="font-mono font-bold text-[var(--text-primary)] capitalize">
                {health.aiConfig.provider}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {health.aiConfig.apiKeyConfigured
                  ? 'API key active (Google AI Studio endpoint)'
                  : 'Zero-config curated engine mode'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/60 space-y-1 sm:col-span-2">
              <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
                Resilience &amp; Fallback Architecture
              </span>
              <p className="font-medium text-[var(--text-primary)]">
                {health.aiConfig.fallbackEngine}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                If the remote AI endpoint reaches rate limits, quota exhaustion, or goes offline, TerraQuest seamlessly routes through the deterministic curated engine without disrupting your outdoor plans.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-rose-500">Failed to query health diagnostic route.</p>
        )}
      </div>

      {/* Section 2: Data Privacy Disclosures */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--soft-sage)]/70 dark:bg-[var(--soft-sage)]/20 text-[var(--forest-deep)] dark:text-[var(--leaf-light)] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Where Your Data Lives
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Honest privacy commitments
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/40 space-y-1">
            <h3 className="font-bold text-[var(--text-primary)]">
              1. 100% In-Browser Persistence
            </h3>
            <p>
              Your saved adventures, progress timestamps, and nature journal reflections are stored exclusively in your browser&apos;s <code className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--forest-deep)] dark:text-[var(--leaf-light)] font-mono">localStorage</code>. TerraQuest does not transmit, store, or profile your personal journal entries on any database or remote server.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/40 space-y-1">
            <h3 className="font-bold text-[var(--text-primary)]">
              2. What Gets Sent to the AI Endpoint
            </h3>
            <p>
              Only the non-sensitive outdoor preferences selected on the Adventure Generator form (available duration, broad category, energy level, group size, and any voluntary neighborhood text) are passed to the server-side AI route during live generation.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)]/40 space-y-1">
            <h3 className="font-bold text-[var(--text-primary)]">
              3. Online Inference vs. Offline Fallback
            </h3>
            <p>
              When remote AI inference is used via Google AI Studio, network requests are made server-side to the API endpoint. We do not misrepresent remote inference as offline execution. However, the Curated Mission Library (`/explore`) and Fallback engine execute 100% offline.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Data Management & Reset */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-rose-500/20 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Clear Local Storage
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Permanently wipe all locally saved adventures, journal reflections, and preferences.
            </p>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          This action will immediately delete all entries from browser storage. Make sure to export your journal (via CSV or JSON on the Nature Journal page) if you wish to keep a copy.
        </p>

        <div>
          {confirmClear ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Are you sure? This action cannot be undone.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  Yes, Clear All Data
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Local Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
