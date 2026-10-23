import React from 'react';
import { useGame } from '../context/GameContext';
import { Dumbbell, Heart, Sparkles, RotateCcw, Play, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import HorusMascot from '../components/HorusMascot';

export const PracticeScreen: React.FC = () => {
  const { db, refillHearts, startLesson } = useGame();
  const { practiceMistakes, completedLessons } = db;

  const worlds = db.curriculum.worlds;
  const allLessons = worlds.flatMap(w => w.units.flatMap(u => u.lessons));
  const reviewLesson = allLessons.find(l => completedLessons.includes(l.id)) || allLessons[0];
  const unitForLesson = worlds.flatMap(w => w.units).find(u => u.lessons.some(l => l.id === reviewLesson?.id)) || worlds[0]?.units[0];

  // Specific concepts breakdown matching Screen 8 of reference board
  const mistakeConcepts = [
    { title: 'المتغيرات وأنواع البيانات', count: 2, icon: '📦', color: '#00e5ff' },
    { title: 'الشروط المنطقية if/else', count: 2, icon: '⚡', color: '#fbbf24' },
    { title: 'الحلقات والتكرار Loops', count: 1, icon: '🔄', color: '#a855f7' }
  ];

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
      {/* Screen 8: Review Mistakes (شاشة المراجعة) matching reference board */}
      <div 
        className="game-card animate-pop"
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          backgroundColor: 'rgba(11, 20, 44, 0.95)',
          border: '1.5px solid rgba(0, 229, 255, 0.35)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 229, 255, 0.2)',
          marginBottom: '24px',
          position: 'relative'
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(0, 229, 255, 0.12)',
          color: '#00e5ff',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 800,
          marginBottom: '14px'
        }}>
          <RotateCcw size={14} />
          <span>8. شاشة المراجعة</span>
        </div>

        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 900,
          color: 'var(--text-main)',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #ffffff, #00e5ff, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          مراجعة الأخطاء
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px' }}>
          المفاهيم التي تحتاج إلى مراجعة وتثبيت قبل التقدم للمراحل القادمة
        </p>

        {/* Horus Mascot in Center matching Screen 8 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <HorusMascot size="lg" mood="encouraging" speechText="كل خطأ هو خطوة نحو الاحتراف! لنراجع سوياً ونثبّت المعلومة." />
          </div>
        </div>

        {/* Mistakes Concepts Cards Grid matching Screen 8 */}
        <div style={{ maxWidth: '480px', margin: '0 auto 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mistakeConcepts.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {item.title}
                </span>
              </div>

              <span style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 800,
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {item.count} أخطاء
              </span>
            </div>
          ))}
        </div>

        {/* Start Review CTA Button (Screen 8: بدء المراجعة) */}
        {reviewLesson && unitForLesson && (
          <button
            onClick={() => {
              refillHearts();
              startLesson(reviewLesson.id, unitForLesson.id);
            }}
            className="btn-primary animate-pulse-gold"
            style={{
              padding: '16px 48px',
              fontSize: '1.15rem',
              fontWeight: 900,
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Play size={20} fill="currentColor" />
            <span>بدء المراجعة 🚀</span>
          </button>
        )}
      </div>

      {/* Heart Recovery Hero Banner */}
      <div 
        className="game-card"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(11, 20, 44, 0.95))',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Heart size={24} color="#ef4444" fill="#ef4444" className="animate-heart" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              استعادة القلوب الفورية (Free Heart Refill)
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '480px' }}>
            أكمل جلسة المراجعة بنجاح لاستعادة كافة قلوبك الخمسة فورا ومواصلة التقدم في عوالم كيميكس!
          </p>
        </div>

        {reviewLesson && unitForLesson && (
          <button
            onClick={() => {
              refillHearts();
              startLesson(reviewLesson.id, unitForLesson.id);
            }}
            className="btn-kemix-cyan"
            style={{ padding: '12px 22px', fontSize: '0.95rem', borderRadius: '12px' }}
          >
            استعادة القلوب الآن
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeScreen;
