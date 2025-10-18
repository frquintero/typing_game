export type CharStatus = 'untyped' | 'correct' | 'incorrect';

export interface CharMeta {
  char: string;
  index: number;
  wordIndex: number; // -1 if not part of any word (should be rare)
  status: CharStatus;
}

// Compute the word index for each character in the text. Mirrors logic used in useGame's currentWordIndex
// and the original TextDisplay.getWordIndex implementation, where spaces are attributed to the next word.
export function computeCharWordIndices(text: string): number[] {
  const words = text.split(' ');
  const indices: number[] = new Array(text.length);
  let cumulative = 0;

  for (let i = 0; i < words.length; i++) {
    const len = words[i].length;
    const start = cumulative;
    const end = start + len; // index after the last character of this word

    // Assign current word index to its characters
    for (let pos = start; pos < end && pos < text.length; pos++) {
      indices[pos] = i;
    }

    // Assign the following space (if it exists) to the NEXT word index
    if (end < text.length) {
      indices[end] = i + 1 < words.length ? i + 1 : -1;
    }

    // Move past the space
    cumulative = end + 1;
  }

  // Fill any remaining undefined entries with -1 to be safe
  for (let i = 0; i < indices.length; i++) {
    if (indices[i] === undefined) indices[i] = -1;
  }

  return indices;
}

export function computeCharMetadata(text: string, typedText: string): CharMeta[] {
  const wordIndices = computeCharWordIndices(text);
  const meta: CharMeta[] = new Array(text.length);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const typedChar = typedText[i];

    let status: CharStatus = 'untyped';
    if (typedChar !== undefined) {
      status = typedChar === char ? 'correct' : 'incorrect';
    }

    meta[i] = {
      char,
      index: i,
      wordIndex: wordIndices[i] ?? -1,
      status,
    };
  }

  return meta;
}
