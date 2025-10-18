export interface GameSession {
  id: string;
  text: string;
  timeLimit: number; // seconds
  startTime: Date;
  typedText: string;
  wpm: number;
  accuracy: number; // 0-100
  errors: number;
  completed: boolean;
  endTime?: Date;
}

export interface UserStats {
  gamesPlayed: number;
  avgWpm: number;
  bestWpm: number;
  avgAccuracy: number;
  consecutivePerfect: number;
  lastPlayed: Date;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'normal' | 'programming' | 'motivational' | 'fitness';
}

export interface DisplayEntry extends Omit<LeaderboardEntry, 'name'> {
  isEmpty?: boolean;
}

export type GameState = 'idle' | 'playing' | 'completed';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Theme = 'normal' | 'programming' | 'motivational' | 'fitness';