'use client';

import {
  AdventureMission,
  UserAdventureProgress,
  JournalEntry,
  AdventureStats,
  AdventureRequestInput,
} from '@/types/adventure';

const STORAGE_KEYS = {
  ADVENTURES: 'terraquest_adventures',
  JOURNAL: 'terraquest_journal',
  PREFERENCES: 'terraquest_preferences',
  THEME: 'terraquest_theme',
};

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// Adventures Storage
export function getSavedAdventures(): UserAdventureProgress[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADVENTURES);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse saved adventures from localStorage:', err);
    return [];
  }
}

export function saveAdventure(mission: AdventureMission): UserAdventureProgress {
  if (!isClient()) {
    return {
      missionId: mission.id,
      mission,
      status: 'saved',
      currentStepIndex: 0,
      savedAt: new Date().toISOString(),
    };
  }

  const existing = getSavedAdventures();
  const index = existing.findIndex((a) => a.missionId === mission.id);

  if (index >= 0) {
    return existing[index];
  }

  const newRecord: UserAdventureProgress = {
    missionId: mission.id,
    mission,
    status: 'saved',
    currentStepIndex: 0,
    savedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...existing];
  try {
    localStorage.setItem(STORAGE_KEYS.ADVENTURES, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save adventure to localStorage:', err);
  }
  return newRecord;
}

export function getAdventureById(id: string): UserAdventureProgress | null {
  const adventures = getSavedAdventures();
  return adventures.find((a) => a.missionId === id) || null;
}

export function updateAdventureProgress(
  id: string,
  updates: Partial<UserAdventureProgress>
): UserAdventureProgress | null {
  if (!isClient()) return null;
  const existing = getSavedAdventures();
  const index = existing.findIndex((a) => a.missionId === id);

  if (index === -1) return null;

  const updatedRecord = {
    ...existing[index],
    ...updates,
  };

  existing[index] = updatedRecord;
  try {
    localStorage.setItem(STORAGE_KEYS.ADVENTURES, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to update adventure progress in localStorage:', err);
  }
  return updatedRecord;
}

export function deleteAdventure(id: string): void {
  if (!isClient()) return;
  const existing = getSavedAdventures();
  const filtered = existing.filter((a) => a.missionId !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.ADVENTURES, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete adventure from localStorage:', err);
  }
}

// Journal Storage
export function getJournalEntries(): JournalEntry[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse journal from localStorage:', err);
    return [];
  }
}

export function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'> & { id?: string }): JournalEntry {
  const existing = getJournalEntries();
  const id = entry.id || `journal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const existingIdx = existing.findIndex((j) => j.id === id);

  let fullEntry: JournalEntry;
  if (existingIdx >= 0) {
    fullEntry = {
      ...existing[existingIdx],
      ...entry,
      id,
      updatedAt: now,
    };
    existing[existingIdx] = fullEntry;
  } else {
    fullEntry = {
      ...entry,
      id,
      createdAt: now,
    };
    existing.unshift(fullEntry);
  }

  if (isClient()) {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save journal entry to localStorage:', err);
    }
  }

  return fullEntry;
}

export function deleteJournalEntry(id: string): void {
  if (!isClient()) return;
  const existing = getJournalEntries();
  const filtered = existing.filter((j) => j.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete journal entry from localStorage:', err);
  }
}

// Computed Statistics
export function calculateAdventureStats(): AdventureStats {
  const adventures = getSavedAdventures();
  const journal = getJournalEntries();

  const completed = adventures.filter((a) => a.status === 'completed');
  
  // Calculate total outdoor minutes from completed adventures
  const totalMinutes = completed.reduce((sum, a) => {
    return sum + (a.timeSpentMinutes || a.mission.durationMinutes || 0);
  }, 0);

  const categoryCounts: Record<string, number> = {};
  completed.forEach((a) => {
    const cat = a.mission.category || 'walking';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return {
    totalMinutes,
    completedCount: completed.length,
    savedCount: adventures.length,
    journalCount: journal.length,
    categoryCounts,
  };
}

// Preferences Storage
export function getSavedPreferences(): Partial<AdventureRequestInput> | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePreferences(prefs: Partial<AdventureRequestInput>): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences to localStorage:', err);
  }
}

// Clear all data
export function clearAllLocalData(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.ADVENTURES);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  } catch (err) {
    console.error('Failed to clear local data:', err);
  }
}

// Export utilities
export function exportJournalAsJSON(): string {
  const entries = getJournalEntries();
  return JSON.stringify(entries, null, 2);
}

export function exportJournalAsCSV(): string {
  const entries = getJournalEntries();
  if (entries.length === 0) return 'Date,Mission Title,Duration (min),What I Noticed,Felt Before,Felt After,Memorable Moment,Rating\n';

  const headers = ['Date', 'Mission Title', 'Duration (min)', 'What I Noticed', 'Felt Before', 'Felt After', 'Memorable Moment', 'Rating'];
  const rows = entries.map((e) => [
    `"${(e.date || '').replace(/"/g, '""')}"`,
    `"${(e.missionTitle || '').replace(/"/g, '""')}"`,
    e.durationMinutes || 0,
    `"${(e.whatINoticed || '').replace(/"/g, '""')}"`,
    `"${(e.feltBefore || '').replace(/"/g, '""')}"`,
    `"${(e.feltAfter || '').replace(/"/g, '""')}"`,
    `"${(e.memorableMoment || '').replace(/"/g, '""')}"`,
    e.rating || '',
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
