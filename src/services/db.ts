import { 
  UserProfile, 
  DailyQuest, 
  Achievement, 
  AttemptRecord, 
  CurriculumData, 
  CoinTransaction,
  SubscriptionConfig,
  UserSubscription,
  FamilyMemberProfile,
  OrganizationAccount
} from '../types';
import { initialCurriculum, kemixAchievements } from '../data/curriculum';
import { defaultOrganizationSample } from './subscriptionService';

export const defaultSubscriptionConfig: SubscriptionConfig = {
  individualMonthlyPrice: 49.99,
  individualAnnualPrice: 399.99,
  familyMonthlyPrice: 89.99,
  familyAnnualPrice: 699.99,
  trialPeriodDays: 7,
  familyMaxMembers: 5,
  organizationTiers: [
    { id: 'tier_25', minUsers: 1, maxUsers: 25, priceAnnual: 2499, labelAr: 'حتى 25 مستخدمًا' },
    { id: 'tier_50', minUsers: 26, maxUsers: 50, priceAnnual: 4499, labelAr: 'حتى 50 مستخدمًا' },
    { id: 'tier_100', minUsers: 51, maxUsers: 100, priceAnnual: 7999, labelAr: 'حتى 100 مستخدم' },
    { id: 'tier_custom', minUsers: 101, maxUsers: 99999, priceAnnual: 0, labelAr: 'أكثر من 100 مستخدم', isCustom: true }
  ],
  features: {
    individual: [
      'الوصول الكامل لمسار تعلم البرمجة ومراحل كيميكس',
      'جميع العوالم والمراحل المتاحة في الخطة',
      'جميع الدروس التفاعلية والتمارين العملية',
      'نظام XP والمستويات وبنك المراجعة الذكي',
      'تحديات الأكواد التفاعلية ومحرر البرمجة',
      'أوسمة وإنجازات صقر كيميكس',
      'المحتوى الإنجليزي المدمج داخل دروس البرمجة',
      'حفظ ومزامنة التقدم السحابي التلقائي',
      'الدروس التي تم تنزيلها للعمل Offline دون إنترنت',
      'المحتوى البرمجي والتحديثات الجديدة أثناء الاشتراك'
    ],
    family: [
      'جميع مميزات الخطة الفردية بالكامل',
      'حتى 5 حسابات تعليمية مستقلة لأفراد العائلة',
      'ملف شخصي ومستوى و XP و Streak مستقل لكل فرد',
      'سجل تعلم وإنجازات وتقدم مستقل تماماً دون خلط',
      'لوحة تحكم لمدير العائلة لإضافة وإزالة الأعضاء',
      'تبديل سريع وفوري بين حسابات الأبناء والأهل',
      'توفير مالي كبير مقارنة بالاشتراكات الفردية'
    ],
    organization: [
      'كل مميزات منصة كيميكس البرمجية لكافة الطلاب',
      'لوحة تحكم متقدمة للمؤسسات والمدارس (Organization Dashboard)',
      'إدارة الفصول والمجموعات والطلاب والمدرسين',
      'متابعة تفصيلية لتقدم الطلاب والـ XP ونسب الإنجاز',
      'تحليلات دقيقة لنقاط القوة والضعف لكل طالب',
      'تصدير تقارير الأداء التفصيلية بصيغة احترافية',
      'تحديد وتخصيص مسارات تعليمية وفصول مخصصة',
      'حماية وخصوصية تامة لبيانات الطلاب واستقلاليتها'
    ]
  }
};

export interface AppDatabase {
  profile: UserProfile;
  curriculum: CurriculumData; // Dynamic curriculum saved in DB!
  completedLessons: string[];
  completedChallenges: string[];
  unlockedWorlds: string[];
  skillMastery: Record<string, number>;
  dailyQuests: DailyQuest[];
  achievements: Achievement[];
  attempts: AttemptRecord[];
  practiceMistakes: string[];
  coinTransactions: CoinTransaction[];
  syncStatus: 'offline' | 'synced' | 'syncing';
  lastSyncTime: number;

  // Subscription & Multi-Tenant Management
  subscriptionConfig: SubscriptionConfig;
  subscription: UserSubscription | null;
  familyMembers: FamilyMemberProfile[];
  activeFamilyMemberId?: string;
  organizationAccount?: OrganizationAccount;
}

const STORAGE_KEY = 'kemix_app_db_v2';

