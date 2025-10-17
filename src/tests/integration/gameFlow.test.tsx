/// <reference types="@types/jest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '@/components/game/Game';

describe('Game Flow Integration', () => {
  const defaultProps = {
    timeLimit: 15 as const, // Use 15 seconds for faster testing
    difficulty: 'easy' as const,
    theme: 'normal' as const,
    onRetry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full game flow', async () => {
    render(<Game {...defaultProps} />);

    // Wait for game to load and start playing
    await waitFor(() => {
      expect(screen.getByText('Typing Speed Test')).toBeInTheDocument();
      expect(screen.queryByText('Loading game...')).not.toBeInTheDocument();
    }, { timeout: 2000 });

    // Simulate typing some text
    const testText = 'hello';
    for (const char of testText) {
      fireEvent.keyDown(window, { key: char });
    }

    // Wait for time to run out (15 seconds)
    await waitFor(() => {
      expect(screen.getByText('Game Complete!')).toBeInTheDocument();
    }, { timeout: 17000 }); // Wait up to 17 seconds for 15s game

    // Check results are displayed
    expect(screen.getByText('Words Per Minute:')).toBeInTheDocument();
    expect(screen.getByText('Accuracy:')).toBeInTheDocument();
    expect(screen.getByText('Errors:')).toBeInTheDocument();

    // Click retry
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // Verify onRetry was called
    expect(defaultProps.onRetry).toHaveBeenCalled();
  }, 20000); // Jest timeout

  it('should handle typing errors', async () => {
    render(<Game {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Typing Speed Test')).toBeInTheDocument();
    });

    // Type some correct and incorrect characters
    fireEvent.keyDown(window, { key: 'h' });
    fireEvent.keyDown(window, { key: 'x' }); // Error
    fireEvent.keyDown(window, { key: 'l' });

    // Check that errors are tracked (should be greater than 0)
    await waitFor(() => {
      const errorsLabel = screen.getByText('Errors');
      const errorsContainer = errorsLabel.parentElement;
      const errorsValue = errorsContainer?.querySelector('[aria-hidden="true"]')?.textContent;
      expect(parseInt(errorsValue || '0')).toBeGreaterThan(0);
    });
  });
});