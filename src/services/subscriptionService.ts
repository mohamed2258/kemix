import {
  SubscriptionConfig,
  UserSubscription,
  SubscriptionPlanType,
  BillingCycle,
  SubscriptionStatus,
  PaymentMethodType,
  FamilyMemberProfile,
  OrganizationAccount,
  UserProfile,
  UserRole
} from '../types';
import { AppDatabase } from './db';

/**
 * Calculates discount percentage dynamically based on monthly vs annual pricing.
 * Formula: ((monthly * 12 - annual) / (monthly * 12)) * 100
 */
export function calculateSavingsPercent(monthlyPrice: number, annualPrice: number): number {
  if (monthlyPrice <= 0 || annualPrice <= 0) return 0;
  const fullYearMonthly = monthlyPrice * 12;
  if (annualPrice >= fullYearMonthly) return 0;
  const savings = ((fullYearMonthly - annualPrice) / fullYearMonthly) * 100;
  return Math.round(savings);
}

/**
 * Interface for Payment Gateway Provider (Decoupled Architecture)
 * Prepares system for real gateways like Paymob, Fawry, Vodafone Cash, Stripe, etc.
 */
export interface PaymentGatewayRequest {
  plan: SubscriptionPlanType;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  userEmail?: string;
  userName?: string;
  phoneNumber?: string;
  isTrial?: boolean;
}

export interface PaymentGatewayResponse {
  success: boolean;
  transactionId: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  errorMessage?: string;
  gatewayReference?: string;
  timestamp: number;
}

/**
 * Payment Gateway Service implementation
 * Decoupled from UI, supports Egyptian payment channels and server-side verification simulation.
 */
export const paymentGatewayService = {
  async processPayment(req: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    // Simulate real gateway network latency and server verification (500ms)
    await new Promise(res => setTimeout(res, 600));

    // Support realistic validation
    if (req.amount < 0) {
      return {
        success: false,
        transactionId: '',
        paymentStatus: 'failed',
        errorMessage: 'قيمة الدفع غير صحيحة.',
        timestamp: Date.now()
      };
    }

    const txId = 'TX_KEMIX_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const ref = 'EGP_GATEWAY_' + Math.floor(100000000 + Math.random() * 900000000);

    return {
      success: true,
      transactionId: txId,
      paymentStatus: 'paid',
      gatewayReference: ref,
      timestamp: Date.now()
    };
  }
};

/**
 * Checks effective subscription access for a database state.
 * Validates expiration dates, trial periods, and roles.
 */
export function checkSubscriptionAccess(db: AppDatabase): {
  hasPremiumAccess: boolean;
  effectiveRole: UserRole;
  isTrial: boolean;
  isCancelledButActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
} {
  const sub = db.subscription;
  const profileRole = db.profile.role;

  // Admin always has full access
  if (profileRole === 'ADMIN') {
    return {
      hasPremiumAccess: true,
      effectiveRole: 'ADMIN',
      isTrial: false,
      isCancelledButActive: false,
      isExpired: false,
      daysRemaining: 9999
    };
  }

  if (!sub) {
    return {
      hasPremiumAccess: false,
      effectiveRole: 'FREE',
      isTrial: false,
      isCancelledButActive: false,
      isExpired: false,
      daysRemaining: 0
    };
  }

  const now = Date.now();
  const endTimestamp = new Date(sub.endDate).getTime();
  const isExpired = isNaN(endTimestamp) || now > endTimestamp;
  const daysRemaining = Math.max(0, Math.ceil((endTimestamp - now) / (1000 * 60 * 60 * 24)));

  if (isExpired) {
    return {
      hasPremiumAccess: false,
      effectiveRole: 'FREE',
      isTrial: false,
      isCancelledButActive: false,
      isExpired: true,
      daysRemaining: 0
    };
  }

  // Active or Trial or Cancelled-with-remaining-time
  const isTrial = sub.status === 'trial';
  const isCancelledButActive = sub.status === 'cancelled' && !isExpired;

  if (sub.status === 'active' || isTrial || isCancelledButActive) {
    let role: UserRole = 'PREMIUM';
    if (sub.plan === 'family') role = 'FAMILY';
    if (sub.plan === 'organization') role = 'ORGANIZATION';

    return {
      hasPremiumAccess: true,
      effectiveRole: role,
      isTrial,
      isCancelledButActive,
      isExpired: false,
      daysRemaining
    };
  }

  // Past due or pending payment -> No premium until resolved
  return {
    hasPremiumAccess: false,
    effectiveRole: 'FREE',
    isTrial: false,
    isCancelledButActive: false,
    isExpired: sub.status === 'expired',
    daysRemaining: 0
  };
}

