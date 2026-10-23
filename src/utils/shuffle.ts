/**
 * KEMIX Fisher-Yates Shuffling & Option Decoupling Engine
 * Guarantees uniform random distribution of answer choices without biasing position,
 * ensures option deduplication, and strictly evaluates based on answer ID/value rather than index.
 */

export interface ShuffledOption<T = string> {
  id: string;
  value: T;
  originalIndex: number;
}

/**
 * Standard Fisher-Yates (Knuth) Shuffle algorithm
 * Produces an unbiased random permutation of an array in O(n) time.
 */
export function fisherYatesShuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Prepares and shuffles options for a multiple choice question:
 * 1. Filters out empty or duplicate options.
 * 2. Creates decoupled ShuffledOption objects.
 * 3. Shuffles the list using Fisher-Yates.
 * 4. Ensures the correct answer is present.
 */
export function prepareAndShuffleOptions(
  options: string[] | undefined,
  correctAnswer: string
): ShuffledOption<string>[] {
  if (!options || options.length === 0) {
    return [{ id: 'opt_0', value: correctAnswer, originalIndex: 0 }];
  }

  // Deduplicate and filter options while preserving unique text
  const seen = new Set<string>();
  const uniqueOptions: string[] = [];

  for (const opt of options) {
    const trimmed = opt.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      uniqueOptions.push(trimmed);
    }
  }

  // Ensure correct answer is included if accidentally omitted
  const trimmedCorrect = correctAnswer.trim();
  if (!seen.has(trimmedCorrect)) {
    uniqueOptions.push(trimmedCorrect);
  }

  // Map to decoupled option objects
  const optionObjects: ShuffledOption<string>[] = uniqueOptions.map((val, idx) => ({
    id: `opt_${idx}_${Math.random().toString(36).substr(2, 5)}`,
    value: val,
    originalIndex: idx
  }));

  // Shuffle thoroughly using Fisher-Yates
  return fisherYatesShuffle(optionObjects);
}

/**
 * Evaluates whether the chosen option value matches the correct answer,
 * independent of display index or DOM position.
 */
export function evaluateAnswer(
  selectedOptionValue: string | null | undefined,
  correctAnswer: string
): boolean {
  if (!selectedOptionValue) return false;
  return selectedOptionValue.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}
