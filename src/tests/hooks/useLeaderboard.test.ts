import { renderHook, act } from '@testing-library/react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

describe('useLeaderboard', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  it('should initialize with empty entries', () => {
    const { result } = renderHook(() => useLeaderboard());

    expect(result.current.entries).toEqual([]);
  });

  it('should add entry and sort by WPM', () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry({
        wpm: 50,
        accuracy: 95,
        difficulty: 'easy',
        theme: 'normal'
      });
    });

    act(() => {
      result.current.addEntry({
        wpm: 60,
        accuracy: 90,
        difficulty: 'easy',
        theme: 'normal'
      });
    });

    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[0].wpm).toBe(60);
    expect(result.current.entries[1].wpm).toBe(50);
  });

  it('should limit to 1000 entries', () => {
    const { result } = renderHook(() => useLeaderboard());

    for (let i = 0; i < 1005; i++) {
      act(() => {
        result.current.addEntry({
          wpm: i,
          accuracy: 100,
          difficulty: 'easy',
          theme: 'normal'
        });
      });
    }

    expect(result.current.entries).toHaveLength(1000);
    expect(result.current.entries[0].wpm).toBe(1004);
  });

  it('should get top entries', () => {
    const { result } = renderHook(() => useLeaderboard());

    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.addEntry({
          wpm: i,
          accuracy: 100,
          difficulty: 'easy',
          theme: 'normal'
        });
      });
    }

    const top5 = result.current.getTopEntries(5);
    expect(top5).toHaveLength(5);
    expect(top5[0].wpm).toBe(9);
  });

  it('should load persisted entries from localStorage and convert timestamps to Date objects across remounts', () => {
    const payload = [
      { id: '1', wpm: 70, accuracy: 98, difficulty: 'easy', theme: 'normal', timestamp: new Date('2024-01-01T00:00:00.000Z').toISOString() },
      { id: '2', wpm: 80, accuracy: 96, difficulty: 'medium', theme: 'programming', timestamp: new Date('2024-02-01T00:00:00.000Z').toISOString() }
    ];
    localStorage.setItem('typingGame:leaderboard', JSON.stringify(payload));

    const firstRender = renderHook(() => useLeaderboard());

    expect(firstRender.result.current.entries).toHaveLength(2);
    expect(firstRender.result.current.entries[0].wpm).toBe(80);
    expect(firstRender.result.current.entries[0].timestamp instanceof Date).toBe(true);

    firstRender.unmount();

    const secondRender = renderHook(() => useLeaderboard());
    expect(secondRender.result.current.entries).toHaveLength(2);
    expect(secondRender.result.current.entries[0].timestamp instanceof Date).toBe(true);
  });

  it('should discard invalid stored records safely', () => {
    const validTs = new Date().toISOString();
    const badPayload = [
      { id: 'x', wpm: 'fast', accuracy: 95, difficulty: 'easy', theme: 'normal', timestamp: validTs },
      null,
      123,
      {},
      { id: 'valid', wpm: 55, accuracy: 96, difficulty: 'easy', theme: 'normal', timestamp: validTs },
      { id: 'bad-ts', wpm: 40, accuracy: 80, difficulty: 'easy', theme: 'normal', timestamp: 'not-a-date' },
      { id: 'missing-accuracy', wpm: 40, difficulty: 'easy', theme: 'normal', timestamp: validTs },
    ];
    localStorage.setItem('typingGame:leaderboard', JSON.stringify(badPayload));

    const { result } = renderHook(() => useLeaderboard());
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].id).toBe('valid');
    expect(result.current.error).toBeNull();
  });
});