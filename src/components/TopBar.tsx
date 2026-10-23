import React, { useState } from 'react';
import { useGame, calculateLevelProgress } from '../context/GameContext';
import { Flame, Star, Heart, Coins, Settings, Wifi, WifiOff, Crown, Sparkles } from 'lucide-react';
import SettingsModal from './SettingsModal';

export const TopBar: React.FC = () => {
  const { db, setShowOutOfHeartsModal, triggerSync, navigateTo, subscriptionAccess } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const { profile, syncStatus, subscription } = db;
  const levelProg = calculateLevelProgress(profile.xp);

  const getSubLabel = () => {
    if (!subscriptionAccess.hasPremiumAccess) return { text: 'ترقية 💎', isFree: true };
    if (subscriptionAccess.isTrial) return { text: `تجربة ${subscriptionAccess.daysRemaining}ي ⚡`, isFree: false };
    if (subscription?.plan === 'family') return { text: 'عائلي 👨‍👩‍👧', isFree: false };
    if (subscription?.plan === 'organization') return { text: 'مؤسسة 🏛️', isFree: false };
    return { text: 'بريميوم 👑', isFree: false };
  };

  const subLabel = getSubLabel();

  return (
    <>
      {/* Topmost Reference Hero Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(6, 11, 27, 0.98), rgba(11, 20, 44, 0.95), rgba(6, 11, 27, 0.98))',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        padding: '6px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '0.8rem'
      }}>
        {/* Quote & Brand Slogan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🦅</span>
          <span style={{ fontWeight: 800, color: '#00e5ff', letterSpacing: '0.5px' }}>
            رحلتك في عالم البرمجة تبدأ من هنا
          </span>
          <span style={{ color: 'var(--text-dim)', margin: '0 4px' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>
            تعلم — تحدى — احصل على المكافآت — واصنع مستقبلك
          </span>
        </div>

        {/* Category Pills matching top right of reference board */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }} className="hidden-mobile">
          {[
            { id: 'learn', label: 'تعلم البرمجة', icon: '</>', color: '#00e5ff' },
            { id: 'practice', label: 'طور لغتك الإنجليزية', icon: '文A', color: '#38bdf8' },
            { id: 'shop', label: 'اكسب المكافآت', icon: '🎮', color: '#fbbf24' },
            { id: 'leaderboard', label: 'تقدم في المستويات', icon: '📊', color: '#10b981' },
            { id: 'profile', label: 'حقق أهدافك', icon: '🎯', color: '#f97316' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => navigateTo(cat.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = cat.color;
                e.currentTarget.style.color = cat.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <span style={{ color: cat.color, fontWeight: 900 }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Brand & Mascot Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00e5ff, #fbbf24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 229, 255, 0.4)',
            overflow: 'hidden'
          }}>
            <img 
              src="./kemix-logo.jpg" 
              alt="KEMIX" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontWeight: 900,
                fontSize: '1.15rem',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #fbbf24, #00e5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                KEMIX
              </span>
              <span style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                color: '#00e5ff',
                padding: '2px 8px',
                borderRadius: '14px',
                fontWeight: 800,
                border: '1px solid rgba(0, 229, 255, 0.3)'
              }}>
                المستوى {profile.level}
              </span>
            </div>

            {/* Level Mini Bar */}
            <div style={{
              width: '110px',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${levelProg.percent}%`,
                height: '100%',
                backgroundColor: '#00e5ff',
                borderRadius: '4px',
                boxShadow: '0 0 6px #00e5ff',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Game Stats Counters & Hybrid Sync Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Hybrid Offline/Online Sync status */}
          <div
            onClick={triggerSync}
            title={syncStatus === 'offline' ? 'يعمل دون إنترنت - البيانات محفوظة محلياً' : 'تمت المزامنة بنجاح'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              fontSize: '0.75rem',
              color: '#00e5ff',
              cursor: 'pointer'
            }}
          >
            <Wifi size={13} color="#00e5ff" />
            <span style={{ fontWeight: 700 }}>
              {syncStatus === 'syncing' ? 'مزامنة...' : 'محلي / متزامن'}
            </span>
          </div>

          {/* Subscription / Upgrade Pill */}
          <button
            onClick={() => navigateTo(subLabel.isFree ? 'subscription' : 'profile')}
            title={subLabel.isFree ? 'انقر للاشتراك أو بدء التجربة المجانية 7 أيام' : 'إدارة الاشتراك والباقة'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-md)',
              background: subLabel.isFree 
                ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(0, 229, 255, 0.2))'
                : 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(16, 185, 129, 0.2))',
              border: subLabel.isFree ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(0, 229, 255, 0.4)',
              cursor: 'pointer',
              color: subLabel.isFree ? '#fbbf24' : '#00e5ff',
              fontWeight: 800,
              fontSize: '0.8rem',
              boxShadow: subLabel.isFree ? '0 0 10px rgba(251, 191, 36, 0.25)' : 'none'
            }}
          >
            <Crown size={14} color={subLabel.isFree ? '#fbbf24' : '#00e5ff'} />
            <span>{subLabel.text}</span>
          </button>

          {/* Streak */}
          <div 
            title={`شعلة الحماس: ${profile.streak} يوم`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249, 115, 22, 0.3)'
            }}
          >
            <Flame className="animate-flame" size={18} color="#f97316" />
            <span style={{ fontWeight: 800, color: '#f97316', fontSize: '0.95rem' }}>
              {profile.streak}
            </span>
          </div>

          {/* XP */}
          <div 
            title={`نقاط الخبرة XP: ${profile.xp}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}
          >
            <Star size={18} color="#fbbf24" fill="#fbbf24" />
            <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.95rem' }}>
              {profile.xp.toLocaleString('ar-EG')}
            </span>
          </div>

          {/* Coins */}
          <button 
            onClick={() => navigateTo('shop')}
            title={`عملات كيميكس: ${profile.coins} — انقر لفتح المتجر والمكافآت`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'transform 0.15s ease'
            }}
          >
            <Coins size={18} color="#eab308" />
            <span style={{ fontWeight: 800, color: '#eab308', fontSize: '0.95rem' }}>
              {profile.coins}
            </span>
          </button>

          {/* Hearts */}
          <button
            onClick={() => setShowOutOfHeartsModal(true)}
            title="القلوب المتبقية - انقر للتعبئة"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: profile.hearts > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.3)',
              border: `1px solid ${profile.hearts > 0 ? 'rgba(239, 68, 68, 0.3)' : '#ef4444'}`,
              cursor: 'pointer',
              outline: 'none',
              transition: 'transform 0.15s ease'
            }}
          >
            <Heart 
              className={profile.hearts <= 1 ? 'animate-heart' : ''} 
              size={18} 
              color="#ef4444" 
              fill={profile.hearts > 0 ? '#ef4444' : 'none'} 
            />
            <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.95rem' }}>
              {profile.hearts}/{profile.maxHearts}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            title="الإعدادات والتخصيص"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default TopBar;
