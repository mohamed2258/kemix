import { describe, it, expect } from 'vitest';
import { calculateLevel, calculateLevelProgress } from '../src/context/GameContext';
import { initialCurriculum, kemixAchievements } from '../src/data/curriculum';
import { executePythonCode } from '../src/utils/codeSandbox';

describe('KEMIX Game Engine & Logic Core', () => {
  it('calculates player levels accurately based on 100 XP curve', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(50)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(1250)).toBe(13);
  });

  it('calculates level percentage progress correctly', () => {
    const prog1 = calculateLevelProgress(0);
    expect(prog1.current).toBe(0);
    expect(prog1.percent).toBe(0);

    const prog2 = calculateLevelProgress(75);
    expect(prog2.current).toBe(75);
    expect(prog2.percent).toBe(75);

    const prog3 = calculateLevelProgress(140);
    expect(prog3.current).toBe(40);
    expect(prog3.percent).toBe(40);
  });

  it('validates curriculum data completeness across 8 KEMIX worlds', () => {
    expect(initialCurriculum.worlds.length).toBe(8);
    const world1 = initialCurriculum.worlds[0];
    expect(world1.id).toBe('world_logic');
    expect(world1.units.length).toBeGreaterThan(0);
    expect(world1.bossChallenge).toBeDefined();

    // Verify unit challenges
    world1.units.forEach(unit => {
      expect(unit.lessons.length).toBeGreaterThan(0);
      unit.lessons.forEach(lesson => {
        expect(lesson.challenges.length).toBeGreaterThan(0);
        lesson.challenges.forEach(ch => {
          expect(ch.id).toBeTruthy();
          expect(ch.titleAr).toBeTruthy();
          expect(ch.explanationAr).toBeTruthy();
          expect(ch.hintAr).toBeTruthy();
        });
      });
    });
  });

  it('validates safe code execution sandbox engine', async () => {
    // 1. Simple print test
    const res1 = await executePythonCode('print("Hello Kemix")');
    expect(res1.success).toBe(true);
    expect(res1.output).toBe('Hello Kemix');

    // 2. Arithmetic & Variable evaluation
    const res2 = await executePythonCode('x = 10\ny = 5\nprint(x + y)');
    expect(res2.success).toBe(true);
    expect(res2.output).toBe('15');

    // 3. Condition evaluation
    const res3 = await executePythonCode('score = 90\nif score >= 50: print("Passed")');
    expect(res3.success).toBe(true);
    expect(res3.output).toBe('Passed');

    // 4. Syntax error detection
    const res4 = await executePythonCode('invalid syntax here');
    expect(res4.success).toBe(false);
    expect(res4.error).toContain('SyntaxError');
  });

  it('validates KEMIX achievements configuration', () => {
    expect(kemixAchievements.length).toBeGreaterThanOrEqual(6);
    const firstCode = kemixAchievements.find(a => a.id === 'first_code');
    expect(firstCode).toBeDefined();
    expect(firstCode?.unlocked).toBe(false);
  });
});
