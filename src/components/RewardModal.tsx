import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { Trophy, Star, Coins, Flame, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import HorusMascot from './HorusMascot';

export const RewardModal: React.FC = () => {
  const { showRewardModal, setShowRewardModal, lastLessonStats, exitLesson, db } = useGame();

  useEffect(() => {
    if (showRewardModal) {
      soundEngine.playVictory(db.profile.soundEnabled);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [showRewardModal, db.profile.soundEnabled]);

  if (!showRewardModal || !lastLessonStats) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 7, 18, 0.9)',
      backdropFilter: 'blur(12px)',
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
          maxWidth: '500px',
          padding: '32px 28px',
          textAlign: 'center',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)'
        }}
      >
        {/* Falcon Mascot Celebrating */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <HorusMascot
            mood="happy"
            size="md"
            speechText={lastLessonStats.isPerfect ? 'إنجاز أسطوري! درس مثالي بدون أخطاء! 🦅🏆' : 'عاش يا بطل! أتقنت تحديات اليوم بكفاءة! ⚡'}
          />
        </div>

        <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '6px' }}>
          {lastLessonStats.isPerfect ? '🎉 درس مثالي 100%!' : '🎉 اكتمل الدرس بنجاح!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          لقد صقلت مهاراتك الخوارزمية وتقدمت في عالم كيميكس!
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '26px'
        }}>
          {/* XP Card */}
          <div style={{
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Star size={24} color="#fbbf24" fill="#fbbf24" />
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fbbf24' }}>
              +{lastLessonStats.xp}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              نقاط XP
            </span>
          </div>

          {/* Coins Card */}
          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Coins size={24} color="#00e5ff" />
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00e5ff' }}>
              +{lastLessonStats.coins}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              عملات كيميكس
            </span>
          </div>

          {/* Combo Card */}
          <div style={{
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Flame size={24} color="#f97316" className="animate-flame" />
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f97316' }}>
              {lastLessonStats.combo > 0 ? `x${lastLessonStats.combo}` : '—'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              أعلى كومبو
            </span>
          </div>
        </div>

        {/* Action Buttons matching Reference Board Screen 7 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button
            onClick={() => {
              setShowRewardModal(false);
              exitLesson();
            }}
            className="btn-game btn-kemix-gold"
            style={{ flex: 1, padding: '16px', fontSize: '1.05rem', justifyContent: 'center' }}
          >
            <span>متابعة إلى الخريطة</span>
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
