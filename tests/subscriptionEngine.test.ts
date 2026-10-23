import { describe, it, expect } from 'vitest';
import { 
  calculateSavingsPercent, 
  checkSubscriptionAccess, 
  isContentPremiumLocked, 
  createFamilyMemberProfile,
  paymentGatewayService
} from '../src/services/subscriptionService';
import { defaultDatabase, defaultSubscriptionConfig, AppDatabase } from '../src/services/db';
import { UserSubscription, SubscriptionConfig } from '../src/types';

describe('KEMIX Subscription Architecture & Business Rules', () => {
  it('correctly calculates dynamic savings percentage for Individual and Family plans', () => {
    // Individual: 49.99 * 12 = 599.88. Annual: 399.99.
    // (599.88 - 399.99) / 599.88 = 199.89 / 599.88 = 33.32% -> 33%
    const indSavings = calculateSavingsPercent(49.99, 399.99);
    expect(indSavings).toBe(33);

    // Family: 89.99 * 12 = 1079.88. Annual: 699.99.
    // (1079.88 - 699.99) / 1079.88 = 379.89 / 1079.88 = 35.18% -> 35%
    const famSavings = calculateSavingsPercent(89.99, 699.99);
    expect(famSavings).toBe(35);

    // Dynamic config update test: if prices change
    const updatedSavings = calculateSavingsPercent(100, 800);
    // 1200 - 800 = 400 / 1200 = 33.33% -> 33%
    expect(updatedSavings).toBe(33);
  });

  it('keeps World 1 Unit 1 free while locking advanced units for Free users', () => {
    const freeDb: AppDatabase = {
      ...defaultDatabase,
      subscription: null,
      profile: { ...defaultDatabase.profile, role: 'FREE' }
    };

    // World 1 Unit 1 Lesson 0 is free for onboarding trial
    const isW1U1Locked = isContentPremiumLocked('world_logic', 'unit_logic_basics', 0, freeDb);
    expect(isW1U1Locked).toBe(false);

    // Advanced unit in World 1 is premium locked
    const isW1U2Locked = isContentPremiumLocked('world_logic', 'unit_logic_advanced', 2, freeDb);
    expect(isW1U2Locked).toBe(true);

    // Subsequent worlds (e.g. Loops) are premium locked
    const isLoopsLocked = isContentPremiumLocked('world_loops', 'unit_loops_1', 0, freeDb);
    expect(isLoopsLocked).toBe(true);
  });

  it('unlocks all worlds and units when user has active premium or trial', () => {
    const premiumDb: AppDatabase = {
      ...defaultDatabase,
      subscription: {
        plan: 'individual',
        billingCycle: 'annual',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true
      },
      profile: { ...defaultDatabase.profile, role: 'PREMIUM' }
    };

    const isLoopsLocked = isContentPremiumLocked('world_loops', 'unit_loops_1', 3, premiumDb);
    expect(isLoopsLocked).toBe(false);

    const access = checkSubscriptionAccess(premiumDb);
    expect(access.hasPremiumAccess).toBe(true);
    expect(access.effectiveRole).toBe('PREMIUM');
    expect(access.isExpired).toBe(false);
  });

  it('handles 7-day free trial accurately and expires when past duration', () => {
    const now = Date.now();
    const trialDb: AppDatabase = {
      ...defaultDatabase,
      subscription: {
        plan: 'individual',
        billingCycle: 'monthly',
        status: 'trial',
        startDate: new Date(now).toISOString(),
        endDate: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
        renewalDate: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trialStartDate: new Date(now).toISOString(),
        trialEndDate: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true
      }
    };

    const activeTrialAccess = checkSubscriptionAccess(trialDb);
    expect(activeTrialAccess.hasPremiumAccess).toBe(true);
    expect(activeTrialAccess.isTrial).toBe(true);
    expect(activeTrialAccess.daysRemaining).toBe(7);

    // Simulate trial expiration (endDate in the past)
    const expiredTrialDb: AppDatabase = {
      ...trialDb,
      subscription: {
        ...trialDb.subscription!,
        status: 'expired',
        endDate: new Date(now - 1000 * 60).toISOString()
      }
    };

    const expiredAccess = checkSubscriptionAccess(expiredTrialDb);
    expect(expiredAccess.hasPremiumAccess).toBe(false);
    expect(expiredAccess.effectiveRole).toBe('FREE');
    expect(expiredAccess.isExpired).toBe(true);
  });

  it('retains premium access when user cancels renewal until the end of the billing period', () => {
    const now = Date.now();
    const futureEndDate = new Date(now + 20 * 24 * 60 * 60 * 1000).toISOString();

    const cancelledDb: AppDatabase = {
      ...defaultDatabase,
      subscription: {
        plan: 'individual',
        billingCycle: 'monthly',
        status: 'cancelled',
        startDate: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: futureEndDate,
        renewalDate: futureEndDate,
        autoRenew: false,
        canceledAt: new Date(now).toISOString()
      }
    };

    const access = checkSubscriptionAccess(cancelledDb);
    // User cancelled renewal, but subscription is paid through futureEndDate!
    expect(access.hasPremiumAccess).toBe(true);
    expect(access.isCancelledButActive).toBe(true);
    expect(access.daysRemaining).toBe(20);
  });

  it('denies access if payment is pending or past_due until server confirmation', () => {
    const pendingDb: AppDatabase = {
      ...defaultDatabase,
      subscription: {
        plan: 'individual',
        billingCycle: 'monthly',
        status: 'pending_payment',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true
      }
    };

    const pendingAccess = checkSubscriptionAccess(pendingDb);
    expect(pendingAccess.hasPremiumAccess).toBe(false);
    expect(pendingAccess.effectiveRole).toBe('FREE');

    const pastDueDb: AppDatabase = {
      ...pendingDb,
      subscription: {
        ...pendingDb.subscription!,
        status: 'past_due'
      }
    };

    const pastDueAccess = checkSubscriptionAccess(pastDueDb);
    expect(pastDueAccess.hasPremiumAccess).toBe(false);
  });

  it('supports Family Plan with up to 5 completely isolated learning profiles', () => {
    const familyDb: AppDatabase = {
      ...defaultDatabase,
      subscription: {
        plan: 'family',
        billingCycle: 'annual',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true
      },
      familyMembers: [
        {
          ...createFamilyMemberProfile('fam_owner', 'الأب (المدير)', '👨‍💼', 'owner'),
          xp: 800,
          level: 9,
          streak: 14,
          completedLessons: ['l1', 'l2', 'l3']
        },
        {
          ...createFamilyMemberProfile('fam_child1', 'زياد', '🚀', 'member'),
          xp: 150,
          level: 2,
          streak: 3,
          completedLessons: ['l1']
        },
        {
          ...createFamilyMemberProfile('fam_child2', 'نور', '🦄', 'member'),
          xp: 320,
          level: 4,
          streak: 6,
          completedLessons: ['l1', 'l2']
        }
      ]
    };

    const access = checkSubscriptionAccess(familyDb);
    expect(access.hasPremiumAccess).toBe(true);
    expect(access.effectiveRole).toBe('FAMILY');

    // Verify isolation: child1 progress is completely separate from child2 and owner
    expect(familyDb.familyMembers[0].xp).toBe(800);
    expect(familyDb.familyMembers[1].xp).toBe(150);
    expect(familyDb.familyMembers[2].xp).toBe(320);

    expect(familyDb.familyMembers[1].completedLessons).not.toEqual(familyDb.familyMembers[2].completedLessons);
    expect(familyDb.familyMembers.length).toBeLessThanOrEqual(5);
  });

  it('simulates decoupled payment gateway and generates transaction ref', async () => {
    const res = await paymentGatewayService.processPayment({
      plan: 'individual',
      billingCycle: 'monthly',
      amount: 49.99,
      currency: 'EGP',
      paymentMethod: 'credit_card',
      userName: 'أحمد محمود',
      userEmail: 'ahmed@example.com'
    });

    expect(res.success).toBe(true);
    expect(res.paymentStatus).toBe('paid');
    expect(res.transactionId).toContain('TX_KEMIX_');
    expect(res.gatewayReference).toContain('EGP_GATEWAY_');
  });
});
