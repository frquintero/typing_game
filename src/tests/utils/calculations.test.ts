import { calculateWPM, calculateAccuracy, calculateErrors } from '@/utils/calculations';

describe('calculations', () => {
  describe('calculateWPM', () => {
    it('should calculate WPM correctly', () => {
      const typedText = 'hello world this is a test';
      const timeInSeconds = 60; // 1 minute
      const wpm = calculateWPM(typedText, timeInSeconds);
      // 27 characters = 5.4 words, in 1 minute = 5 WPM (rounded)
      expect(wpm).toBe(5);
    });

    it('should return 0 for zero time', () => {
      const wpm = calculateWPM('hello', 0);
      expect(wpm).toBe(0);
    });

    it('should round to nearest integer', () => {
      const typedText = 'hello world'; // 2 words
      const timeInSeconds = 30; // 0.5 minutes
      const wpm = calculateWPM(typedText, timeInSeconds);
      expect(wpm).toBe(4); // 2 / 0.5 = 4
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate 100% accuracy for perfect typing', () => {
      const typedText = 'hello';
      const originalText = 'hello';
      const accuracy = calculateAccuracy(typedText, originalText);
      expect(accuracy).toBe(100);
    });

    it('should calculate accuracy for partial correct typing', () => {
      const typedText = 'helo'; // missing 'l'
      const originalText = 'hello';
      const accuracy = calculateAccuracy(typedText, originalText);
      // 3 correct out of 4 = 75%
      expect(accuracy).toBe(75);
    });

    it('should return 100% for empty typed text', () => {
      const accuracy = calculateAccuracy('', 'hello');
      expect(accuracy).toBe(100);
    });
  });

  describe('calculateErrors', () => {
    it('should count errors correctly', () => {
      const typedText = 'hxllo'; // 'x' instead of 'e'
      const originalText = 'hello';
      const errors = calculateErrors(typedText, originalText);
      expect(errors).toBe(1);
    });

    it('should count extra characters as errors', () => {
      const typedText = 'helloo'; // extra 'o'
      const originalText = 'hello';
      const errors = calculateErrors(typedText, originalText);
      expect(errors).toBe(1);
    });

    it('should count missing characters as errors', () => {
      const typedText = 'helo'; // missing 'l'
      const originalText = 'hello';
      const errors = calculateErrors(typedText, originalText);
      expect(errors).toBe(1);
    });
  });
});