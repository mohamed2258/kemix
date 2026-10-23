import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  Play, 
  ArrowLeft, 
  Target, 
  CheckCircle2, 
  Gift, 
  Dumbbell, 
  Code2, 
  Sparkles, 
  Lock, 
  Compass, 
  Flame, 
  Star, 
  Award,
  ChevronLeft
} from 'lucide-react';
import HorusMascot from '../components/HorusMascot';

export const HomeScreen: React.FC = () => {
  const { db, navigateTo, startLesson, claimQuest, selectedWorldId, selectWorld, isWorldUnlocked } = useGame();
  const { profile, completedLessons, dailyQuests, practiceMistakes } = db;

  const worlds = db.curriculum.worlds;
  const currentWorld = worlds.find(w => w.id === selectedWorldId) || worlds[0];

  // Calculate overall pathway completion percent
  const allLessons = worlds.flatMap(w => w.units.flatMap(u => u.lessons));
  const totalCompleted = allLessons.filter(l => completedLessons.includes(l.id)).length;
  const overallPercent = allLessons.length > 0 ? Math.round((totalCompleted / allLessons.length) * 100) : 0;

  // Find next unfinished lesson in active world
  let nextLesson = currentWorld.units[0]?.lessons[0];
  let nextUnit = currentWorld.units[0];

  for (const unit of currentWorld.units) {
    for (const lesson of unit.lessons) {
      if (!completedLessons.includes(lesson.id)) {
        nextLesson = lesson;
        nextUnit = unit;
        break;
      }
    }
    if (nextLesson && !completedLessons.includes(nextLesson.id)) break;
  }

  const dailyProgress = Math.min(profile.dailyGoalXP, profile.xp % profile.dailyGoalXP);
  const dailyGoalPercent = Math.min(100, Math.round((dailyProgress / profile.dailyGoalXP) * 100));

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Screen 2: Learning Map Hero Section (خريطة التعلم والمراحل) */}
      <div 
        className="game-card game-card-island animate-pop"
        style={{
          padding: '28px',
          marginBottom: '26px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header & World Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 229, 255, 0.15)',
              color: '#00e5ff',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '8px'
            }}>
              <Compass size={14} />
              <span>الصفحة الرئيسية (خريطة التعلم)</span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>
              {currentWorld.titleAr}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              {currentWorld.descriptionAr}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {nextLesson && nextUnit && (
              <button
                onClick={() => startLesson(nextLesson.id, nextUnit.id)}
                className="btn-primary animate-pulse-gold"
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Play size={18} fill="currentColor" />
                <span>متابعة الدرس</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('learn')}
              className="btn-outline"
              style={{
                padding: '12px 18px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>كل الوحدات</span>
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* Reference Board Islands Node Map */}
        <div style={{
          position: 'relative',
          padding: '24px 10px',
          margin: '16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Cyber Connecting Pathway Line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '3px',
            background: 'linear-gradient(90deg, #00e5ff, rgba(0, 229, 255, 0.2), #fbbf24)',
            zIndex: 1,
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.4)'
          }} className="hidden-mobile" />

          {worlds.map((w, index) => {
            const isUnlocked = isWorldUnlocked(w);
            const isCurrent = w.id === currentWorld.id;
            const completedCount = w.units.flatMap(u => u.lessons).filter(l => completedLessons.includes(l.id)).length;
            const totalCount = w.units.flatMap(u => u.lessons).length;

            return (
              <div
                key={w.id}
                onClick={() => {
                  if (isUnlocked) selectWorld(w.id);
                }}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.6,
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={e => {
                  if (isUnlocked) e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={e => {
                  if (isUnlocked) e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Floating Island Badge */}
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '24px',
                  background: isCurrent 
                    ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.35), rgba(11, 20, 44, 0.95))'
                    : (isUnlocked ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(11, 20, 44, 0.95))' : 'rgba(11, 20, 44, 0.8)'),
                  border: isCurrent 
                    ? '3px solid #00e5ff' 
                    : (isUnlocked ? '2px solid rgba(251, 191, 36, 0.4)' : '1px solid var(--border-color)'),
                  boxShadow: isCurrent ? '0 0 24px rgba(0, 229, 255, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  position: 'relative'
                }}>
                  {w.icon}

                  {!isUnlocked && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(7, 13, 30, 0.75)',
                      borderRadius: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lock size={26} color="var(--text-dim)" />
                    </div>
                  )}

                  {isCurrent && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-8px',
                      backgroundColor: '#00e5ff',
                      color: '#070d1e',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0, 229, 255, 0.6)'
                    }}>
                      الحالي
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isCurrent ? '#00e5ff' : 'var(--text-main)' }}>
                    {w.titleAr}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {completedCount}/{totalCount} دروس
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pathway Progress Bar (Screen 2: التقدم في المسار %35) */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          borderRadius: '16px',
          padding: '14px 20px',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '8px'
        }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#00e5ff', whiteSpace: 'nowrap' }}>
            التقدم في المسار %{overallPercent}
          </span>
          <div style={{
            flex: 1,
            height: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${overallPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00e5ff, #38bdf8)',
              borderRadius: '6px',
              boxShadow: '0 0 10px #00e5ff',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
            {totalCompleted} من {allLessons.length} مكتمل
          </span>
        </div>
      </div>

      {/* Daily Quests & Practice Shortcuts (Matching Screen 8 & 9) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Daily Quests Card (Screen 9: مهامك اليومية) */}
        <div className="game-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                مهامك اليومية
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              تتجدد كل 24 ساعة
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dailyQuests.map(quest => (
              <div
                key={quest.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {quest.completed ? (
                      <CheckCircle2 size={16} color="#10b981" />
                    ) : (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-dim)' }} />
                    )}
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {quest.titleAr}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '24px' }}>
                    {quest.descriptionAr}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24' }}>
                    +{quest.xpReward} XP
                  </span>
                  {quest.completed && !quest.claimed && (
                    <button
                      onClick={() => claimQuest(quest.id)}
                      className="btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      استلام
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice & Mistakes Bank Shortcut (Screen 8: مراجعة الأخطاء) */}
        <div className="game-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Dumbbell size={20} color="#00e5ff" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                بنك المراجعة وتقوية المفاهيم
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '16px' }}>
              راجع الأسئلة والتحديات التي واجهت فيها صعوبة لتعزيز استيعابك للمتغيرات، الحلقات، والشروط المنطقية.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(249, 115, 22, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              marginBottom: '16px'
            }}>
              <Flame size={24} color="#f97316" className="animate-flame" />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  سلسلة الأيام: {profile.streak} أيام متواصلة 🔥
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                  حافظ على شعلة الحماس نشطة يومياً لمضاعفة نقاط الـ XP!
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('practice')}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: 800,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>بدء جولة المراجعة التفاعلية</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
