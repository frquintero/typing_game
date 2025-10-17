export const calculateWPM = (typedText: string, timeInSeconds: number): number => {
  if (timeInSeconds === 0) return 0;
  const characters = typedText.length;
  const words = characters / 5; // Standard: 5 characters = 1 word
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
};

export const calculateAccuracy = (typedText: string, originalText: string): number => {
  if (typedText.length === 0) return 100;
  let correct = 0;
  const minLength = Math.min(typedText.length, originalText.length);

  for (let i = 0; i < minLength; i++) {
    if (typedText[i] === originalText[i]) correct++;
  }

  return Math.round((correct / typedText.length) * 100);
};

export const calculateErrors = (typedText: string, originalText: string): number => {
  let errors = 0;
  const minLength = Math.min(typedText.length, originalText.length);

  for (let i = 0; i < minLength; i++) {
    if (typedText[i] !== originalText[i]) errors++;
  }

  // Add errors for extra characters
  errors += Math.max(0, typedText.length - originalText.length);

  return errors;
};