/**
 * Determines whether a specific lesson or unit requires premium subscription.
 * In Free Tier:
 * - World 1, Unit 1 is completely free so learners can try everything.
 * - Units 2, 3... and other worlds are Premium.
 */
export function isContentPremiumLocked(
  worldId: string,
  unitId: string,
  lessonIndex: number,
  db: AppDatabase
): boolean {
  const { hasPremiumAccess } = checkSubscriptionAccess(db);
  if (hasPremiumAccess) return false;

  // World 1 Unit 1 is 100% free trial experience!
  if (worldId === 'world_logic' && (unitId === 'unit_logic_basics' || lessonIndex <= 1)) {
    return false;
  }

  // Everything beyond that requires subscription
  return true;
}

/**
 * Helper to build initial Family Member profile from an existing UserProfile
 */
export function createFamilyMemberProfile(
  id: string,
  name: string,
  avatar: string,
  role: 'owner' | 'member' = 'member'
): FamilyMemberProfile {
  return {
    id,
    name,
    avatar,
    role,
    addedAt: new Date().toISOString(),
    level: 1,
    xp: 0,
    streak: 1,
    completedLessons: [],
    completedChallenges: [],
    attempts: [],
    achievements: [],
    practiceMistakes: []
  };
}

/**
 * Default sample Organization account for demonstration and school workflows
 */
export const defaultOrganizationSample: OrganizationAccount = {
  id: 'org_cairo_stem_academy',
  orgName: 'أكاديمية ستيم القاهرة للبرمجة',
  orgType: 'academy',
  contactPerson: 'د. طارق المنشاوي',
  email: 'admin@cairo-stem.edu.eg',
  phone: '01012345678',
  seatsTotal: 25,
  seatsUsed: 4,
  groups: [
    {
      id: 'grp_grade_1',
      name: 'فصل رواد بايثون - المجموعة أ',
      instructorName: 'أ. مروان الشامي',
      studentIds: ['std_1', 'std_2'],
      assignedWorldId: 'world_logic',
      createdAt: new Date().toISOString()
    },
    {
      id: 'grp_grade_2',
      name: 'فصل الخوارزميات المتقدمة - المجموعة ب',
      instructorName: 'م. ندى إبراهيم',
      studentIds: ['std_3', 'std_4'],
      assignedWorldId: 'world_loops',
      createdAt: new Date().toISOString()
    }
  ],
  students: [
    {
      id: 'std_1',
      name: 'يوسف أحمد',
      email: 'youssef@student.kemix.eg',
      groupId: 'grp_grade_1',
      level: 4,
      xp: 450,
      streak: 7,
      completedLessonsCount: 8,
      completionRatePercent: 80,
      strengths: ['المتغيرات', 'الشروط المنطقية'],
      weaknesses: ['المصفوفات المعقدة'],
      lastActiveDate: new Date().toISOString().split('T')[0]
    },
    {
      id: 'std_2',
      name: 'مريم محمود',
      email: 'mariam@student.kemix.eg',
      groupId: 'grp_grade_1',
      level: 5,
      xp: 620,
      streak: 12,
      completedLessonsCount: 11,
      completionRatePercent: 92,
      strengths: ['الشروط المنطقية', 'طباعة المخرجات'],
      weaknesses: [],
      lastActiveDate: new Date().toISOString().split('T')[0]
    },
    {
      id: 'std_3',
      name: 'عمر خالد',
      email: 'omar@student.kemix.eg',
      groupId: 'grp_grade_2',
      level: 3,
      xp: 320,
      streak: 4,
      completedLessonsCount: 6,
      completionRatePercent: 65,
      strengths: ['حلقات التكرار While'],
      weaknesses: ['الحلقات المتداخلة'],
      lastActiveDate: new Date().toISOString().split('T')[0]
    },
    {
      id: 'std_4',
      name: 'سارة مصطفى',
      email: 'sara@student.kemix.eg',
      groupId: 'grp_grade_2',
      level: 6,
      xp: 880,
      streak: 15,
      completedLessonsCount: 14,
      completionRatePercent: 98,
      strengths: ['تتبع الأخطاء', 'حلقات For', 'الدوال'],
      weaknesses: [],
      lastActiveDate: new Date().toISOString().split('T')[0]
    }
  ]
};
