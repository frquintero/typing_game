# Data Model: Typing Speed Game

**Feature**: Typing Speed Game
**Date**: October 16, 2025

## Entities

### Game Session
Represents a single typing challenge instance.

**Fields**:
- `id`: string (unique identifier)
- `text`: string (the full text to type)
- `timeLimit`: number (seconds, 15/30/60)
- `startTime`: Date (when game started)
- `typedText`: string (user's input so far)
- `wpm`: number (calculated words per minute)
- `accuracy`: number (percentage, 0-100)
- `errors`: number (total incorrect characters)
- `completed`: boolean (whether game finished)
- `endTime`: Date (when game ended, if completed)

**Validation Rules**:
- `timeLimit` must be 15, 30, or 60
- `accuracy` must be between 0 and 100
- `wpm` must be non-negative
- `errors` cannot exceed text length

**Relationships**:
- Belongs to User Stats (aggregated into stats)

### User Stats
Aggregates performance data across all games.

**Fields**:
- `gamesPlayed`: number (total games completed)
- `avgWpm`: number (average WPM across all games)
- `bestWpm`: number (highest WPM achieved)
- `avgAccuracy`: number (average accuracy percentage)
- `consecutivePerfect`: number (current streak of 100% accuracy games)
- `lastPlayed`: Date (timestamp of last game)

**Validation Rules**:
- All numeric fields must be non-negative
- `avgAccuracy` must be between 0 and 100

**Relationships**:
- Has many Game Sessions

### Leaderboard Entry
Stores high scores for competition display.

**Fields**:
- `id`: string (unique identifier)
- `name`: string (player name, user-provided)
- `wpm`: number (WPM achieved)
- `accuracy`: number (accuracy percentage)
- `timestamp`: Date (when score was achieved)
- `difficulty`: string (easy/medium/hard)
- `theme`: string (normal/programming/motivational/fitness)

**Validation Rules**:
- `name` must be non-empty, max 50 characters
- `wpm` must be positive
- `accuracy` must be between 0 and 100
- `difficulty` must be one of: easy, medium, hard
- `theme` must be one of: normal, programming, motivational, fitness

**Relationships**:
- None (standalone entries)

## State Transitions

### Game Session States
- `idle`: Initial state, waiting to start
- `playing`: Timer running, user typing
- `paused`: Game temporarily stopped (if implemented)
- `completed`: Time expired or text finished
- `abandoned`: User left without completing

### Transitions
- `idle` → `playing`: User starts game
- `playing` → `completed`: Time expires or text finished
- `playing` → `abandoned`: User navigates away
- `completed` → `idle`: User starts new game

## Data Flow

1. Game starts: Create new Game Session
2. Real-time updates: Update typedText, calculate wpm/accuracy/errors
3. Game ends: Finalize metrics, update User Stats, add to Leaderboard if qualifying
4. Persistence: All data saved to LocalStorage on changes