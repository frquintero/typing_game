'use client';

import React, { useMemo } from 'react';
import { computeCharMetadata } from '@/utils/textDisplay';

interface TextDisplayProps {
  text: string;
  typedText: string;
  currentWordIndex: number;
}

export const TextDisplay: React.FC<TextDisplayProps> = React.memo(({ text, typedText, currentWordIndex }) => {
  const charMeta = useMemo(() => computeCharMetadata(text, typedText), [text, typedText]);

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
      {charMeta.map(({ char, index, wordIndex, status }) => {
        let className = 'text-gray-400';
        if (status === 'correct') className = 'text-green-500';
        else if (status === 'incorrect') className = 'text-red-500';

        if (wordIndex === currentWordIndex) {
          className += ' bg-yellow-200';
        }

        return (
          <span key={index} className={className}>
            {char}
          </span>
        );
      })}
      {typedText.length > text.length && (
        <span className="text-red-500" aria-label="Extra characters typed">
          {typedText.slice(text.length)}
        </span>
      )}
    </div>
  );
});