const defaultProfile: UserProfile = {
  id: 'user_kemix_default',
  name: 'بطل كيميكس',
  avatar: '🦅',
  role: 'FREE',
  level: 1,
  xp: 0,
  coins: 50,
  hearts: 5,
  maxHearts: 5,
  lastHeartRegen: Date.now(),
  streak: 1,
  longestStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalXP: 30,
  dailyGoalCompleted: false,
  selectedWorldId: 'world_logic',
  experienceLevel: 'beginner',
  learningGoal: 'بناء مشاريع حقيقية',
  soundEnabled: true,
  theme: 'dark',
  language: 'ar',
  streakFreezes: 1,
  inventory: ['streak_freeze']
};

const defaultQuests: DailyQuest[] = [
  {
    id: 'q1',
    titleAr: 'إكمال درس جديد في كيميكس',
    descriptionAr: 'أكمل درساً برمجياً واحداً اليوم بصحبة الصقر حورس',
    target: 1,
    current: 0,
    xpReward: 30,
    coinReward: 15,
    completed: false,
    claimed: false
  },
  {
    id: 'q2',
    titleAr: 'حصد 40 نقطة خبرة XP',
    descriptionAr: 'اربح 40 XP من حل التحديات المتنوعة',
    target: 40,
    current: 0,
    xpReward: 40,
    coinReward: 20,
    completed: false,
    claimed: false
  },
  {
    id: 'q3',
    titleAr: 'كومبو الصقر (3 متتالية)',
    descriptionAr: 'أجب عن 3 تحديات متتالية دون خطأ في جولة واحدة',
    target: 3,
    current: 0,
    xpReward: 35,
    coinReward: 15,
    completed: false,
    claimed: false
  }
];

export const defaultDatabase: AppDatabase = {
  profile: defaultProfile,
  curriculum: initialCurriculum,
  completedLessons: [],
  completedChallenges: [],
  unlockedWorlds: ['world_logic'],
  skillMastery: {},
  dailyQuests: defaultQuests,
  achievements: kemixAchievements,
  attempts: [],
  practiceMistakes: [],
  coinTransactions: [],
  syncStatus: 'offline',
  lastSyncTime: Date.now(),
  subscriptionConfig: defaultSubscriptionConfig,
  subscription: null,
  familyMembers: [],
  organizationAccount: defaultOrganizationSample
};

// Electron window API
declare global {
  interface Window {
    electronAPI?: {
      loadDatabase: () => Promise<AppDatabase | null>;
      saveDatabase: (data: AppDatabase) => Promise<{ success: boolean; error?: string }>;
      getVersion: () => Promise<string>;
      isDesktop: boolean;
    };
  }
}

export const dbService = {
  async load(): Promise<AppDatabase> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.loadDatabase) {
        const desktopData = await window.electronAPI.loadDatabase();
        if (desktopData && desktopData.profile) {
          return {
            ...defaultDatabase,
            ...desktopData,
            profile: {
              ...defaultProfile,
              ...desktopData.profile
            },
            subscriptionConfig: desktopData.subscriptionConfig || defaultSubscriptionConfig,
            curriculum: desktopData.curriculum || initialCurriculum
          };
        }
      }

      // Fallback to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...defaultDatabase,
            ...parsed,
            profile: {
              ...defaultProfile,
              ...parsed.profile
            },
            subscriptionConfig: parsed.subscriptionConfig || defaultSubscriptionConfig,
            curriculum: parsed.curriculum || initialCurriculum
          };
        }
      }
    } catch (err) {
      console.warn('Error loading KEMIX database, using default state:', err);
    }
    return defaultDatabase;
  },

  async save(db: AppDatabase): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.saveDatabase) {
        await window.electronAPI.saveDatabase(db);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      }
    } catch (err) {
      console.error('Error saving KEMIX database:', err);
    }
  },

  exportCurriculumJSON(curriculum: CurriculumData): string {
    return JSON.stringify(curriculum, null, 2);
  },

  importCurriculumJSON(jsonString: string): CurriculumData | null {
    try {
      const parsed = JSON.parse(jsonString) as CurriculumData;
      if (parsed && Array.isArray(parsed.worlds)) {
        return parsed;
      }
    } catch (err) {
      console.error('Invalid curriculum JSON:', err);
    }
    return null;
  },

  async reset(): Promise<AppDatabase> {
    const freshDb: AppDatabase = JSON.parse(JSON.stringify(defaultDatabase));
    freshDb.profile.lastHeartRegen = Date.now();
    await this.save(freshDb);
    return freshDb;
  }
};
