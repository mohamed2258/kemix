import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Crown, CheckCircle2, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import HorusMascot from './HorusMascot';

export const PaywallModal: React.FC = () => {
  const { showPaywallModal, setShowPaywallModal, paywallTriggerReason, navigateTo } = useGame();

  if (!showPaywallModal) return null;

  const handleOpenSubscription = () => {
    setShowPaywallModal(false);
    navigateTo('subscription');
  };

  const perks = [
    'الوصول الكامل لكافة العوالم والمراحل البرمجية المتقدمة',
    'تمارين تفاعلية غير محدودة وتصحيح فوري بالأكواد',
    'بنك المراجعة الذكي لتقوية نقاط الضعف',
    'المصطلحات الإنجليزية المدمجة والنطق الصوتي',
    'مزامنة سحابية مستمرة وإمكانية التعلّم دون إنترنت (Offline)'
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 13, 30, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setShowPaywallModal(false)}
    >
      <div 
        className="game-card animate-scale-up"
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#0b1329',
          border: '2px solid rgba(0, 229, 255, 0.4)',
          boxShadow: '0 16px 48px rgba(0, 229, 255, 0.25), 0 0 24px rgba(251, 191, 36, 0.2)',
          padding: '28px 24px',
          position: 'relative',
          borderRadius: '24px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowPaywallModal(false)}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-dim)',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Mascot & Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <HorusMascot mood="happy" size="lg" />
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-6px',
              backgroundColor: '#fbbf24',
              borderRadius: '50%',
              padding: '6px',
              boxShadow: '0 2px 10px rgba(251, 191, 36, 0.6)'
            }}>
              <Crown size={20} color="#070d1e" />
            </div>
          </div>

          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            marginTop: '12px',
            marginBottom: '6px',
            background: 'linear-gradient(135deg, #00e5ff, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            افتح تجربة KEMIX الكاملة 💎
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5' }}>
            {paywallTriggerReason || 'طوّر مهاراتك البرمجية خطوة بخطوة واحصل على مسار التعلم التفاعلي الكامل.'}
          </p>
        </div>

        {/* Perks list */}
        <div style={{
          backgroundColor: 'rgba(0, 229, 255, 0.05)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '22px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {perks.map((perk, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#00e5ff" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {perk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Free Trial Callout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '12px',
          backgroundColor: 'rgba(251, 191, 36, 0.12)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          marginBottom: '20px'
        }}>
          <Sparkles size={16} color="#fbbf24" />
          <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 800 }}>
            تجربة مجانية لمدة 7 أيام • يمكنك الإلغاء في أي وقت
          </span>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleOpenSubscription}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.05rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              borderRadius: '14px'
            }}
          >
            <Crown size={20} />
            <span>عرض خطط الاشتراك وبدء التجربة المجانية</span>
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={() => setShowPaywallModal(false)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            المتابعة بالمستوى المجاني
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
