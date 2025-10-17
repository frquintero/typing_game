'use client';

import React from 'react';

interface TextDisplayProps {
  text: string;
  typedText: string;
  currentWordIndex: number;
}

export const TextDisplay: React.FC<TextDisplayProps> = React.memo(({ text, typedText, currentWordIndex }) => {
  const getWordIndex = (pos: number) => {
    const words = text.split(' ');
    let cumulative = 0;
    for (let i = 0; i < words.length; i++) {
      const wordStart = cumulative;
      const wordEnd = cumulative + words[i].length;
      if (pos >= wordStart && pos <= wordEnd) {
        return pos === wordEnd ? (i + 1 < words.length ? i + 1 : -1) : i;
      }
      cumulative = wordEnd + 1;
    }
    return -1;
  };

  const renderChar = (char: string, index: number) => {
    const typedChar = typedText[index];
    const wordIndex = getWordIndex(index);
    let className = 'text-gray-400'; // not typed yet

    if (typedChar !== undefined) {
      if (typedChar === char) {
        className = 'text-green-500'; // correct
      } else {
        className = 'text-red-500'; // error
      }
    }

    if (wordIndex === currentWordIndex) {
      className += ' bg-yellow-200'; // highlight current word
    }

    return (
      <span key={index} className={className}>
        {char}
      </span>
    );
  };

  return (
    <div
      className="text-lg sm:text-xl leading-relaxed font-mono p-3 sm:p-4 bg-gray-100 dark:bg-gray-700 rounded border-2 border-gray-300 dark:border-gray-600 min-h-32 overflow-auto"
      role="textbox"
      aria-label="Typing text display"
      aria-readonly="true"
      aria-live="polite"
      aria-describedby="typing-instructions"
      style={{ maxHeight: '60vh' }}
    >
      <div id="typing-instructions" className="sr-only">
        Type the displayed text. Correctly typed characters are shown in green, errors in red, and the current word is highlighted.
      </div>
      {text.split('').map((char, index) => renderChar(char, index))}
      {typedText.length > text.length && (
        <span className="text-red-500" aria-label="Extra characters typed">
          {typedText.slice(text.length)}
        </span>
      )}
    </div>
  );
});