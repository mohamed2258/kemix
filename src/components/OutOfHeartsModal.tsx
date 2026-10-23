import React from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Dumbbell, Coins, Clock, X } from 'lucide-react';
import HorusMascot from './HorusMascot';

export const OutOfHeartsModal: React.FC = () => {
  const { 
    showOutOfHeartsModal, 
    setShowOutOfHeartsModal, 
    db, 
    buyHeartsWithCoins, 
    refillHearts, 
    navigateTo 
  } = useGame();

  if (!showOutOfHeartsModal) return null;

  const canAffordCoins = db.profile.coins >= 30;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 7, 18, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 100
    }}>
      <div 
        className="game-card animate-pop"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '28px 24px',
          textAlign: 'center',
          position: 'relative',
          border: '1px solid rgba(239, 68, 68, 0.4)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowOutOfHeartsModal(false)}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Horus Encouraging Mascot */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <HorusMascot 
            mood="encouraging" 
            size="md" 
            speechText="استرح قليلاً يا بطل! الأخطاء هي مجرد إشارات تدلنا على الطريق الصحيح للحل." 
          />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px', color: 'var(--text-main)' }}>
          نفدت طاقة القلوب لديك مؤقتاً
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
          اختر الطريقة التي تفضلها لاستعادة طاقتك ومواصلة التحدي في كيميكس:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Practice */}
          <button
            onClick={() => {
              setShowOutOfHeartsModal(false);
              refillHearts();
              navigateTo('practice');
            }}
            className="btn-game btn-kemix-cyan"
            style={{ width: '100%', padding: '14px' }}
          >
            <Dumbbell size={18} />
            <span>تدريب مجاني لاستعادة جميع القلوب فوراً</span>
          </button>

          {/* Buy with Coins */}
          <button
            onClick={() => {
              if (canAffordCoins) {
                buyHeartsWithCoins();
              }
            }}
            disabled={!canAffordCoins}
            className="btn-game btn-kemix-gold"
            style={{ width: '100%', padding: '14px' }}
          >
            <Coins size={18} />
            <span>تعبئة القلوب بـ 30 عملة (معك {db.profile.coins} 🪙)</span>
          </button>

          {/* Auto timer info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--text-dim)',
            fontSize: '0.82rem',
            marginTop: '6px'
          }}>
            <Clock size={15} />
            <span>تتجدد القلوب تلقائياً كل 10 دقائق (قلب إضافي)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutOfHeartsModal;
