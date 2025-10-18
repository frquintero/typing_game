'use client';

import { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { storage } from '@/utils/localStorage';

const LEADERBOARD_KEY = 'leaderboard';
const MAX_ENTRIES = 1000;

function compareEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  // Sort by WPM desc, then accuracy desc, then timestamp desc (most recent first), then id asc for stability
  if (b.wpm !== a.wpm) return b.wpm - a.wpm;
  if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
  const timeDiff = b.timestamp.getTime() - a.timestamp.getTime();
  if (timeDiff !== 0) return timeDiff;
  return a.id.localeCompare(b.id);
}

function dedupeById(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const map = new Map<string, LeaderboardEntry>();
  for (const e of entries) {
    const existing = map.get(e.id);
    if (!existing || e.timestamp.getTime() > existing.timestamp.getTime()) {
      map.set(e.id, e);
    }
  }
  return Array.from(map.values());
}

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = storage.get<unknown>(LEADERBOARD_KEY);
      if (Array.isArray(stored)) {
        // Convert timestamps first, then validate
        const parsed = stored.map((raw: any) => {
          const ts = raw?.timestamp != null ? new Date(raw.timestamp) : null;
          return {
            ...raw,
            timestamp: ts,
          };
        });

        const validated = parsed.filter((entry: any) =>
          entry &&
          typeof entry.id === 'string' &&
          typeof entry.wpm === 'number' &&
          typeof entry.accuracy === 'number' &&
          typeof entry.difficulty === 'string' &&
          typeof entry.theme === 'string' &&
          entry.timestamp instanceof Date &&
          !isNaN(entry.timestamp.getTime())
        ) as LeaderboardEntry[];

        const processed = dedupeById(validated)
          .sort(compareEntries)
          .slice(0, MAX_ENTRIES);

        setEntries(processed);
      } else {
        // Malformed payloads should be ignored safely
        setEntries([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard data');
      setEntries([]);
    }
  }, []);

  const addEntry = useCallback((entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>) => {
    try {
      // Validate input
      if (!entry || typeof entry.wpm !== 'number' || typeof entry.accuracy !== 'number') {
        throw new Error('Invalid leaderboard entry data');
      }

      const newEntry: LeaderboardEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        timestamp: new Date()
      };

      const updated = dedupeById([...entries, newEntry])
        .sort(compareEntries)
        .slice(0, MAX_ENTRIES);

      setEntries(updated);
      storage.set(LEADERBOARD_KEY, updated);
      setError(null);
    } catch (err) {
      console.error('Error adding leaderboard entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to save leaderboard entry');
    }
  }, [entries]);

  const getTopEntries = useCallback((limit: number = 100) => {
    return entries.slice(0, limit);
  }, [entries]);

  return {
    entries,
    addEntry,
    getTopEntries,
    error,
  };
};