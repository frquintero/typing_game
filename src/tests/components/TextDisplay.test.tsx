import { render, screen } from '@testing-library/react';
import { TextDisplay } from '@/components/game/TextDisplay';
import * as textDisplayUtils from '@/utils/textDisplay';

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

  it('highlights the leading space as part of the current word', () => {
    const text = 'Hello world';
    const typedText = 'Hello ';
    const currentWordIndex = 1; // "world" is current, the space before it should also be highlighted

    const { container } = render(<TextDisplay text={text} typedText={typedText} currentWordIndex={currentWordIndex} />);

    const spans = Array.from(container.querySelectorAll('span'));
    const spaceSpans = spans.filter((el) => el.textContent === ' ');

    expect(spaceSpans.length).toBeGreaterThan(0);
    expect(spaceSpans.some((el) => el.classList.contains('bg-yellow-200'))).toBe(true);
  });

  it('memoizes per-character metadata and avoids recomputation when only currentWordIndex changes', () => {
    const text = 'Hello world';
    const typedText = 'Hello';

    const spy = jest.spyOn(textDisplayUtils, 'computeCharMetadata');

    const { rerender } = render(<TextDisplay text={text} typedText={typedText} currentWordIndex={0} />);
    expect(spy).toHaveBeenCalledTimes(1);

    // Change only the highlighted word - should not recompute metadata
    rerender(<TextDisplay text={text} typedText={typedText} currentWordIndex={1} />);
    expect(spy).toHaveBeenCalledTimes(1);

    // Changing typedText should recompute
    rerender(<TextDisplay text={text} typedText={`${typedText}!`} currentWordIndex={1} />);
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });
});
