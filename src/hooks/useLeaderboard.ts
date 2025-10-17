'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { storage } from '@/utils/localStorage';

const LEADERBOARD_KEY = 'leaderboard';
const MAX_ENTRIES = 1000;

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const stored = storage.get<LeaderboardEntry[]>(LEADERBOARD_KEY);
    if (stored) {
      // Convert timestamp strings back to Date objects
      const parsed = stored.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setEntries(parsed);
    }
  }, []);

  const addEntry = (entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>) => {
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
  };

  const getTopEntries = (limit: number = 100) => {
    return entries.slice(0, limit);
  };

  return {
    entries,
    addEntry,
    getTopEntries
  };
};