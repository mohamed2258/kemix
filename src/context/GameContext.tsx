import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  UserProfile, 
  DailyQuest, 
  Achievement, 
  AttemptRecord, 
  SkillStatus, 
  World, 
  Lesson, 
  Challenge, 
  CurriculumData, 
  ShopItem, 
  CoinTransaction,
  SubscriptionPlanType,
  BillingCycle,
  PaymentMethodType,
  SubscriptionConfig,
  OrganizationAccount
} from '../types';
import { AppDatabase, dbService, defaultDatabase } from '../services/db';
import { soundEngine } from '../utils/sound';
import { initialShopItems } from '../data/shopItems';
import { 
  checkSubscriptionAccess, 
  isContentPremiumLocked, 
  paymentGatewayService, 
  createFamilyMemberProfile 
} from '../services/subscriptionService';
import { trackScreenView, trackEvent } from '../services/analyticsService';

export type ScreenType = 
  | 'onboarding'
  | 'home'
  | 'learn'
  | 'lesson'
  | 'practice'
  | 'code_editor'
  | 'leaderboard'
  | 'profile'
  | 'shop'
  | 'admin'
  | 'subscription'
  | 'organization_dashboard';

interface GameContextType {
  db: AppDatabase;
  loading: boolean;
  currentScreen: ScreenType;
  selectedWorldId: string;
  activeLessonId: string | null;
  activeUnitId: string | null;
  activeBossChallenge: boolean;
  combo: number;
  maxComboInSession: number;
  showOutOfHeartsModal: boolean;
  setShowOutOfHeartsModal: (val: boolean) => void;
  showRewardModal: boolean;
  setShowRewardModal: (val: boolean) => void;
  lastLessonStats: { xp: number; coins: number; isPerfect: boolean; combo: number } | null;
  shopItems: ShopItem[];

  // Subscription State & Paywall
  subscriptionAccess: ReturnType<typeof checkSubscriptionAccess>;
  showPaywallModal: boolean;
  setShowPaywallModal: (val: boolean) => void;
  paywallTriggerReason: string | null;
  setPaywallTriggerReason: (val: string | null) => void;

  // Subscription Actions
  subscribe: (
    plan: SubscriptionPlanType,
    billingCycle: BillingCycle,
    paymentMethod: PaymentMethodType,
    isTrial?: boolean
  ) => Promise<{ success: boolean; message: string }>;
  cancelSubscriptionRenewal: () => { success: boolean; message: string };
  reactivateSubscription: () => { success: boolean; message: string };
  changePlan: (newPlan: SubscriptionPlanType, newCycle: BillingCycle) => Promise<{ success: boolean; message: string }>;
  updateSubscriptionConfig: (newConfig: Partial<SubscriptionConfig>) => void;

  // Family Management
  addFamilyMember: (name: string, avatar: string) => { success: boolean; message: string };
  removeFamilyMember: (memberId: string) => { success: boolean; message: string };
  switchFamilyMember: (memberId: string) => void;

  // Organization Management
  addOrgStudent: (name: string, email: string, groupId: string) => { success: boolean; message: string };
  removeOrgStudent: (studentId: string) => void;
  createOrgGroup: (name: string, instructorName: string, assignedWorldId?: string) => void;
  assignTrackToGroup: (groupId: string, worldId: string) => void;
  updateOrgAccount: (updates: Partial<OrganizationAccount>) => void;

