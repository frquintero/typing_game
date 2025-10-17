import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionPanel } from '@/components/ui/SelectionPanel';

describe('SelectionPanel', () => {
const defaultProps = {
  timeLimit: 30 as const,
  difficulty: 'easy' as const,
  theme: 'normal' as const,
  focusMode: false,
  onTimeLimitChange: jest.fn(),
  onDifficultyChange: jest.fn(),
  onThemeChange: jest.fn(),
  onFocusModeChange: jest.fn(),
  onStart: jest.fn(),
};  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all selection options', () => {
    render(<SelectionPanel {...defaultProps} />);

    expect(screen.getByText('Typing Speed Game')).toBeInTheDocument();
    expect(screen.getByLabelText('Time Limit')).toBeInTheDocument();
    expect(screen.getByLabelText('Difficulty')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('should call onTimeLimitChange when time limit changes', () => {
    render(<SelectionPanel {...defaultProps} />);

    const select = screen.getByLabelText('Time Limit');
    fireEvent.change(select, { target: { value: '60' } });

    expect(defaultProps.onTimeLimitChange).toHaveBeenCalledWith(60);
  });

  it('should call onDifficultyChange when difficulty changes', () => {
    render(<SelectionPanel {...defaultProps} />);

    const select = screen.getByLabelText('Difficulty');
    fireEvent.change(select, { target: { value: 'hard' } });

    expect(defaultProps.onDifficultyChange).toHaveBeenCalledWith('hard');
  });

  it('should call onThemeChange when theme changes', () => {
    render(<SelectionPanel {...defaultProps} />);

    const select = screen.getByLabelText('Theme');
    fireEvent.change(select, { target: { value: 'programming' } });

    expect(defaultProps.onThemeChange).toHaveBeenCalledWith('programming');
  });

  it('should call onFocusModeChange when focus mode is toggled', () => {
    render(<SelectionPanel {...defaultProps} />);

    const checkbox = screen.getByLabelText('Focus Mode (No timer, accuracy only)');
    fireEvent.click(checkbox);

    expect(defaultProps.onFocusModeChange).toHaveBeenCalledWith(true);
  });

  it('should call onStart when start button is clicked', () => {
    render(<SelectionPanel {...defaultProps} />);

    const button = screen.getByText('Start Game');
    fireEvent.click(button);

    expect(defaultProps.onStart).toHaveBeenCalled();
  });
});