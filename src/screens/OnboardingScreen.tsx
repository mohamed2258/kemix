import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import HorusMascot from '../components/HorusMascot';

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useGame();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('بناء مشاريع حقيقية');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'some' | 'intermediate'>('beginner');
  const [dailyGoalXP, setDailyGoalXP] = useState(30);

  const goals = [
    { id: 'projects', title: 'بناء مشاريع حقيقية', desc: 'صناعة برامج وألعاب وتطبيقات عملية' },
    { id: 'career', title: 'الانطلاق في مسار وظيفي تقني', desc: 'التحضير للعمل في شركات البرمجيات والمشاريع' },
    { id: 'university', title: 'دعم دراستي الجامعية أو المدرسية', desc: 'التفوق في مواد علوم الحاسب والبرمجة' },
    { id: 'fun', title: 'التحدي والمتعة وتنمية التفكير', desc: 'اكتساب مهارة التفكير الخوارزمي المنطقي' },
  ];

  const levels: { id: 'beginner' | 'some' | 'intermediate'; title: string; desc: string }[] = [
    { id: 'beginner', title: 'مبتدئ تماماً (من الصفر المطلق)', desc: 'لم أكتب أي سطر كود من قبل' },
    { id: 'some', title: 'لدي فكرة بسيطة وسابقة', desc: 'أعرف بعض المصطلحات والأوامر الأساسية' },
    { id: 'intermediate', title: 'مبرمج بلغة أخرى', desc: 'أريد تعلّم بايثون وبناء الحلول بسرعة' },
  ];

  const xpGoals = [
    { xp: 10, label: 'هادئ', time: '5 دقائق يومياً' },
    { xp: 20, label: 'منتظم', time: '10 دقائق يومياً' },
    { xp: 30, label: 'جاد (موصى به)', time: '15 دقيقة يومياً' },
    { xp: 50, label: 'مكثف', time: '25 دقيقة يومياً' },
  ];

  const handleFinish = () => {
    completeOnboarding(
      name.trim() || 'بطل كيميكس',
      selectedGoal,
      selectedLevel,
      dailyGoalXP
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 20%, #0d1e44 0%, var(--bg-main) 70%)'
    }}>
      <div 
        className="game-card animate-pop"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '36px 30px',
          border: '1px solid rgba(0, 229, 255, 0.35)'
        }}
      >
        {/* Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: i === step ? '28px' : '10px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === step ? '#00e5ff' : i < step ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>

        {/* Step 1: Welcome & Auth Portal matching Reference Board Screen 1 */}
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            {/* Cyber Portal Archway */}
            <div style={{
              position: 'relative',
              padding: '16px 0 10px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #00e5ff, #fbbf24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 32px rgba(0, 229, 255, 0.5)',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}>
                <img src="./kemix-logo.jpg" alt="KEMIX" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{
                display: 'inline-block',
                padding: '4px 16px',
                borderRadius: '20px',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                color: '#00e5ff',
                fontSize: '0.8rem',
                fontWeight: 800,
                marginBottom: '12px',
                letterSpacing: '1px'
              }}>
                ✦ بوابة الدخول والتعلم الذكي ✦
              </div>

              <h1 style={{
                fontSize: '2.1rem',
                fontWeight: 900,
                marginBottom: '6px',
                background: 'linear-gradient(135deg, #ffffff 30%, #fbbf24 70%, #00e5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}>
                KEMIX
              </h1>
              <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.96rem', marginBottom: '14px' }}>
                رحلتك الأسطورية في عالم البرمجة تبدأ من هنا
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px' }}>
              تعلّم لغة بايثون، والمفاهيم الخوارزمية، ومصطلحات اللغة الإنجليزية التقنية بأسلوب الألعاب التفاعلية بصحبة الصقر حورس!
            </p>

            <HorusMascot mood="happy" speechText="أهلاً بك يا بطل المستقبل! اختر كيف تحب أن نبدأ رحلتنا اليوم:" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setStep(2)}
                className="btn-game btn-kemix-gold"
                style={{ width: '100%', padding: '15px', fontSize: '1.05rem', justifyContent: 'center' }}
              >
                <span>إنشاء ملف بطل جديد (ابدأ فوراً) 🚀</span>
                <ArrowLeft size={20} />
              </button>

              <button
                onClick={() => setStep(4)}
                className="btn-game btn-kemix-cyan"
                style={{ width: '100%', padding: '13px', fontSize: '0.95rem', justifyContent: 'center' }}
              >
                <span>تسجيل سريع بالاسم فقط ⚡</span>
              </button>
            </div>

            <div style={{
              marginTop: '18px',
              fontSize: '0.78rem',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>🛡️ تقدمك محفوظ محلياً بالكامل على جهازك</span>
            </div>
          </div>
        )}

        {/* Step 2: Learning Goal */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', textAlign: 'center' }}>
              ما هو هدفك الأساسي من البرمجة؟
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', textAlign: 'center', marginBottom: '20px' }}>
              سنخصص وتيرة التدريب ومحتوى العوالم بما يناسب شغفك.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
              {goals.map(g => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGoal(g.title)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedGoal === g.title ? '2px solid #00e5ff' : '1px solid var(--border-color)',
                    backgroundColor: selectedGoal === g.title ? 'rgba(0, 229, 255, 0.12)' : 'var(--bg-main)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 800, color: selectedGoal === g.title ? '#00e5ff' : 'var(--text-main)', fontSize: '1rem' }}>
                    {g.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {g.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-game btn-outline" style={{ padding: '14px 20px' }}>
                <ArrowRight size={18} />
              </button>
              <button onClick={() => setStep(3)} className="btn-game btn-kemix-cyan" style={{ flex: 1, padding: '14px' }}>
                <span>التالي</span>
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Experience Level */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', textAlign: 'center' }}>
              ما مقدار معرفتك بالبرمجة؟
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', textAlign: 'center', marginBottom: '20px' }}>
              نرحب بك أياً كانت خبرتك، الصقر حورس سينطلق معك خطوة بخطوة!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '26px' }}>
              {levels.map(lvl => (
                <div
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedLevel === lvl.id ? '2px solid #10b981' : '1px solid var(--border-color)',
                    backgroundColor: selectedLevel === lvl.id ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: selectedLevel === lvl.id ? '#10b981' : 'var(--text-main)', fontSize: '1.02rem' }}>
                      {lvl.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {lvl.desc}
                    </div>
                  </div>
                  {selectedLevel === lvl.id && <CheckCircle2 size={22} color="#10b981" />}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} className="btn-game btn-outline" style={{ padding: '14px 20px' }}>
                <ArrowRight size={18} />
              </button>
              <button onClick={() => setStep(4)} className="btn-game btn-kemix-cyan" style={{ flex: 1, padding: '14px' }}>
                <span>التالي</span>
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Name and Daily XP Goal */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', textAlign: 'center' }}>
              اسمك في كيميكس وهدفك اليومي
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', textAlign: 'center', marginBottom: '20px' }}>
              الاستمرار اليومي ولو لـ 5 دقائق هو سر الإتقان.
            </p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700 }}>
                اسم اللاعب في اللعبة:
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="مثلاً: محمد، نور، سارة..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-arabic)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '26px' }}>
              {xpGoals.map(item => (
                <div
                  key={item.xp}
                  onClick={() => setDailyGoalXP(item.xp)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: dailyGoalXP === item.xp ? '2px solid #fbbf24' : '1px solid var(--border-color)',
                    backgroundColor: dailyGoalXP === item.xp ? 'rgba(251, 191, 36, 0.15)' : 'var(--bg-main)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.15rem' }}>
                    {item.xp} XP
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {item.time}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(3)} className="btn-game btn-outline" style={{ padding: '14px 20px' }}>
                <ArrowRight size={18} />
              </button>
              <button onClick={handleFinish} className="btn-game btn-kemix-gold" style={{ flex: 1, padding: '14px', fontSize: '1.1rem' }}>
                <span>انطلق في عالم كيميكس! 🦅</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