  // Standard Actions
  navigateTo: (screen: ScreenType) => void;
  selectWorld: (worldId: string) => void;
  startLesson: (lessonId: string, unitId: string, isBoss?: boolean) => void;
  exitLesson: () => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number, reason?: string) => void;
  loseHeart: () => boolean;
  refillHearts: () => void;
  buyHeartsWithCoins: () => boolean;
  buyShopItem: (item: ShopItem) => { success: boolean; message: string };
  equipItem: (item: ShopItem) => void;
  recordChallengeAttempt: (challengeId: string, lessonId: string, isCorrect: boolean, timeSpentSec: number, answer: string | string[]) => void;
  finishLesson: (lessonId: string, unitId: string, isPerfect: boolean) => void;
  claimQuest: (questId: string) => void;
  isWorldUnlocked: (world: World) => boolean;
  getLessonStatus: (lessonId: string) => SkillStatus;
  toggleSound: () => void;
  toggleTheme: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProgress: () => Promise<void>;
  completeOnboarding: (name: string, goal: string, level: 'beginner' | 'some' | 'intermediate', dailyGoalXP: number) => void;

  // Dynamic Content & Admin CMS
  updateCurriculum: (newCurriculum: CurriculumData) => void;
  addOrUpdateWorld: (world: World) => void;
  deleteWorld: (worldId: string) => void;
  importCurriculumFile: (jsonStr: string) => boolean;
  triggerSync: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function calculateLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function calculateLevelProgress(xp: number): { current: number; max: number; percent: number } {
  const currentInLevel = xp % 100;
  return {
    current: currentInLevel,
    max: 100,
    percent: Math.min(100, Math.round((currentInLevel / 100) * 100))
  };
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<AppDatabase>(defaultDatabase);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world_logic');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [activeBossChallenge, setActiveBossChallenge] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);
  const [maxComboInSession, setMaxComboInSession] = useState<number>(0);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [paywallTriggerReason, setPaywallTriggerReason] = useState<string | null>(null);
  const [lastLessonStats, setLastLessonStats] = useState<{ xp: number; coins: number; isPerfect: boolean; combo: number } | null>(null);

  const subscriptionAccess = checkSubscriptionAccess(db);

  useEffect(() => {
    async function init() {
      const loaded = await dbService.load();
      if (!loaded.profile.name || (loaded.profile.xp === 0 && loaded.completedLessons.length === 0 && !window.localStorage.getItem('kemix_onboarded'))) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('home');
      }

      setSelectedWorldId(loaded.profile.selectedWorldId || 'world_logic');

      // Heart regen every 10 mins
      const now = Date.now();
      const elapsedMins = Math.floor((now - (loaded.profile.lastHeartRegen || now)) / (1000 * 60));
      if (elapsedMins >= 10 && loaded.profile.hearts < loaded.profile.maxHearts) {
        const heartsToAdd = Math.floor(elapsedMins / 10);
        loaded.profile.hearts = Math.min(loaded.profile.maxHearts, loaded.profile.hearts + heartsToAdd);
        loaded.profile.lastHeartRegen = now;
      }

      setDb(loaded);
      setLoading(false);
    }
    init();
  }, []);

  const updateDb = useCallback((updater: (prev: AppDatabase) => AppDatabase) => {
    setDb(prev => {
      const next = updater(prev);
      dbService.save(next);
      return next;
    });
  }, []);

  const navigateTo = (screen: ScreenType) => {
    soundEngine.playTap(db.profile.soundEnabled);
    trackScreenView(screen, db.profile.id, db.profile.name);
    setCurrentScreen(screen);
  };

  const selectWorld = (worldId: string) => {
    setSelectedWorldId(worldId);
    updateDb(prev => ({
      ...prev,
      profile: { ...prev.profile, selectedWorldId: worldId }
    }));
    soundEngine.playTap(db.profile.soundEnabled);
  };

  const startLesson = (lessonId: string, unitId: string, isBoss = false) => {
    // Check Premium Content Access Gate
    const currentWorld = db.curriculum.worlds.find(w => w.id === selectedWorldId) || db.curriculum.worlds[0];
    const unit = currentWorld?.units.find(u => u.id === unitId);
    const lessonIdx = unit?.lessons.findIndex(l => l.id === lessonId) ?? 0;

    if (isContentPremiumLocked(currentWorld.id, unitId, lessonIdx, db)) {
      soundEngine.playWrong(db.profile.soundEnabled);
      setPaywallTriggerReason('هذا الدرس متاح حصرياً لمشتركي كيميكس Premium. انضم إلى مشتركينا أو ابدأ تجربتك المجانية لتفتح كافة العوالم والمراحل!');
      setShowPaywallModal(true);
      return;
    }

    if (db.profile.hearts <= 0) {
      setShowOutOfHeartsModal(true);
      return;
    }
    setActiveLessonId(lessonId);
    setActiveUnitId(unitId);
    setActiveBossChallenge(isBoss);
    setCombo(0);
    setMaxComboInSession(0);
    setCurrentScreen('lesson');
    soundEngine.playTap(db.profile.soundEnabled);
  };

  const exitLesson = () => {
    setActiveLessonId(null);
    setActiveUnitId(null);
    setActiveBossChallenge(false);
    setCurrentScreen('learn');
    soundEngine.playTap(db.profile.soundEnabled);
  };

  const addXP = useCallback((amount: number) => {
    updateDb(prev => {
      const newXP = prev.profile.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > prev.profile.level;

      if (leveledUp) {
        soundEngine.playVictory(prev.profile.soundEnabled);
      }

      const todayXP = (prev.profile.xp % prev.profile.dailyGoalXP) + amount;
      const dailyGoalCompleted = todayXP >= prev.profile.dailyGoalXP;

      const updatedQuests = prev.dailyQuests.map(q => {
        if (q.id === 'q2') {
          const nextVal = Math.min(q.target, q.current + amount);
          return { ...q, current: nextVal, completed: nextVal >= q.target };
        }
        return q;
      });

      const updatedAchievements = prev.achievements.map(a => {
        if (a.id === 'first_code' && !a.unlocked) {
          return { ...a, unlocked: true, progress: 1, unlockedAt: new Date().toLocaleDateString('ar-EG') };
        }
        return a;
      });

      return {
        ...prev,
        profile: {
          ...prev.profile,
          xp: newXP,
          level: newLevel,
          dailyGoalCompleted: prev.profile.dailyGoalCompleted || dailyGoalCompleted,
          lastActiveDate: new Date().toISOString().split('T')[0]
        },
        dailyQuests: updatedQuests,
        achievements: updatedAchievements
      };
    });
  }, [updateDb]);

  const [shopItems] = useState<ShopItem[]>(initialShopItems);

  const addCoins = useCallback((amount: number, reason: string = 'إكمال التحديات والدروس') => {
    updateDb(prev => {
      const newCoins = prev.profile.coins + amount;
      const tx: CoinTransaction = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        amount,
        reasonAr: reason,
        type: 'earn',
        timestamp: Date.now()
      };
      const updatedTransactions = [...(prev.coinTransactions || []), tx];
      const updatedAchievements = prev.achievements.map(a => {
        if (a.id === 'coin_master') {
          const newProg = Math.min(a.maxProgress, a.progress + amount);
          return { ...a, progress: newProg, unlocked: newProg >= a.maxProgress };
        }
        return a;
      });
      return {
        ...prev,
        profile: { ...prev.profile, coins: newCoins },
        coinTransactions: updatedTransactions,
        achievements: updatedAchievements
      };
    });
  }, [updateDb]);

  const buyShopItem = (item: ShopItem): { success: boolean; message: string } => {
    if (db.profile.coins < item.price) {
      soundEngine.playWrong(db.profile.soundEnabled);
      return { success: false, message: 'رصيد العملات غير كافٍ لإتمام عملية الشراء!' };
    }

    // Check cosmetics already owned
    const alreadyOwned = (item.category === 'avatar' || item.category === 'frame') &&
      db.profile.inventory?.includes(item.id);

    if (alreadyOwned) {
      return { success: false, message: 'هذا العنصر موجود في حقيبتك بالفعل!' };
    }

    const tx: CoinTransaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      amount: item.price,
      reasonAr: `شراء ${item.titleAr}`,
      type: 'spend',
      timestamp: Date.now()
    };

    updateDb(prev => {
      const newCoins = Math.max(0, prev.profile.coins - item.price);
      let updatedInventory = [...(prev.profile.inventory || [])];
      let newAvatar = prev.profile.avatar;
      let newFrame = prev.profile.equippedFrame;
      let newHearts = prev.profile.hearts;
      let newStreakFreezes = prev.profile.streakFreezes;

      if (item.category === 'hearts') {
        newHearts = prev.profile.maxHearts;
      } else if (item.category === 'freeze') {
        newStreakFreezes = (newStreakFreezes || 0) + 1;
        if (!updatedInventory.includes(item.id)) updatedInventory.push(item.id);
      } else if (item.category === 'avatar') {
        if (!updatedInventory.includes(item.id)) updatedInventory.push(item.id);
        newAvatar = item.icon; // auto equip on purchase
      } else if (item.category === 'frame') {
        if (!updatedInventory.includes(item.id)) updatedInventory.push(item.id);
        newFrame = item.id; // auto equip on purchase
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          coins: newCoins,
          hearts: newHearts,
          streakFreezes: newStreakFreezes,
          avatar: newAvatar,
          equippedFrame: newFrame,
          inventory: updatedInventory
        },
        coinTransactions: [...(prev.coinTransactions || []), tx]
      };
    });

    soundEngine.playVictory(db.profile.soundEnabled);

    trackEvent('shop_purchase', {
      screen: 'shop',
      userId: db.profile.id,
      userName: db.profile.name,
      amount: item.price,
      details: { itemId: item.id, itemTitle: item.titleAr, price: item.price, category: item.category }
    });

    return { success: true, message: `مبروك! تم شراء واستخدام "${item.titleAr}" بنجاح!` };
  };

  const equipItem = (item: ShopItem) => {
    if (item.category === 'avatar') {
      updateProfile({ avatar: item.icon });
      soundEngine.playTap(db.profile.soundEnabled);
    } else if (item.category === 'frame') {
      updateProfile({ equippedFrame: item.id });
      soundEngine.playTap(db.profile.soundEnabled);
    }
  };

  const loseHeart = (): boolean => {
    let hasRemaining = true;
    updateDb(prev => {
      const newHearts = Math.max(0, prev.profile.hearts - 1);
      hasRemaining = newHearts > 0;
      soundEngine.playWrong(prev.profile.soundEnabled);
      return {
        ...prev,
        profile: { ...prev.profile, hearts: newHearts, lastHeartRegen: Date.now() }
      };
    });
    setCombo(0);
    if (!hasRemaining) {
      setShowOutOfHeartsModal(true);
    }
    return hasRemaining;
  };

  const refillHearts = () => {
    updateDb(prev => ({
      ...prev,
      profile: { ...prev.profile, hearts: prev.profile.maxHearts, lastHeartRegen: Date.now() }
    }));
    setShowOutOfHeartsModal(false);
  };

  const buyHeartsWithCoins = (): boolean => {
    if (db.profile.coins < 30) return false;
    updateDb(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        coins: prev.profile.coins - 30,
        hearts: prev.profile.maxHearts,
        lastHeartRegen: Date.now()
      }
    }));
    soundEngine.playVictory(db.profile.soundEnabled);
    setShowOutOfHeartsModal(false);
    return true;
  };

  const recordChallengeAttempt = (
    challengeId: string, 
    lessonId: string, 
    isCorrect: boolean, 
    timeSpentSec: number, 
    answer: string | string[]
  ) => {
    const attempt: AttemptRecord = {
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      challengeId,
      lessonId,
      isCorrect,
      timeSpentSec,
      answer,
      timestamp: Date.now()
    };

    if (isCorrect) {
      setCombo(prev => {
        const next = prev + 1;
        setMaxComboInSession(m => Math.max(m, next));
        soundEngine.playCombo(next, db.profile.soundEnabled);
        return next;
      });
    }

    updateDb(prev => {
      const updatedAttempts = [...prev.attempts, attempt];
      let updatedMistakes = [...prev.practiceMistakes];
      if (!isCorrect && !updatedMistakes.includes(challengeId)) {
        updatedMistakes.push(challengeId);
      } else if (isCorrect && updatedMistakes.includes(challengeId)) {
        updatedMistakes = updatedMistakes.filter(id => id !== challengeId);
      }

      let updatedAchievements = [...prev.achievements];
      if (isCorrect && challengeId.includes('py_1_4')) {
        updatedAchievements = updatedAchievements.map(a => {
          if (a.id === 'code_runner') return { ...a, unlocked: true, progress: 1 };
          return a;
        });
      }

      const updatedQuests = prev.dailyQuests.map(q => {
        if (q.id === 'q3' && isCorrect) {
          const nextVal = Math.min(q.target, q.current + 1);
          return { ...q, current: nextVal, completed: nextVal >= q.target };
        }
        return q;
      });

      return {
        ...prev,
        attempts: updatedAttempts,
        practiceMistakes: updatedMistakes,
        achievements: updatedAchievements,
        dailyQuests: updatedQuests
      };
    });
  };

  const finishLesson = (lessonId: string, unitId: string, isPerfect: boolean) => {
    const baseXP = 30;
    const bonusXP = isPerfect ? 15 : 0;
    const bossBonus = activeBossChallenge ? 70 : 0;
    const totalLessonXP = baseXP + bonusXP + bossBonus;
    const lessonCoins = isPerfect ? 25 : 15;

    addXP(totalLessonXP);
    addCoins(lessonCoins);

    setLastLessonStats({
      xp: totalLessonXP,
      coins: lessonCoins,
      isPerfect,
      combo: maxComboInSession
    });
    setShowRewardModal(true);

    trackEvent('lesson_complete', {
      screen: 'lesson',
      userId: db.profile.id,
      userName: db.profile.name,
      details: {
        lessonId,
        unitId,
        isPerfect,
        totalLessonXP,
        lessonCoins,
        combo: maxComboInSession
      }
    });

    updateDb(prev => {
      const updatedCompleted = prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId];

      // Check if world unlocked
      let updatedUnlockedWorlds = [...prev.unlockedWorlds];
      if (activeBossChallenge) {
        // Unlock next world
        const allWorlds = prev.curriculum.worlds;
        const currentIdx = allWorlds.findIndex(w => w.id === selectedWorldId);
        if (currentIdx >= 0 && currentIdx + 1 < allWorlds.length) {
          const nextWorld = allWorlds[currentIdx + 1];
          if (!updatedUnlockedWorlds.includes(nextWorld.id)) {
            updatedUnlockedWorlds.push(nextWorld.id);
          }
        }
      }

      const updatedQuests = prev.dailyQuests.map(q => {
        if (q.id === 'q1') {
          return { ...q, current: 1, completed: true };
        }
        return q;
      });

      const updatedAchievements = prev.achievements.map(a => {
        if (a.id === 'perfect_lesson' && isPerfect) return { ...a, unlocked: true, progress: 1 };
        if (a.id === 'speed_learner') return { ...a, progress: Math.min(3, updatedCompleted.length), unlocked: updatedCompleted.length >= 3 };
        if (a.id === 'boss_slayer' && activeBossChallenge) return { ...a, unlocked: true, progress: 1 };
        return a;
      });

      return {
        ...prev,
        completedLessons: updatedCompleted,
        unlockedWorlds: updatedUnlockedWorlds,
        dailyQuests: updatedQuests,
        achievements: updatedAchievements
      };
    });
  };

  const claimQuest = (questId: string) => {
    const quest = db.dailyQuests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    addXP(quest.xpReward);
    addCoins(quest.coinReward);

    updateDb(prev => ({
      ...prev,
      dailyQuests: prev.dailyQuests.map(q => q.id === questId ? { ...q, claimed: true } : q)
    }));
    soundEngine.playVictory(db.profile.soundEnabled);
  };

  const isWorldUnlocked = (world: World): boolean => {
    if (world.order === 1) return true;
    if (db.unlockedWorlds.includes(world.id)) return true;
    return db.profile.level >= world.requiredLevelToUnlock;
  };

  const getLessonStatus = (lessonId: string): SkillStatus => {
    if (db.completedLessons.includes(lessonId)) return 'completed';
    return 'available';
  };

  const toggleSound = () => {
    updateDb(prev => ({
      ...prev,
      profile: { ...prev.profile, soundEnabled: !prev.profile.soundEnabled }
    }));
  };

  const toggleTheme = () => {
    updateDb(prev => ({
      ...prev,
      profile: { ...prev.profile, theme: prev.profile.theme === 'dark' ? 'light' : 'dark' }
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    updateDb(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
  };

  const resetProgress = async () => {
    const resetDb = await dbService.reset();
    setDb(resetDb);
    setCurrentScreen('home');
  };

  const completeOnboarding = (name: string, goal: string, level: 'beginner' | 'some' | 'intermediate', dailyGoalXP: number) => {
    window.localStorage.setItem('kemix_onboarded', 'true');
    updateDb(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        name,
        learningGoal: goal,
        experienceLevel: level,
        dailyGoalXP
      }
    }));
    soundEngine.playVictory(db.profile.soundEnabled);
    setCurrentScreen('home');
  };

  // Admin CMS & Dynamic Content Operations
  const updateCurriculum = (newCurriculum: CurriculumData) => {
    updateDb(prev => ({
      ...prev,
      curriculum: newCurriculum
    }));
  };

  const addOrUpdateWorld = (world: World) => {
    updateDb(prev => {
      const existingIdx = prev.curriculum.worlds.findIndex(w => w.id === world.id);
      let newWorlds = [...prev.curriculum.worlds];
      if (existingIdx >= 0) {
        newWorlds[existingIdx] = world;
      } else {
        newWorlds.push(world);
      }
      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          version: prev.curriculum.version + 1,
          lastUpdated: new Date().toISOString().split('T')[0],
          worlds: newWorlds
        }
      };
    });
  };

  const deleteWorld = (worldId: string) => {
    updateDb(prev => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        worlds: prev.curriculum.worlds.filter(w => w.id !== worldId)
      }
    }));
  };

  const importCurriculumFile = (jsonStr: string): boolean => {
    const imported = dbService.importCurriculumJSON(jsonStr);
    if (!imported) return false;
    updateCurriculum(imported);
    return true;
  };

  const triggerSync = async () => {
    updateDb(prev => ({ ...prev, syncStatus: 'syncing' }));
    // Simulate seamless local & remote sync
    setTimeout(() => {
      updateDb(prev => ({
        ...prev,
        syncStatus: 'synced',
        lastSyncTime: Date.now()
      }));
    }, 800);
  };

  // --- Subscription System Implementation ---
  const subscribe = async (
    plan: SubscriptionPlanType,
    billingCycle: BillingCycle,
    paymentMethod: PaymentMethodType,
    isTrial: boolean = false
  ): Promise<{ success: boolean; message: string }> => {
    const config = db.subscriptionConfig;
    const price = isTrial ? 0 : (
      plan === 'individual' 
        ? (billingCycle === 'monthly' ? config.individualMonthlyPrice : config.individualAnnualPrice)
        : (plan === 'family'
            ? (billingCycle === 'monthly' ? config.familyMonthlyPrice : config.familyAnnualPrice)
            : 2499)
    );

    const now = Date.now();
    const durationDays = isTrial ? config.trialPeriodDays : (billingCycle === 'monthly' ? 30 : 365);
    const endTimestamp = now + durationDays * 24 * 60 * 60 * 1000;

    const res = await paymentGatewayService.processPayment({
      plan,
      billingCycle,
      amount: price,
      currency: 'EGP',
      paymentMethod,
      userName: db.profile.name,
      isTrial
    });

    if (!res.success) {
      return { success: false, message: res.errorMessage || 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.' };
    }

    const newRole = plan === 'family' ? 'FAMILY' : (plan === 'organization' ? 'ORGANIZATION' : 'PREMIUM');

    const newSub = {
      plan,
      billingCycle,
      status: isTrial ? ('trial' as const) : ('active' as const),
      startDate: new Date(now).toISOString(),
      endDate: new Date(endTimestamp).toISOString(),
      renewalDate: new Date(endTimestamp).toISOString(),
      autoRenew: true,
      trialStartDate: isTrial ? new Date(now).toISOString() : undefined,
      trialEndDate: isTrial ? new Date(endTimestamp).toISOString() : undefined,
      paymentMethod,
      transactionId: res.transactionId,
      lastPaymentAmount: price
    };

    updateDb(prev => {
      let famMembers = prev.familyMembers || [];
      if (plan === 'family' && famMembers.length === 0) {
        famMembers = [
          {
            ...createFamilyMemberProfile('fam_owner', prev.profile.name || 'مدير الحساب العائلي', prev.profile.avatar || '🦅', 'owner'),
            xp: prev.profile.xp,
            level: prev.profile.level,
            streak: prev.profile.streak,
            completedLessons: [...prev.completedLessons]
          }
        ];
      }

      return {
        ...prev,
        subscription: newSub,
        familyMembers: famMembers,
        profile: {
          ...prev.profile,
          role: newRole
        }
      };
    });

    soundEngine.playVictory(db.profile.soundEnabled);
    return {
      success: true,
      message: isTrial 
        ? `تم تفعيل التجربة المجانية لمدة ${config.trialPeriodDays} أيام بنجاح!` 
        : 'تم تفعيل الاشتراك بنجاح! استمتع برحلة التعلم الكاملة في كيميكس.'
    };
  };

  const cancelSubscriptionRenewal = (): { success: boolean; message: string } => {
    if (!db.subscription) return { success: false, message: 'لا يوجد اشتراك نشط للإلغاء.' };

    updateDb(prev => {
      if (!prev.subscription) return prev;
      return {
        ...prev,
        subscription: {
          ...prev.subscription,
          status: 'cancelled',
          autoRenew: false,
          canceledAt: new Date().toISOString()
        }
      };
    });

    return {
      success: true,
      message: 'تم إلغاء التجديد التلقائي. ستظل مميزات الاشتراك فعالة حتى نهاية الفترة المدفوعة دون خصم جديد.'
    };
  };

  const reactivateSubscription = (): { success: boolean; message: string } => {
    if (!db.subscription) return { success: false, message: 'لا يوجد اشتراك سابق لإعادة تفعيله.' };

    const now = Date.now();
    const isExpired = new Date(db.subscription.endDate).getTime() <= now;
    const durationDays = db.subscription.billingCycle === 'monthly' ? 30 : 365;
    const newEnd = isExpired ? new Date(now + durationDays * 24 * 60 * 60 * 1000).toISOString() : db.subscription.endDate;

    updateDb(prev => {
      if (!prev.subscription) return prev;
      return {
        ...prev,
        subscription: {
          ...prev.subscription,
          status: 'active',
          autoRenew: true,
          endDate: newEnd,
          renewalDate: newEnd,
          canceledAt: undefined
        },
        profile: {
          ...prev.profile,
          role: prev.subscription.plan === 'family' ? 'FAMILY' : (prev.subscription.plan === 'organization' ? 'ORGANIZATION' : 'PREMIUM')
        }
      };
    });

    return { success: true, message: 'تمت إعادة تفعيل اشتراكك بنجاح!' };
  };

  const changePlan = async (newPlan: SubscriptionPlanType, newCycle: BillingCycle): Promise<{ success: boolean; message: string }> => {
    return await subscribe(newPlan, newCycle, db.subscription?.paymentMethod || 'credit_card', false);
  };

  const updateSubscriptionConfig = (newConfig: Partial<SubscriptionConfig>) => {
    updateDb(prev => ({
      ...prev,
      subscriptionConfig: {
        ...prev.subscriptionConfig,
        ...newConfig
      }
    }));
  };

  // --- Family Members Management ---
  const addFamilyMember = (name: string, avatar: string): { success: boolean; message: string } => {
    if ((db.familyMembers || []).length >= db.subscriptionConfig.familyMaxMembers) {
      return { success: false, message: `وصلت للحد الأقصى المسموح (${db.subscriptionConfig.familyMaxMembers} حسابات)` };
    }
    const newMember = createFamilyMemberProfile('fam_' + Date.now(), name, avatar, 'member');
    updateDb(prev => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), newMember]
    }));
    return { success: true, message: `تمت إضافة الحساب "${name}" بنجاح!` };
  };

  const removeFamilyMember = (memberId: string): { success: boolean; message: string } => {
    updateDb(prev => ({
      ...prev,
      familyMembers: (prev.familyMembers || []).filter(m => m.id !== memberId)
    }));
    return { success: true, message: 'تم حذف الحساب من باقة العائلة.' };
  };

  const switchFamilyMember = (memberId: string) => {
    const member = db.familyMembers.find(m => m.id === memberId);
    if (!member) return;

    updateDb(prev => {
      const updatedMembers = prev.familyMembers.map(m => {
        if (m.id === prev.activeFamilyMemberId || (!prev.activeFamilyMemberId && m.role === 'owner')) {
          return {
            ...m,
            level: prev.profile.level,
            xp: prev.profile.xp,
            streak: prev.profile.streak,
            completedLessons: [...prev.completedLessons],
            completedChallenges: [...prev.completedChallenges],
            attempts: [...prev.attempts],
            achievements: [...prev.achievements],
            practiceMistakes: [...prev.practiceMistakes]
          };
        }
        return m;
      });

      return {
        ...prev,
        activeFamilyMemberId: memberId,
        familyMembers: updatedMembers,
        completedLessons: [...member.completedLessons],
        completedChallenges: [...member.completedChallenges],
        attempts: [...member.attempts],
        achievements: member.achievements.length > 0 ? member.achievements : prev.achievements,
        practiceMistakes: [...member.practiceMistakes],
        profile: {
          ...prev.profile,
          name: member.name,
          avatar: member.avatar,
          level: member.level,
          xp: member.xp,
          streak: member.streak
        }
      };
    });
    soundEngine.playTap(db.profile.soundEnabled);
  };

  // --- Organization Management ---
  const addOrgStudent = (name: string, email: string, groupId: string): { success: boolean; message: string } => {
    if (!db.organizationAccount) return { success: false, message: 'لا توجد بيانات مؤسسة.' };
    if (db.organizationAccount.students.length >= db.organizationAccount.seatsTotal) {
      return { success: false, message: 'تم استهلاك جميع المقاعد المتاحة للمؤسسة.' };
    }
    const newStudent = {
      id: 'std_' + Date.now(),
      name,
      email,
      groupId,
      level: 1,
      xp: 0,
      streak: 1,
      completedLessonsCount: 0,
      completionRatePercent: 0,
      strengths: ['بداية المسار'],
      weaknesses: [],
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
    updateDb(prev => {
      if (!prev.organizationAccount) return prev;
      return {
        ...prev,
        organizationAccount: {
          ...prev.organizationAccount,
          seatsUsed: prev.organizationAccount.seatsUsed + 1,
          students: [...prev.organizationAccount.students, newStudent]
        }
      };
    });
    return { success: true, message: `تم تسجيل الطالب ${name} بنجاح!` };
  };

  const removeOrgStudent = (studentId: string) => {
    updateDb(prev => {
      if (!prev.organizationAccount) return prev;
      return {
        ...prev,
        organizationAccount: {
          ...prev.organizationAccount,
          seatsUsed: Math.max(0, prev.organizationAccount.seatsUsed - 1),
          students: prev.organizationAccount.students.filter(s => s.id !== studentId)
        }
      };
    });
  };

  const createOrgGroup = (name: string, instructorName: string, assignedWorldId?: string) => {
    const newGroup = {
      id: 'grp_' + Date.now(),
      name,
      instructorName,
      studentIds: [],
      assignedWorldId: assignedWorldId || 'world_logic',
      createdAt: new Date().toISOString()
    };
    updateDb(prev => {
      if (!prev.organizationAccount) return prev;
      return {
        ...prev,
        organizationAccount: {
          ...prev.organizationAccount,
          groups: [...prev.organizationAccount.groups, newGroup]
        }
      };
    });
  };

  const assignTrackToGroup = (groupId: string, worldId: string) => {
    updateDb(prev => {
      if (!prev.organizationAccount) return prev;
      return {
        ...prev,
        organizationAccount: {
          ...prev.organizationAccount,
          groups: prev.organizationAccount.groups.map(g => g.id === groupId ? { ...g, assignedWorldId: worldId } : g)
        }
      };
    });
  };

  const updateOrgAccount = (updates: Partial<OrganizationAccount>) => {
    updateDb(prev => {
      if (!prev.organizationAccount) return prev;
      return {
        ...prev,
        organizationAccount: {
          ...prev.organizationAccount,
          ...updates
        }
      };
    });
  };

  return (
    <GameContext.Provider
      value={{
        db,
        loading,
        currentScreen,
        selectedWorldId,
        activeLessonId,
        activeUnitId,
        activeBossChallenge,
        combo,
        maxComboInSession,
        showOutOfHeartsModal,
        setShowOutOfHeartsModal,
        showRewardModal,
        setShowRewardModal,
        showPaywallModal,
        setShowPaywallModal,
        paywallTriggerReason,
        setPaywallTriggerReason,
        subscriptionAccess,
        subscribe,
        cancelSubscriptionRenewal,
        reactivateSubscription,
        changePlan,
        updateSubscriptionConfig,
        addFamilyMember,
        removeFamilyMember,
        switchFamilyMember,
        addOrgStudent,
        removeOrgStudent,
        createOrgGroup,
        assignTrackToGroup,
        updateOrgAccount,
        lastLessonStats,
        shopItems,
        navigateTo,
        selectWorld,
        startLesson,
        exitLesson,
        addXP,
        addCoins,
        loseHeart,
        refillHearts,
        buyHeartsWithCoins,
        buyShopItem,
        equipItem,
        recordChallengeAttempt,
        finishLesson,
        claimQuest,
        isWorldUnlocked,
        getLessonStatus,
        toggleSound,
        toggleTheme,
        updateProfile,
        resetProgress,
        completeOnboarding,
        updateCurriculum,
        addOrUpdateWorld,
        deleteWorld,
        importCurriculumFile,
        triggerSync
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
