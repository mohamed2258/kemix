import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Crown, 
  Users, 
  Building2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  HelpCircle, 
  ArrowLeft, 
  ChevronDown, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Lock,
  MessageSquare
} from 'lucide-react';
import HorusMascot from '../components/HorusMascot';
import { calculateSavingsPercent } from '../services/subscriptionService';
import { SubscriptionPlanType, BillingCycle, PaymentMethodType } from '../types';

export const SubscriptionScreen: React.FC = () => {
  const { db, subscribe, navigateTo } = useGame();
  const config = db.subscriptionConfig;
  const currentSub = db.subscription;

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType | null>(null);

  // Checkout Payment Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlanType>('individual');
  const [checkoutCycle, setCheckoutCycle] = useState<BillingCycle>('annual');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Organization Inquiry Modal State
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [orgTierIndex, setOrgTierIndex] = useState(0);
  const [orgForm, setOrgForm] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [orgSuccessMessage, setOrgSuccessMessage] = useState<string | null>(null);

  // Programmatic Savings Calculations (dynamic from DB config)
  const indSavings = calculateSavingsPercent(config.individualMonthlyPrice, config.individualAnnualPrice);
  const famSavings = calculateSavingsPercent(config.familyMonthlyPrice, config.familyAnnualPrice);

  const handleStartCheckout = (plan: SubscriptionPlanType) => {
    setCheckoutPlan(plan);
    setCheckoutCycle(billingCycle);
    setPaymentError(null);
    setPaymentSuccess(null);
    setShowCheckoutModal(true);
  };

  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    const res = await subscribe(checkoutPlan, checkoutCycle, paymentMethod, true);

    setIsProcessingPayment(false);
    if (res.success) {
      setPaymentSuccess(res.message);
      setTimeout(() => {
        setShowCheckoutModal(false);
        navigateTo('learn');
      }, 1400);
    } else {
      setPaymentError(res.message);
    }
  };

  const handleOrgInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.orgName.trim() || !orgForm.contactName.trim()) return;

    setOrgSuccessMessage('تم استلام طلبكم بنجاح! سيتواصل معكم مستشار كيميكس التعليمي لتقديم أفضل عرض سعر وتفعيل لوحة المؤسسة.');
    setTimeout(() => {
      setShowOrgModal(false);
      setOrgSuccessMessage(null);
    }, 2200);
  };

  return (
    <div style={{ flex: 1, padding: '32px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Top Header & Mascot */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ position: 'relative' }}>
            <HorusMascot mood="happy" size="lg" />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 4px 14px rgba(251, 191, 36, 0.5)'
            }}>
              <Crown size={24} color="#070d1e" />
            </div>
          </div>
        </div>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 900,
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #ffffff, #00e5ff, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          اختر خطتك البرمجية
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 18px' }}>
          ابدأ رحلة تعلم البرمجة وطور مهاراتك خطوة بخطوة مع مسارات كيميكس التفاعلية المتطورة.
        </p>

        {/* 7-Day Free Trial Notice Banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 20px',
          borderRadius: '30px',
          backgroundColor: 'rgba(0, 229, 255, 0.12)',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          boxShadow: '0 4px 16px rgba(0, 229, 255, 0.15)'
        }}>
          <Sparkles size={18} color="#00e5ff" />
          <span style={{ fontSize: '0.92rem', color: '#00e5ff', fontWeight: 800 }}>
            تجربة مجانية لمدة 7 أيام متاحة الآن • يمكنك الإلغاء في أي وقت بنقرة واحدة
          </span>
        </div>
      </div>

      {/* Monthly / Annual Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
        <div style={{
          backgroundColor: 'rgba(11, 19, 41, 0.85)',
          padding: '6px',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '10px 24px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: billingCycle === 'monthly' ? '#00e5ff' : 'transparent',
              color: billingCycle === 'monthly' ? '#070d1e' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            شهري
          </button>

          <button
            onClick={() => setBillingCycle('annual')}
            style={{
              padding: '10px 24px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: billingCycle === 'annual' ? '#00e5ff' : 'transparent',
              color: billingCycle === 'annual' ? '#070d1e' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>سنوي</span>
            <span style={{
              backgroundColor: '#fbbf24',
              color: '#070d1e',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 900
            }}>
              وفر حتى 35% ⚡
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '24px',
        alignItems: 'stretch',
        marginBottom: '40px'
      }}>
        {/* 1. Individual Plan Card */}
        <div 
          className="game-card"
          style={{
            padding: '30px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            backgroundColor: 'rgba(11, 19, 41, 0.9)',
            position: 'relative'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00e5ff'
              }}>
                <Crown size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  الخطة الفردية
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Individual Plan</span>
              </div>
            </div>

            {/* Price Display */}
            <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {billingCycle === 'monthly' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#00e5ff' }}>
                      {config.individualMonthlyPrice.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>جنيه مصري / شهرياً</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    تجديد شهري تلقائي • يمكنك الإلغاء في أي وقت
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#00e5ff' }}>
                      {config.individualAnnualPrice.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>جنيه مصري / سنوياً</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span style={{
                      backgroundColor: 'rgba(251, 191, 36, 0.15)',
                      color: '#fbbf24',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}>
                      وفر حوالي {indSavings}% مقارنة بالدفع الشهري
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Features List */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '12px' }}>
                المميزات المتاحة:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {config.features.individual.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Check size={16} color="#00e5ff" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartCheckout('individual')}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 900,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>ابدأ تجربة 7 أيام مجانًا</span>
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 2. Family Plan Card (Preferred & Highlighted) */}
        <div 
          className="game-card"
          style={{
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid #fbbf24',
            backgroundColor: 'linear-gradient(180deg, rgba(251, 191, 36, 0.08), rgba(11, 19, 41, 0.95))',
            position: 'relative',
            boxShadow: '0 12px 36px rgba(251, 191, 36, 0.2), 0 0 20px rgba(0, 229, 255, 0.2)',
            transform: 'scale(1.02)'
          }}
        >
          {/* Top Badge */}
          <div style={{
            position: 'absolute',
            top: '-14px',
            right: '24px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#070d1e',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 900,
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Sparkles size={14} />
            <span>الأكثر توفيرًا وملاءمة للعائلة</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', marginTop: '4px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24'
              }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  الخطة العائلية
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>
                  Family Plan • حتى {config.familyMaxMembers} حسابات مستقلة
                </span>
              </div>
            </div>

            {/* Price Display */}
            <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {billingCycle === 'monthly' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fbbf24' }}>
                      {config.familyMonthlyPrice.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>جنيه مصري / شهرياً</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    شامل حتى 5 حسابات تعليمية مستقلة تماماً
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fbbf24' }}>
                      {config.familyAnnualPrice.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>جنيه مصري / سنوياً</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span style={{
                      backgroundColor: 'rgba(251, 191, 36, 0.25)',
                      color: '#fbbf24',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 900,
                      border: '1px solid rgba(251, 191, 36, 0.45)'
                    }}>
                      وفر أكثر مع الاشتراك السنوي ({famSavings}%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Features List */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fbbf24', marginBottom: '12px' }}>
                مميزات باقة العائلة:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {config.features.family.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} color="#fbbf24" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartCheckout('family')}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.05rem',
              fontWeight: 900,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#070d1e',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4)'
            }}
          >
            <span>ابدأ تجربة 7 أيام مجانًا للعائلة</span>
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 3. Organizations & Schools Plan Card */}
        <div 
          className="game-card"
          style={{
            padding: '30px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            backgroundColor: 'rgba(11, 19, 41, 0.9)',
            position: 'relative'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a855f7'
              }}>
                <Building2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  خطة المؤسسات والمدارس
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Schools & Organizations</span>
              </div>
            </div>

            {/* Price Display */}
            <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>يبدأ من</span>
                <span style={{ fontSize: '2.1rem', fontWeight: 900, color: '#a855f7' }}>
                  2,499
                </span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>جنيه مصري / سنوياً</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#c084fc', marginTop: '4px' }}>
                السعر مرن بحسب عدد الطلاب والمستخدمين (باقات 25، 50، 100+ طالب)
              </div>
            </div>

            {/* Features List */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#c084fc', marginBottom: '12px' }}>
                مميزات لوحة المؤسسات:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {config.features.organization.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Check size={16} color="#a855f7" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowOrgModal(true)}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 900,
              borderRadius: '14px',
              backgroundColor: 'rgba(168, 85, 247, 0.18)',
              color: '#d8b4fe',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <MessageSquare size={18} />
            <span>تواصل معنا للحصول على عرض سعر</span>
          </button>
        </div>
      </div>

      {/* Trial Terms & FAQs Accordion Callout */}
      <div className="game-card" style={{ padding: '24px', backgroundColor: 'rgba(11, 19, 41, 0.7)', borderRadius: '18px' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#00e5ff" />
          <span>شروط التجربة المجانية والاشتراك في كيميكس</span>
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <div>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>كيف تعمل التجربة المجانية (7 أيام)؟</strong>
            تحصل على وصول فوري وكامل لكافة مميزات الخطة المختارة دون أي خصم مالي خلال الـ 7 أيام الأولى. يمكنك إلغاء التجديد في أي وقت قبل انتهاء المدة دون أي رسوم.
          </div>
          <div>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>ماذا يحدث عند إلغاء الاشتراك؟</strong>
            لا تفقد وصولك فوراً، بل تستمر بالتمتع بكافة مميزات البريميوم حتى آخر يوم في الفترة المدفوعة، ولا يتم خصم أي تجديد مستقبلي.
          </div>
          <div>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>طرق الدفع المدعومة في مصر:</strong>
            ندعم كافة البطاقات البنكية المصرية (فيزا، ماستركارد، كروت ميزة الوطنية)، بالإضافة إلى فوري ومحافظ الهاتف المحمول (فودافون كاش، أورنج، اتصالات، إنستاباي).
          </div>
        </div>
      </div>

      {/* Checkout Modal (Decoupled Payment Gateway Integration) */}
      {showCheckoutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7, 13, 30, 0.88)',
          backdropFilter: 'blur(12px)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div 
            className="game-card animate-scale-up"
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#0b1329',
              border: '2px solid rgba(0, 229, 255, 0.4)',
              borderRadius: '24px',
              padding: '28px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={22} color="#00e5ff" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  إتمام الاشتراك • {checkoutPlan === 'family' ? 'الخطة العائلية' : 'الخطة الفردية'}
                </h3>
              </div>
              <button
                onClick={() => !isProcessingPayment && setShowCheckoutModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Plan Summary Box */}
            <div style={{
              backgroundColor: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>نوع الباقة:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                  {checkoutPlan === 'family' ? 'عائلي (حتى 5 حسابات)' : 'فردي'} ({checkoutCycle === 'annual' ? 'سنوي' : 'شهري'})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>المبلغ بعد انتهاء التجربة:</span>
                <span style={{ fontWeight: 900, color: '#00e5ff', fontSize: '1.1rem' }}>
                  {checkoutPlan === 'family' 
                    ? (checkoutCycle === 'annual' ? config.familyAnnualPrice : config.familyMonthlyPrice)
                    : (checkoutCycle === 'annual' ? config.individualAnnualPrice : config.individualMonthlyPrice)
                  } جنيه مصري
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>المستحق اليوم:</span>
                <span style={{ fontWeight: 900, color: '#fbbf24', fontSize: '1.05rem' }}>
                  0.00 ج.م (تجربة مجانية 7 أيام)
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                اختر وسيلة الدفع للتحقق والربط:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'credit_card', label: 'بطاقة بنكية (فيزا / ماستركارد / ميزة)', icon: <CreditCard size={18} /> },
                  { id: 'fawry', label: 'فوري (Fawry Pay)', icon: <Zap size={18} /> },
                  { id: 'vodafone_cash', label: 'فودافون كاش ومحافظ المحمول / InstaPay', icon: <Building2 size={18} /> }
                ].map(method => (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethodType)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: paymentMethod === method.id ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: paymentMethod === method.id ? '1px solid #00e5ff' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id as PaymentMethodType)}
                      style={{ accentColor: '#00e5ff' }}
                    />
                    <span style={{ color: paymentMethod === method.id ? '#00e5ff' : 'var(--text-dim)' }}>
                      {method.icon}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Guarantee */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
              <Lock size={15} color="#10b981" />
              <span>معاملات مشفرة وآمنة بالكامل ومتوافقة مع المعايير المصرفية.</span>
            </div>

            {paymentError && (
              <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.12)', padding: '10px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {paymentError}
              </div>
            )}

            {paymentSuccess && (
              <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '10px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {paymentSuccess}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleExecutePayment}
              disabled={isProcessingPayment}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: isProcessingPayment ? 0.7 : 1
              }}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري التحقق من بوابة الدفع وتأكيد الحساب...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>تأكيد وبدء التجربة المجانية 7 أيام</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Organization Inquiry & Quote Modal */}
      {showOrgModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7, 13, 30, 0.88)',
          backdropFilter: 'blur(12px)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div 
            className="game-card animate-scale-up"
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: '#0b1329',
              border: '2px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '24px',
              padding: '28px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={22} color="#a855f7" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  طلب انضمام مدرسة أو مؤسسة تعليمية
                </h3>
              </div>
              <button
                onClick={() => setShowOrgModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            {/* Tier Selector */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                اختر عدد الطلاب المقدر للمؤسسة:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {config.organizationTiers.map((tier, idx) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setOrgTierIndex(idx)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: orgTierIndex === idx ? '2px solid #a855f7' : '1px solid var(--border-color)',
                      backgroundColor: orgTierIndex === idx ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: orgTierIndex === idx ? '#c084fc' : 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      textAlign: 'right'
                    }}
                  >
                    <div>{tier.labelAr}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {tier.isCustom ? 'عرض سعر مخصص' : `${tier.priceAnnual.toLocaleString('ar-EG')} ج.م / سنة`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleOrgInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  اسم المؤسسة / المدرسة / الأكاديمية:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مدرسة رواد المستقبل التجريبية"
                  value={orgForm.orgName}
                  onChange={e => setOrgForm({ ...orgForm, orgName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    اسم الشخص المسؤول:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم الثلاثي"
                    value={orgForm.contactName}
                    onChange={e => setOrgForm({ ...orgForm, contactName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    رقم الهاتف / واتساب:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01xxxxxxxxx"
                    value={orgForm.phone}
                    onChange={e => setOrgForm({ ...orgForm, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  البريد الإلكتروني الرسمي للمؤسسة:
                </label>
                <input
                  type="email"
                  required
                  placeholder="school@example.edu.eg"
                  value={orgForm.email}
                  onChange={e => setOrgForm({ ...orgForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {orgSuccessMessage && (
                <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}>
                  {orgSuccessMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#a855f7',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  إرسال طلب الانضمام
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowOrgModal(false);
                    navigateTo('organization_dashboard');
                  }}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0, 229, 255, 0.15)',
                    color: '#00e5ff',
                    border: '1px solid rgba(0, 229, 255, 0.35)',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  استعراض لوحة المؤسسات Live Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionScreen;
