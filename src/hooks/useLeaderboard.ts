'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { storage } from '@/utils/localStorage';

const LEADERBOARD_KEY = 'leaderboard';
const MAX_ENTRIES = 1000;

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

        const sorted = validated
          .sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy)
          .slice(0, MAX_ENTRIES);

        setEntries(sorted);
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
        id: Date.now().toString(),
        timestamp: new Date()
      };

      const updated = [...entries, newEntry]
        .sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy)
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