export type ChallengeType = 
  | 'multiple_choice'
  | 'true_false'
  | 'code_completion'
  | 'predict_output'
  | 'find_bug'
  | 'reorder_code'
  | 'term_match'
  | 'interactive_code'
  | 'fill_blank';

export type SkillStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';

export type DifficultyLevel = 'introductory' | 'basic' | 'intermediate' | 'advanced' | 'mastery' | 'exam';

export interface TermPair {
  en: string;
  ar: string;
}

export interface TestCase {
  descriptionAr: string;
  expectedOutput: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  titleAr: string;
  questionAr: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[]; // string or array of ordered strings
  explanationAr: string;
  hintAr: string;
  starterCode?: string;
  englishTerm?: { term: string; phoneticAr: string; meaningAr: string };
  termPairs?: TermPair[];
  testCases?: TestCase[];
  xpReward: number;
  coinReward: number;
  difficulty?: DifficultyLevel;
}

export interface Lesson {
  id: string;
  unitId: string;
  worldId: string;
  titleAr: string;
  descriptionAr: string;
  order: number;
  conceptIntroAr: string;
  englishFocusTerm?: string;
  challenges: Challenge[];
  xpReward: number;
  coinReward: number;
  difficulty?: DifficultyLevel;
  requiredStarsToUnlock?: number;
}

export interface Unit {
  id: string;
  worldId: string;
  titleAr: string;
  descriptionAr: string;
  order: number;
  difficultyLevel?: DifficultyLevel;
  lessons: Lesson[];
  bossChallenge?: Challenge;
  isUnitExam?: boolean;
  passingScorePercent?: number; // e.g. 80%
}

export interface World {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  icon: string;
  order: number;
  themeColor: string;
  accentGradient: string;
  units: Unit[];
  requiredLevelToUnlock: number;
  bossChallenge?: Challenge;
  project?: {
    id: string;
    titleAr: string;
    descriptionAr: string;
    starterCode: string;
    expectedOutput: string;
    xpReward: number;
    coinReward: number;
  };
}

export interface CurriculumData {
  version: number;
  lastUpdated: string;
  worlds: World[];
}

export interface ShopItem {
  id: string;
  titleAr: string;
  descriptionAr: string;
  category: 'avatar' | 'frame' | 'freeze' | 'hearts';
  price: number;
  icon: string;
  assetUrl?: string;
  purchased?: boolean;
}

export type UserRole = 'FREE' | 'PREMIUM' | 'FAMILY' | 'ORGANIZATION' | 'ADMIN';

export type SubscriptionPlanType = 'individual' | 'family' | 'organization';
export type BillingCycle = 'monthly' | 'annual';
export type SubscriptionStatus = 
  | 'active' 
  | 'trial' 
  | 'expired' 
  | 'cancelled' 
  | 'past_due' 
  | 'pending_payment';

export type PaymentMethodType = 'credit_card' | 'fawry' | 'vodafone_cash' | 'instapay';

export interface OrganizationTier {
  id: string;
  minUsers: number;
  maxUsers: number;
  priceAnnual: number;
  labelAr: string;
  isCustom?: boolean;
}

export interface SubscriptionConfig {
  individualMonthlyPrice: number;
  individualAnnualPrice: number;
  familyMonthlyPrice: number;
  familyAnnualPrice: number;
  trialPeriodDays: number;
  familyMaxMembers: number;
  organizationTiers: OrganizationTier[];
  features: {
    individual: string[];
    family: string[];
    organization: string[];
  };
}

export interface UserSubscription {
  plan: SubscriptionPlanType;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startDate: string; // ISO string
  endDate: string; // ISO string
  renewalDate: string; // ISO string
  autoRenew: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
  paymentMethod?: PaymentMethodType;
  transactionId?: string;
  lastPaymentAmount?: number;
  canceledAt?: string;
}

export interface FamilyMemberProfile {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'member';
  addedAt: string;
  level: number;
  xp: number;
  streak: number;
  completedLessons: string[];
  completedChallenges: string[];
  attempts: AttemptRecord[];
  achievements: Achievement[];
  practiceMistakes: string[];
}

export interface OrganizationStudent {
  id: string;
  name: string;
  email: string;
  groupId: string;
  level: number;
  xp: number;
  streak: number;
  completedLessonsCount: number;
  completionRatePercent: number;
  strengths: string[];
  weaknesses: string[];
  lastActiveDate: string;
}

export interface OrganizationGroup {
  id: string;
  name: string;
  instructorName: string;
  studentIds: string[];
  assignedWorldId?: string;
  createdAt: string;
}

export interface OrganizationAccount {
  id: string;
  orgName: string;
  orgType: 'school' | 'academy' | 'university' | 'company' | 'training_center';
  contactPerson: string;
  email: string;
  phone: string;
  seatsTotal: number;
  seatsUsed: number;
  groups: OrganizationGroup[];
  students: OrganizationStudent[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  level: number;
  xp: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  lastHeartRegen: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyGoalXP: number;
  dailyGoalCompleted: boolean;
  selectedWorldId: string;
  experienceLevel: 'beginner' | 'some' | 'intermediate';
  learningGoal: string;
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  streakFreezes: number;
  equippedFrame?: string;
  inventory: string[]; // item IDs
}

export interface DailyQuest {
  id: string;
  titleAr: string;
  descriptionAr: string;
  target: number;
  current: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  category: 'streak' | 'xp' | 'lessons' | 'perfect' | 'boss';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface AttemptRecord {
  id: string;
  challengeId: string;
  lessonId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpentSec: number;
  timestamp: number;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  reasonAr: string;
  type: 'earn' | 'spend';
  timestamp: number;
}

