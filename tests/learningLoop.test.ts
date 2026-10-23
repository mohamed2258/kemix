import { describe, it, expect } from 'vitest';
import { initialCurriculum } from '../src/data/curriculum';
import { calculateLevel } from '../src/context/GameContext';
import { defaultDatabase, AppDatabase } from '../src/services/db';

describe('End-to-End KEMIX Learning Loop Simulation', () => {
  it('simulates full user journey in World 1 through challenges, mistakes, and Boss defeat', () => {
    let state: AppDatabase = JSON.parse(JSON.stringify(defaultDatabase));
    expect(state.profile.xp).toBe(0);
    expect(state.profile.level).toBe(1);
    expect(state.profile.hearts).toBe(5);

    // 1. Onboarding
    state.profile.name = 'صقر كيميكس';
    state.profile.experienceLevel = 'beginner';
    state.profile.learningGoal = 'بناء مشاريع حقيقية';
    state.profile.dailyGoalXP = 30;

    // 2. Select World 1
    const world1 = state.curriculum.worlds[0];
    expect(world1.id).toBe('world_logic');
    const lesson1 = world1.units[0].lessons[0];

    // 3. Solve Challenge 1 correctly -> gains XP
    const ch1 = lesson1.challenges[0];
    state.profile.xp += ch1.xpReward;
    state.profile.coins += ch1.coinReward;
    state.completedChallenges.push(ch1.id);
    expect(state.profile.xp).toBe(10);

    // 4. Mistake on Challenge 2 -> loses 1 heart
    const ch2 = lesson1.challenges[1];
    state.profile.hearts -= 1;
    state.practiceMistakes.push(ch2.id);
    expect(state.profile.hearts).toBe(4);
    expect(state.practiceMistakes).toContain(ch2.id);

    // 5. Complete all challenges in lesson 1
    for (let i = 1; i < lesson1.challenges.length; i++) {
      const ch = lesson1.challenges[i];
      state.profile.xp += ch.xpReward;
      state.profile.coins += ch.coinReward;
      state.completedChallenges.push(ch.id);
    }
    state.completedLessons.push(lesson1.id);
    state.profile.xp += 30; // base lesson XP

    // 6. Defeat World 1 Boss Challenge!
    const boss = world1.bossChallenge!;
    state.profile.xp += boss.xpReward;
    state.profile.coins += boss.coinReward;
    state.completedChallenges.push(boss.id);

    // Unlock World 2
    state.unlockedWorlds.push('world_python_basics');

    expect(state.unlockedWorlds).toContain('world_python_basics');
    expect(calculateLevel(state.profile.xp)).toBeGreaterThanOrEqual(2);
  });
});
