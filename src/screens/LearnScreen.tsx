import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { World, Unit, Lesson, SkillStatus } from '../types';
import { Lock, Check, Crown, Play, Swords, Sparkles, BookOpen, Star, X, ArrowLeft, RotateCcw, Award } from 'lucide-react';
import HorusMascot from '../components/HorusMascot';

export const LearnScreen: React.FC = () => {
  const { db, selectedWorldId, selectWorld, isWorldUnlocked, startLesson } = useGame();
  const [activeLessonModal, setActiveLessonModal] = useState<{
    lesson: Lesson;
    unit: Unit;
    status: SkillStatus;
  } | null>(null);

  const worlds = db.curriculum.worlds;
  const currentWorld = worlds.find(w => w.id === selectedWorldId) || worlds[0];

  // Calculate overall world completion
  const allLessonsInWorld = currentWorld.units.flatMap(u => u.lessons);
  const completedInWorld = allLessonsInWorld.filter(l => db.completedLessons.includes(l.id)).length;
  const worldProgressPercent = allLessonsInWorld.length > 0 
    ? Math.round((completedInWorld / allLessonsInWorld.length) * 100) 
    : 0;

  const getDifficultyLabel = (diff?: string) => {
    switch (diff) {
      case 'introductory': return { text: 'المستوى التمهيدي', color: '#38bdf8' };
      case 'basic': return { text: 'المستوى الأساسي', color: '#4ade80' };
      case 'intermediate': return { text: 'المستوى المتوسط', color: '#fbbf24' };
      case 'advanced': return { text: 'المستوى المتقدم', color: '#f97316' };
      case 'mastery': return { text: 'مستوى الإتقان', color: '#ec4899' };
      case 'exam': return { text: 'اختبار تقييمي', color: '#a855f7' };
      default: return { text: 'درس تفاعلي', color: '#00e5ff' };
    }
  };

  const computeLessonStatus = (lesson: Lesson, unit: Unit, index: number): SkillStatus => {
    if (db.completedLessons.includes(lesson.id)) {
      return 'completed';
    }
    // Previous lesson in the unit must be completed to unlock next (progressive unlock)
    if (index === 0) {
      return 'available';
    }
    const prevLesson = unit.lessons[index - 1];
    if (db.completedLessons.includes(prevLesson.id)) {
      return 'available';
    }
    return 'locked';
  };

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
      {/* Worlds Horizontal Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            عوالم ومسارات كيميكس التعليمية ({worlds.length} عوالم)
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#00e5ff', fontWeight: 700 }}>
            المستوى الحالي: {db.profile.level}
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin'
        }}>
          {worlds.map((world) => {
            const unlocked = isWorldUnlocked(world);
            const isSelected = world.id === currentWorld.id;

            return (
              <div
                key={world.id}
                onClick={() => {
                  if (unlocked) selectWorld(world.id);
                }}
                style={{
                  minWidth: '180px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'var(--bg-card)',
                  border: isSelected ? '2px solid #00e5ff' : '1px solid var(--border-color)',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  opacity: unlocked ? 1 : 0.55,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <div style={{
                  fontSize: '1.6rem',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  {unlocked ? world.icon : <Lock size={18} color="var(--text-dim)" />}
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#00e5ff' : 'var(--text-main)' }}>
                    {world.titleAr}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {unlocked ? world.titleEn : `يفتح بمستوى ${world.requiredLevelToUnlock}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* World Hero Banner with Progress */}
      <div 
        className="game-card"
        style={{
          padding: '24px',
          background: `linear-gradient(135deg, rgba(0, 229, 255, 0.18), rgba(11, 19, 41, 0.95))`,
          border: '1px solid rgba(0, 229, 255, 0.35)',
          marginBottom: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#00e5ff',
              color: '#070d1e',
              padding: '3px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '8px'
            }}>
              {currentWorld.titleEn}
            </span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '6px' }}>
              {currentWorld.icon} {currentWorld.titleAr}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', maxWidth: '520px', marginBottom: '16px' }}>
              {currentWorld.descriptionAr}
            </p>

            {/* World Progress Bar */}
            <div style={{ maxWidth: '380px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                <span>إنجاز مسار العالم:</span>
                <span style={{ color: '#00e5ff', fontWeight: 700 }}>{completedInWorld} من {allLessonsInWorld.length} دروس ({worldProgressPercent}%)</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${worldProgressPercent}%`,
                  height: '100%',
                  backgroundColor: '#00e5ff',
                  boxShadow: '0 0 10px rgba(0, 229, 255, 0.6)',
                  borderRadius: '6px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>

          <HorusMascot size="sm" mood="idle" speechText="اضغط على أي مرحلة لاستكشاف المفاهيم وبدء التعلّم!" />
        </div>
      </div>

      {/* Units & Gamified Learning Path Nodes */}
      {currentWorld.units.length === 0 ? (
        <div className="game-card" style={{ padding: '36px', textAlign: 'center' }}>
          <Sparkles size={40} color="#00e5ff" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            محتوى هذا العالم قيد التطوير
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 16px' }}>
            يمكنك إضافة وحدات ودروس وأسئلة لهذا العالم مباشرة وبكل سهولة من خلال لوحة إدارة المحتوى (Admin CMS) دون الحاجة لإعادة بناء التطبيق!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {currentWorld.units.map((unit) => {
            const completedCount = unit.lessons.filter(l => db.completedLessons.includes(l.id)).length;
            const unitPercent = Math.round((completedCount / unit.lessons.length) * 100);

            return (
              <div key={unit.id} className="game-card" style={{ padding: '24px' }}>
                {/* Unit Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '2px' }}>
                      {unit.titleAr}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      {unit.descriptionAr}
                    </p>
                  </div>

                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#00e5ff'
                  }}>
                    {completedCount}/{unit.lessons.length} مكتمل ({unitPercent}%)
                  </div>
                </div>

                {/* Duolingo-style Winding Connected Nodes */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '28px',
                  padding: '16px 0',
                  position: 'relative'
                }}>
                  {unit.lessons.map((lesson, idx) => {
                    const status = computeLessonStatus(lesson, unit, idx);
                    const isDone = status === 'completed';
                    const isAvail = status === 'available';
                    const isLocked = status === 'locked';

                    // Alternating zig-zag offset (0px, -45px, 0px, 45px)
                    const offsets = [0, -45, 0, 45];
                    const xOffset = offsets[idx % offsets.length];

                    const diffBadge = getDifficultyLabel(lesson.difficulty);

                    return (
                      <div
                        key={lesson.id}
                        style={{
                          transform: `translateX(${xOffset}px)`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          position: 'relative'
                        }}
                      >
                        {/* Node Circle */}
                        <button
                          onClick={() => {
                            if (!isLocked) {
                              setActiveLessonModal({ lesson, unit, status });
                            }
                          }}
                          title={isLocked ? 'أكمل الدروس السابقة أولاً لفتح هذه المرحلة' : lesson.titleAr}
                          style={{
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            border: isDone
                              ? '3px solid #10b981'
                              : isAvail
                              ? '3px solid #00e5ff'
                              : '3px solid var(--border-color)',
                            backgroundColor: isDone
                              ? 'rgba(16, 185, 129, 0.2)'
                              : isAvail
                              ? 'rgba(0, 229, 255, 0.2)'
                              : 'var(--bg-main)',
                            color: isDone ? '#10b981' : isAvail ? '#00e5ff' : 'var(--text-dim)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                            boxShadow: isAvail 
                              ? '0 0 20px rgba(0, 229, 255, 0.4), inset 0 0 10px rgba(0, 229, 255, 0.3)' 
                              : isDone
                              ? '0 0 14px rgba(16, 185, 129, 0.3)'
                              : 'none',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            position: 'relative'
                          }}
                          className={isAvail ? 'animate-float' : ''}
                        >
                          {isDone ? (
                            <Check size={28} strokeWidth={3} />
                          ) : isAvail ? (
                            <Play size={26} fill="currentColor" style={{ marginRight: '-2px' }} />
                          ) : (
                            <Lock size={22} />
                          )}

                          {/* Star Counter Pill */}
                          <div style={{
                            position: 'absolute',
                            bottom: '-6px',
                            backgroundColor: isDone ? '#10b981' : isAvail ? '#00e5ff' : '#475569',
                            color: '#070d1e',
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            padding: '1px 6px',
                            borderRadius: '10px'
                          }}>
                            {idx + 1}
                          </div>
                        </button>

                        {/* Node Label Underneath */}
                        <div style={{ textAlign: 'center', maxWidth: '140px' }}>
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            color: isAvail ? '#00e5ff' : isDone ? 'var(--text-main)' : 'var(--text-dim)'
                          }}>
                            {lesson.titleAr}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Unit Boss Challenge */}
                {unit.bossChallenge && (
                  <div style={{
                    marginTop: '28px',
                    padding: '18px 22px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.16), rgba(245, 158, 11, 0.18))',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(245, 158, 11, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
                      }}>
                        👑
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fbbf24' }}>
                          {unit.bossChallenge.titleAr}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          تحدي الزعيم الختامي: +{unit.bossChallenge.xpReward} XP و +{unit.bossChallenge.coinReward} 🪙 وفتح المرحلة التالية
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => startLesson(unit.bossChallenge!.id, unit.id, true)}
                      className="btn-game btn-kemix-gold"
                      style={{ padding: '12px 24px', fontSize: '1rem' }}
                    >
                      <Swords size={20} />
                      <span>خوض معركة الزعيم</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Lesson Node Popup Modal */}
      {activeLessonModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div 
            className="game-card animate-pop"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              position: 'relative',
              border: '2px solid #00e5ff',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.25)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLessonModal(null)}
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
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00e5ff'
              }}>
                <BookOpen size={24} />
              </div>

              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: getDifficultyLabel(activeLessonModal.lesson.difficulty).color,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {getDifficultyLabel(activeLessonModal.lesson.difficulty).text}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '2px' }}>
                  {activeLessonModal.lesson.titleAr}
                </h2>
              </div>
            </div>

            {/* Lesson Description & Concept */}
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
              {activeLessonModal.lesson.descriptionAr}
            </p>

            {/* Focus English Term if present */}
            {activeLessonModal.lesson.englishFocusTerm && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(0, 229, 255, 0.08)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px',
                fontSize: '0.88rem'
              }}>
                <span style={{ color: '#00e5ff', fontWeight: 800 }}>المصطلح التقني المستهدف:</span>
                <code style={{ color: '#fbbf24', direction: 'ltr' }}>{activeLessonModal.lesson.englishFocusTerm}</code>
              </div>
            )}

            {/* Stats Pills */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '22px'
            }}>
              <div style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>التمارين</div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', marginTop: '2px' }}>
                  {activeLessonModal.lesson.challenges.length} أسئلة
                </div>
              </div>

              <div style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>نقاط الخبرة</div>
                <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1rem', marginTop: '2px' }}>
                  +{activeLessonModal.lesson.xpReward} XP
                </div>
              </div>

              <div style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>العملات</div>
                <div style={{ fontWeight: 800, color: '#eab308', fontSize: '1rem', marginTop: '2px' }}>
                  +{activeLessonModal.lesson.coinReward} 🪙
                </div>
              </div>
            </div>

            {/* Launch Action Button */}
            <button
              onClick={() => {
                startLesson(activeLessonModal.lesson.id, activeLessonModal.unit.id);
                setActiveLessonModal(null);
              }}
              className="btn-game btn-kemix-cyan"
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
            >
              <Play size={18} fill="currentColor" />
              <span>{activeLessonModal.status === 'completed' ? 'إعادة مراجعة الدرس' : 'بدء التعلّم الآن 🚀'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnScreen;
