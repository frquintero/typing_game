# Hook Contract: useLeaderboard

**Purpose**: Manages leaderboard data and submissions.

**Parameters**: None

**Returns**:
```typescript
{
  entries: LeaderboardEntry[];
  submitScore: (name: string, wpm: number, accuracy: number, difficulty: string, theme: string) => void;
  isQualified: (wpm: number, accuracy: number) => boolean;
}
```

**Behavior**:
- `entries`: Sorted array of top scores (max 1000)
- `submitScore`: Adds new entry if qualified, prunes old entries
- `isQualified`: Checks if score meets leaderboard criteria