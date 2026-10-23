import { ShopItem } from '../types';

export const initialShopItems: ShopItem[] = [
  // Streak Freeze
  {
    id: 'streak_freeze',
    titleAr: 'تجميد الشعلة (Streak Freeze)',
    descriptionAr: 'يحمي شعلة التزامك اليومية من الضياع إذا فاتك يوم دون تدريب.',
    category: 'freeze',
    price: 40,
    icon: '🧊'
  },
  // Instant Heart Refill
  {
    id: 'instant_hearts',
    titleAr: 'تعبئة القلوب الفورية (Heart Refill)',
    descriptionAr: 'استعد طاقة القلوب الخمسة فوراً لمواصلة التحديات دون انتظار.',
    category: 'hearts',
    price: 30,
    icon: '❤️'
  },
  // Mascot Skins
  {
    id: 'avatar_cyber_falcon',
    titleAr: 'صقر السايبر المتوهج ⚡',
    descriptionAr: 'مظهر سيبراني متقدم للصقر حورس بأجنحة من ضوء النيون.',
    category: 'avatar',
    price: 60,
    icon: '🦅'
  },
  {
    id: 'avatar_pharaoh_falcon',
    titleAr: 'صقر الفراعنة الذهبي 👑',
    descriptionAr: 'المظهر الفرعوني الأصيل مع تاج الشمس الذهبي.',
    category: 'avatar',
    price: 80,
    icon: '⚜️'
  },
  {
    id: 'avatar_robot_dev',
    titleAr: 'روبوت البرمجة الذكي 🤖',
    descriptionAr: 'مظهر تقني ممتع لعشاق الأتمتة والروبوتات البرمجية.',
    category: 'avatar',
    price: 50,
    icon: '🤖'
  },
  // Profile Frames
  {
    id: 'frame_neon_cyan',
    titleAr: 'إطار النيون السيبراني',
    descriptionAr: 'إطار متوهج باللون التركوازي يعكس براعتك التقنية.',
    category: 'frame',
    price: 45,
    icon: '💠'
  },
  {
    id: 'frame_solar_gold',
    titleAr: 'إطار قرص الشمس الذهبي',
    descriptionAr: 'إطار ملكي مرصع بهالة شمسية ذهبية لامعة.',
    category: 'frame',
    price: 70,
    icon: '🔆'
  },
  {
    id: 'frame_blazing_fire',
    titleAr: 'إطار شعلة المبرمجين',
    descriptionAr: 'إطار ناري متوهج يبرز روح الحماس والتحدي لديك.',
    category: 'frame',
    price: 55,
    icon: '🔥'
  }
];
