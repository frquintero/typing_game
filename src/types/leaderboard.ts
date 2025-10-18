export interface LeaderboardEntry {
  id: string;
  wpm: number;
  accuracy: number;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'normal' | 'programming' | 'motivational' | 'fitness';
  timestamp: Date;
}

export interface DisplayEntry extends LeaderboardEntry {
  isEmpty?: boolean;
}