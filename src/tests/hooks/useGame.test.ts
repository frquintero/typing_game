import { renderHook, act, waitFor } from '@testing-library/react';
import { useGame } from '@/hooks/useGame';

describe('useGame', () => {
  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.gameState).toBe('idle');
    expect(result.current.text).toBe('');
    expect(result.current.typedText).toBe('');
    expect(result.current.wpm).toBe(0);
    expect(result.current.accuracy).toBe(100);
    expect(result.current.errors).toBe(0);
  });

  it('should start game and set text', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame(30, 'easy', 'normal', false);
    });

    expect(result.current.gameState).toBe('playing');
    expect(result.current.text).not.toBe('');
    expect(result.current.timeRemaining).toBe(30);
  });

  it('should handle correct key presses', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame(30, 'easy', 'normal', false);
    });

    const firstChar = result.current.text[0];

    act(() => {
      result.current.handleKeyPress(firstChar);
    });

    expect(result.current.typedText).toBe(firstChar);
    expect(result.current.accuracy).toBe(100);
    expect(result.current.errors).toBe(0);
  });

  it('should handle incorrect key presses', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame(30, 'easy', 'normal', false);
    });

    act(() => {
      result.current.handleKeyPress('x'); // assuming first char is not x
    });

    expect(result.current.typedText).toBe('x');
    expect(result.current.accuracy).toBeLessThan(100);
    expect(result.current.errors).toBe(1);
  });

  it('should calculate current word index', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame(30, 'easy', 'normal', false);
    });

    // Assuming text starts with word
    expect(result.current.currentWordIndex).toBe(0);

    // Type first word
    const words = result.current.text.split(' ');
    const firstWord = words[0];

    for (const char of firstWord) {
      act(() => {
        result.current.handleKeyPress(char);
      });
    }

    // After typing first word, current word should be 1
    expect(result.current.currentWordIndex).toBe(1);
  });

  it('should reset game', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame(30, 'easy', 'normal', false);
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState).toBe('idle');
    expect(result.current.text).toBe('');
  });

  it('should decrease time remaining', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame(30, 'easy', 'normal', false);
    });

    expect(result.current.timeRemaining).toBe(30);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.timeRemaining).toBe(29);

    jest.useRealTimers();
  });

  it('should track consecutive perfect games and unlock power-up', async () => {
    jest.useFakeTimers();

    // Test with 2 consecutive perfect games first
    let consecutivePerfect = 2;
    Storage.prototype.getItem = jest.fn(() => consecutivePerfect.toString());
    Storage.prototype.setItem = jest.fn((key, value) => {
      if (key === 'consecutivePerfect') {
        consecutivePerfect = parseInt(value);
      }
    });

    const { result } = renderHook(() => useGame());

    expect(result.current.powerUpAvailable).toBe(false); // 2 is not >= 3

    // Start a perfect game
    act(() => {
      result.current.startGame(30, 'easy', 'normal', false, (stats) => {});
    });

    // Simulate perfect typing
    for (const char of result.current.text) {
      act(() => {
        result.current.handleKeyPress(char);
      });
    }

    // Wait for accuracy to update
    await waitFor(() => {
      expect(result.current.accuracy).toBe(100);
    });

    // Advance timer to complete the game (30 seconds)
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(result.current.timeRemaining).toBe(0); // Should be 0
    expect(result.current.gameState).toBe('completed');
    expect(result.current.powerUpAvailable).toBe(true); // Should be true after 3 consecutive

    jest.useRealTimers();
  });

  it('should activate power-up and enable slow mode', () => {
    // Mock localStorage to have 3 consecutive perfect games
    Storage.prototype.getItem = jest.fn(() => '3');

    const { result } = renderHook(() => useGame());

    // Start a game
    act(() => {
      result.current.startGame(30, 'easy', 'normal', false);
    });

    expect(result.current.powerUpAvailable).toBe(true);

    act(() => {
      result.current.activatePowerUp();
    });

    expect(result.current.slowMode).toBe(true);
    expect(result.current.slowTimeRemaining).toBe(3);
    expect(result.current.powerUpAvailable).toBe(false);
  });
});