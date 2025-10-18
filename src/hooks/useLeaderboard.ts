'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { storage } from '@/utils/localStorage';

const LEADERBOARD_KEY = 'leaderboard';
const MAX_ENTRIES = 1000;
const LEADERBOARD_UPDATE_EVENT = 'leaderboardUpdate';

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(() => {
    try {
      const stored = storage.get<unknown>(LEADERBOARD_KEY);
      if (Array.isArray(stored)) {
        // Convert timestamps first, then validate
        const parsed = stored.map((raw: any, index: number) => {
          const ts = raw?.timestamp != null ? new Date(raw.timestamp) : null;
          return {
            ...raw,
            timestamp: ts,
            _originalTimestamp: raw?.timestamp, // Store original for validation
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
          !isNaN(entry.timestamp.getTime()) &&
          // Additional validation: ensure timestamp is a complete ISO string
          typeof entry._originalTimestamp === 'string' &&
          entry._originalTimestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ).map((entry: any) => {
          // Remove the temporary validation field
          const { _originalTimestamp, ...cleanEntry } = entry;
          return cleanEntry;
        }) as LeaderboardEntry[];

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

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Listen for storage changes and custom leaderboard update events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `typingGame:${LEADERBOARD_KEY}`) {
        loadEntries();
      }
    };

    const handleLeaderboardUpdate = () => {
      loadEntries();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener(LEADERBOARD_UPDATE_EVENT, handleLeaderboardUpdate);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener(LEADERBOARD_UPDATE_EVENT, handleLeaderboardUpdate);
      };
    }
  }, [loadEntries]);

  const addEntry = useCallback((entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>) => {
    try {
      // Validate input
      if (!entry || typeof entry.wpm !== 'number' || typeof entry.accuracy !== 'number') {
        throw new Error('Invalid leaderboard entry data');
      }

      // Always load current entries from localStorage to ensure we have the latest data
      const stored = storage.get<unknown>(LEADERBOARD_KEY);
      let currentEntries: LeaderboardEntry[] = [];
      if (Array.isArray(stored)) {
        const parsed = stored.map((raw: any, index: number) => {
          const ts = raw?.timestamp != null ? new Date(raw.timestamp) : null;
          return {
            ...raw,
            timestamp: ts,
            _originalTimestamp: raw?.timestamp,
          };
        });

        currentEntries = parsed.filter((entry: any) =>
          entry &&
          typeof entry.id === 'string' &&
          typeof entry.wpm === 'number' &&
          typeof entry.accuracy === 'number' &&
          typeof entry.difficulty === 'string' &&
          typeof entry.theme === 'string' &&
          entry.timestamp instanceof Date &&
          !isNaN(entry.timestamp.getTime()) &&
          typeof entry._originalTimestamp === 'string' &&
          entry._originalTimestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ).map((entry: any) => {
          const { _originalTimestamp, ...cleanEntry } = entry;
          return cleanEntry;
        }) as LeaderboardEntry[];
      }

      const newEntry: LeaderboardEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date()
      };

      const updated = [...currentEntries, newEntry]
        .sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy)
        .slice(0, MAX_ENTRIES);

      setEntries(updated);
      storage.set(LEADERBOARD_KEY, updated, true); // Throw on error so we can catch it
      // Notify other components of the update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(LEADERBOARD_UPDATE_EVENT));
      }
      setError(null);
    } catch (err) {
      console.error('Error adding leaderboard entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to save leaderboard entry');
    }
  }, []);

  const getTopEntries = useCallback((limit: number = 100) => {
    return entries.slice(0, limit);
  }, [entries]);

  const resetLeaderboard = useCallback(() => {
    try {
      storage.set(LEADERBOARD_KEY, [], true);
      setEntries([]);
      // Notify other components of the reset
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(LEADERBOARD_UPDATE_EVENT));
      }
      setError(null);
    } catch (err) {
      console.error('Error resetting leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset leaderboard');
    }
  }, []);

  return {
    entries,
    addEntry,
    getTopEntries,
    resetLeaderboard,
    error,
  };
};