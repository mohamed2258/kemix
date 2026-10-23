import { describe, it, expect } from 'vitest';
import { fisherYatesShuffle, prepareAndShuffleOptions, evaluateAnswer } from '../src/utils/shuffle';

describe('Fisher-Yates Random Shuffling & Evaluation Engine', () => {
  it('statistically distributes the correct answer across all positions evenly over 1,000 trials', () => {
    const rawOptions = [
      'الخيار الصحيح (Correct)',
      'الخيار الثاني (Option B)',
      'الخيار الثالث (Option C)',
      'الخيار الرابع (Option D)'
    ];
    const correctAnswer = 'الخيار الصحيح (Correct)';

    const positionCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
    const TOTAL_TRIALS = 1000;

    for (let i = 0; i < TOTAL_TRIALS; i++) {
      const shuffled = prepareAndShuffleOptions(rawOptions, correctAnswer);
      expect(shuffled.length).toBe(4);

      const correctIndex = shuffled.findIndex(opt => opt.value === correctAnswer);
      expect(correctIndex).toBeGreaterThanOrEqual(0);
      expect(correctIndex).toBeLessThanOrEqual(3);

      positionCounts[correctIndex] = (positionCounts[correctIndex] || 0) + 1;

      // Prove that evaluation strictly evaluates value, not position
      expect(evaluateAnswer(shuffled[correctIndex].value, correctAnswer)).toBe(true);

      // Other positions evaluate to false
      const wrongIndex = (correctIndex + 1) % 4;
      expect(evaluateAnswer(shuffled[wrongIndex].value, correctAnswer)).toBe(false);
    }

    // Each position (0, 1, 2, 3) should get approximately 25% of the appearances (~250 times).
    // It should NEVER be stuck at position 0!
    // A loose bound of 16% to 34% (160 to 340) verifies a healthy uniform distribution.
    console.log('Statistical distribution over 1000 runs:', positionCounts);
    expect(positionCounts[0]).toBeGreaterThan(160);
    expect(positionCounts[0]).toBeLessThan(340);
    expect(positionCounts[1]).toBeGreaterThan(160);
    expect(positionCounts[1]).toBeLessThan(340);
    expect(positionCounts[2]).toBeGreaterThan(160);
    expect(positionCounts[2]).toBeLessThan(340);
    expect(positionCounts[3]).toBeGreaterThan(160);
    expect(positionCounts[3]).toBeLessThan(340);
  });

  it('eliminates duplicate options and guarantees no duplicate choices are displayed', () => {
    const duplicateOptions = [
      'طباعة النص',
      'طباعة النص', // Duplicate
      'إدخال المتغير',
      'حساب الجمع'
    ];
    const correctAnswer = 'طباعة النص';

    const prepared = prepareAndShuffleOptions(duplicateOptions, correctAnswer);
    expect(prepared.length).toBe(3);

    const values = prepared.map(o => o.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('preserves array elements during pure Fisher-Yates shuffle', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const shuffled = fisherYatesShuffle(arr);
    expect(shuffled.length).toBe(arr.length);
    expect(shuffled.slice().sort()).toEqual(arr);
  });
});
