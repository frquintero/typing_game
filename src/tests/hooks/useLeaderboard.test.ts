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
});