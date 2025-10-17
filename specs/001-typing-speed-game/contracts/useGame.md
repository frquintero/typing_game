# Hook Contract: useGame

**Purpose**: Manages game state and logic for typing challenges.

**Parameters**: None

**Returns**:
```typescript
{
  gameState: 'idle' | 'playing' | 'completed';
  text: string;
  typedText: string;
  timeRemaining: number;
  wpm: number;
  accuracy: number;
  errors: number;
  startGame: (timeLimit: 15 | 30 | 60, difficulty: 'easy' | 'medium' | 'hard', theme: string) => void;
  handleKeyPress: (key: string) => void;
  resetGame: () => void;
}
```

**Behavior**:
- `startGame`: Initializes new game session with selected parameters
- `handleKeyPress`: Processes user input, updates typed text and metrics
- Automatically ends game when time expires
- Calculates WPM and accuracy in real-time