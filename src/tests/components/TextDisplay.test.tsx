import { render, screen } from '@testing-library/react';
import { TextDisplay } from '@/components/game/TextDisplay';

describe('TextDisplay', () => {
  it('should render text with correct styling for typed characters', () => {
    const text = 'Hello world';
    const typedText = 'Hel';
    const currentWordIndex = 0;

    render(<TextDisplay text={text} typedText={typedText} currentWordIndex={currentWordIndex} />);

    // Check correct characters are green
    const greenChars = screen.getAllByText('H').filter(el => el.classList.contains('text-green-500'));
    expect(greenChars.length).toBeGreaterThan(0);

    // Check untyped characters are gray
    const grayChars = screen.getAllByText('o').filter(el => el.classList.contains('text-gray-400'));
    expect(grayChars.length).toBeGreaterThan(0);
  });

  it('should highlight the current word', () => {
    const text = 'Hello world';
    const typedText = 'Hello ';
    const currentWordIndex = 1; // "world" is current

    render(<TextDisplay text={text} typedText={typedText} currentWordIndex={currentWordIndex} />);

    // Check that characters in current word have highlight
    const highlightedChars = screen.getAllByText('w').filter(el => el.classList.contains('bg-yellow-200'));
    expect(highlightedChars.length).toBeGreaterThan(0);
  });

  it('should handle extra typed characters', () => {
    const text = 'Hi';
    const typedText = 'Hixyz';
    const currentWordIndex = -1;

    render(<TextDisplay text={text} typedText={typedText} currentWordIndex={currentWordIndex} />);

    // Extra characters should be red
    const extraSpan = screen.getByText('xyz');
    expect(extraSpan).toHaveClass('text-red-500');
  });
});