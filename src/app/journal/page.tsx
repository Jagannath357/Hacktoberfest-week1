'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Clock,
  Star,
  Plus,
  Trash2,
  Edit3,
  Download,
  Share2,
  CheckCircle2,
  X,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
  exportJournalAsJSON,
  exportJournalAsCSV,
  getSavedAdventures,
} from '@/lib/storage/local-storage';
import { JournalEntry } from '@/types/adventure';

function JournalPageContent() {
  const searchParams = useSearchParams();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formMissionTitle, setFormMissionTitle] = useState<string>('');
  const [formMissionId, setFormMissionId] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formDuration, setFormDuration] = useState<number>(15);
  const [formWhatINoticed, setFormWhatINoticed] = useState<string>('');
  const [formFeltBefore, setFormFeltBefore] = useState<string>('Fatigued by screens and sedentary work');
  const [formFeltAfter, setFormFeltAfter] = useState<string>('Refreshed, observant, and grounded');
  const [formMemorableMoment, setFormMemorableMoment] = useState<string>('');
  const [formRating, setFormRating] = useState<number>(5);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    refreshEntries();

    // Check if routed directly from a completed adventure
    const paramMissionId = searchParams.get('missionId');
    const paramTitle = searchParams.get('title') || searchParams.get('missionTitle');
    const paramDuration = searchParams.get('duration');

    if (paramTitle || paramMissionId) {
      setFormMissionTitle(paramTitle || 'Outdoor Adventure');
      if (paramMissionId) setFormMissionId(paramMissionId);
      if (paramDuration) setFormDuration(Number(paramDuration) || 15);
      setIsEditorOpen(true);
    }
  }, [searchParams]);

  const refreshEntries = () => {
    setEntries(getJournalEntries());
  };

  const resetForm = () => {
    setEditingId(null);
    setFormMissionTitle('');
    setFormMissionId('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDuration(15);
    setFormWhatINoticed('');
    setFormFeltBefore('Mentally scattered from device notifications');
    setFormFeltAfter('Clearheaded, grounded, and present');
    setFormMemorableMoment('');
    setFormRating(5);
  };

  const handleOpenNew = () => {
    resetForm();
    setIsEditorOpen(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setFormMissionTitle(entry.missionTitle);
    setFormMissionId(entry.missionId || '');
    setFormDate(entry.date);
    setFormDuration(entry.durationMinutes);
    setFormWhatINoticed(entry.whatINoticed);
    setFormFeltBefore(entry.feltBefore);
    setFormFeltAfter(entry.feltAfter);
    setFormMemorableMoment(entry.memorableMoment);
    setFormRating(entry.rating || 5);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete reflection for "${title}"?`)) {
      deleteJournalEntry(id);
      refreshEntries();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formMissionTitle.trim() || !formWhatINoticed.trim()) {
      alert('Please fill out the mission title and what you noticed.');
      return;
    }

    saveJournalEntry({
      id: editingId || undefined,
      missionId: formMissionId || undefined,
      missionTitle: formMissionTitle.trim(),
      date: formDate,
      durationMinutes: formDuration,
      whatINoticed: formWhatINoticed.trim(),
      feltBefore: formFeltBefore.trim(),
      feltAfter: formFeltAfter.trim(),
      memorableMoment: formMemorableMoment.trim(),
      rating: formRating,
    });

    setIsEditorOpen(false);
    resetForm();
    refreshEntries();
    setNotification('Journal reflection saved to your private local storage!');
    setTimeout(() => setNotification(null), 4000);
  };

  // Export handlers
  const handleDownloadJSON = () => {
    const data = exportJournalAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terraquest-journal-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const data = exportJournalAsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terraquest-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf-green)] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Private Reflection Space</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Nature Journal
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Capture what you touched, saw, and felt outdoors. Private to your device.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {entries.length > 0 && (
            <>
              <button
                onClick={handleDownloadCSV}
                title="Export as CSV"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={handleDownloadJSON}
                title="Export as JSON"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </>
          )}

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20] shadow-xs hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>New Reflection</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Editor Modal / Inline Form */}
      {isEditorOpen && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[var(--leaf-green)]" />
              <span>{editingId ? 'Edit Nature Reflection' : 'Record New Reflection'}</span>
            </h2>
            <button
              onClick={() => {
                setIsEditorOpen(false);
                resetForm();
              }}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  Adventure Title
                </label>
                <input
                  type="text"
                  required
                  value={formMissionTitle}
                  onChange={(e) => setFormMissionTitle(e.target.value)}
                  placeholder="e.g. 15-Minute Green Reset, Birdwatching by the River..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  Outdoor Minutes
                </label>
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={formDuration}
                  onChange={(e) => setFormDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  Experience Rating
                </label>
                <div className="flex items-center gap-1.5 pt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 text-[var(--sunlight)] hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formRating ? 'fill-current' : 'stroke-current fill-transparent opacity-40'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[var(--text-muted)] ml-2">{formRating} / 5</span>
                </div>
              </div>
            </div>

            {/* What I Noticed */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                What I Noticed Outdoors (Sensory details: sight, hearing, touch, scents)
              </label>
              <textarea
                required
                rows={3}
                value={formWhatINoticed}
                onChange={(e) => setFormWhatINoticed(e.target.value)}
                placeholder="I noticed the cool dampness of tree bark, the distinct rhythm of a woodpecker, and how bright the afternoon sunlight looked when uncurtered by phone glare..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
              />
            </div>

            {/* Before vs After */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  How I Felt Before Going Outside
                </label>
                <input
                  type="text"
                  value={formFeltBefore}
                  onChange={(e) => setFormFeltBefore(e.target.value)}
                  placeholder="e.g. Brain fog, tight shoulders from keyboard..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  How I Felt Afterward
                </label>
                <input
                  type="text"
                  value={formFeltAfter}
                  onChange={(e) => setFormFeltAfter(e.target.value)}
                  placeholder="e.g. Grounded, relaxed breathing, mentally awake..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Memorable moment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                A Memorable Moment from Today
              </label>
              <input
                type="text"
                value={formMemorableMoment}
                onChange={(e) => setFormMemorableMoment(e.target.value)}
                placeholder="e.g. Watching two sparrows take a dust bath on the dry pathway..."
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--leaf-green)] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setIsEditorOpen(false);
                  resetForm();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20] shadow-xs"
              >
                {editingId ? 'Save Changes' : 'Save Reflection'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {entry.missionTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {entry.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 font-medium text-[var(--leaf-green)]">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.durationMinutes} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {entry.rating && (
                    <div className="flex items-center gap-0.5 text-[var(--sunlight)]">
                      {Array.from({ length: entry.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 pl-2 border-l border-[var(--border-subtle)]">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                      title="Edit entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id, entry.missionTitle)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-500/10"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Sensory Observations
                  </span>
                  <p className="text-[var(--text-primary)] leading-relaxed bg-[var(--bg-subtle)]/50 p-3 rounded-xl">
                    {entry.whatINoticed}
                  </p>
                </div>

                {/* State shift */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[var(--bg-subtle)]/40">
                    <span className="font-bold text-[var(--text-muted)] block mb-0.5">
                      Before Outside:
                    </span>
                    <p className="text-[var(--text-secondary)] italic">
                      &ldquo;{entry.feltBefore}&rdquo;
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--leaf-green)]/10 border border-[var(--leaf-green)]/20">
                    <span className="font-bold text-[var(--leaf-green)] block mb-0.5">
                      After Reflection:
                    </span>
                    <p className="text-[var(--text-primary)] font-medium">
                      &ldquo;{entry.feltAfter}&rdquo;
                    </p>
                  </div>
                </div>

                {entry.memorableMoment && (
                  <p className="text-[var(--text-muted)] text-[11px]">
                    <strong className="text-[var(--text-primary)]">Memorable Moment:</strong>{' '}
                    {entry.memorableMoment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--soft-sage)]/50 dark:bg-[var(--soft-sage)]/20 text-[var(--leaf-green)] flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Your journal is ready
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Whenever you return from an outdoor expedition, jot down 2-3 sentences here. Writing cements the positive neurological shift of nature.
            </p>
          </div>
          <button
            onClick={handleOpenNew}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--forest-deep)] text-white dark:bg-[var(--leaf-green)] dark:text-[#102A20]"
          >
            Write First Reflection
          </button>
        </div>
      )}
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--text-muted)]">Loading Nature Journal...</div>}>
      <JournalPageContent />
    </Suspense>
  );
}
