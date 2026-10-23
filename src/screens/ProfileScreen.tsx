import React, { useState } from 'react';
import { useGame, calculateLevelProgress } from '../context/GameContext';
import { 
  Award, 
  Flame, 
  Star, 
  CheckCircle, 
  Target, 
  Lock, 
  Shield, 
  Sparkles, 
  Crown, 
  CreditCard, 
  Users, 
  Building2, 
  Calendar, 
  RefreshCw, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  ArrowRightLeft, 
  AlertCircle 
} from 'lucide-react';
import HorusMascot from '../components/HorusMascot';

export const ProfileScreen: React.FC = () => {
  const { 
    db, 
    subscriptionAccess, 
    cancelSubscriptionRenewal, 
    reactivateSubscription, 
    addFamilyMember, 
    removeFamilyMember, 
    switchFamilyMember, 
    navigateTo 
  } = useGame();

  const { profile, completedLessons, attempts, achievements, unlockedWorlds, subscription, familyMembers, activeFamilyMemberId } = db;
  const config = db.subscriptionConfig;

  const [activeTab, setActiveTab] = useState<'stats' | 'subscription' | 'family'>('stats');

  // Add Family Member form state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('🦉');
  const [memberFormError, setMemberFormError] = useState<string | null>(null);

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const levelProg = calculateLevelProgress(profile.xp);
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const accuracyPercent = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

  const handleCancelRenew = () => {
    const res = cancelSubscriptionRenewal();
    setActionFeedback(res.message);
  };

  const handleReactivate = () => {
    const res = reactivateSubscription();
    setActionFeedback(res.message);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const res = addFamilyMember(newMemberName.trim(), newMemberAvatar);
    if (res.success) {
      setNewMemberName('');
      setShowAddMemberModal(false);
      setMemberFormError(null);
      setActionFeedback(res.message);
    } else {
      setMemberFormError(res.message);
    }
  };

  const getStatusBadge = () => {
    if (!subscription) {
      return { text: 'الخطة المجانية', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' };
    }
    switch (subscription.status) {
      case 'active':
        return { text: 'نشط (Active)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'trial':
        return { text: `فترة تجريبية (${subscriptionAccess.daysRemaining} أيام متبقية)`, color: '#00e5ff', bg: 'rgba(0, 229, 255, 0.15)' };
      case 'cancelled':
        return { text: 'تم إلغاء التجديد (الصلاحية مستمرة)', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' };
      case 'expired':
        return { text: 'منتهي الصلاحية', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'past_due':
        return { text: 'تعثر بالدفع', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
      case 'pending_payment':
        return { text: 'قيد تأكيد الدفع', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' };
      default:
        return { text: subscription.status, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
      {/* Profile Header Hero */}
      <div 
        className="game-card"
        style={{
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.18), rgba(11, 19, 41, 0.95))',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{
          width: '92px',
          height: '92px',
          borderRadius: '26px',
          background: 'linear-gradient(135deg, #00e5ff, #fbbf24)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          boxShadow: '0 8px 24px rgba(0, 229, 255, 0.45)',
          overflow: 'hidden'
        }}>
          {profile.avatar === '🦅' ? (
            <img src="./kemix-falcon.jpg" alt="Horus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            profile.avatar
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)' }}>
              {profile.name}
            </h1>
            <span style={{
              background: 'linear-gradient(135deg, #00e5ff, #0891b2)',
              color: '#070d1e',
              padding: '2px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 900
            }}>
              المستوى {profile.level}
            </span>

            {/* Role & Subscription Badge */}
            <span style={{
              backgroundColor: statusBadge.bg,
              color: statusBadge.color,
              padding: '2px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              border: `1px solid ${statusBadge.color}40`,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Crown size={14} />
              <span>{statusBadge.text}</span>
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '14px' }}>
            الهدف: {profile.learningGoal} • العوالم المفتوحة: {unlockedWorlds.length} من {db.curriculum.worlds.length}
          </p>

          {/* Level Progress */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
              <span>تقدم المستوى الحالي</span>
              <span>{levelProg.current} / {levelProg.max} XP</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${levelProg.percent}%`,
                height: '100%',
                backgroundColor: '#00e5ff',
                borderRadius: '6px',
                boxShadow: '0 0 8px #00e5ff'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'stats' ? '3px solid #00e5ff' : '3px solid transparent',
            color: activeTab === 'stats' ? '#00e5ff' : 'var(--text-muted)',
            fontWeight: activeTab === 'stats' ? 800 : 600,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          <Award size={18} />
          <span>الملف الشخصي والإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'subscription' ? '3px solid #fbbf24' : '3px solid transparent',
            color: activeTab === 'subscription' ? '#fbbf24' : 'var(--text-muted)',
            fontWeight: activeTab === 'subscription' ? 800 : 600,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          <CreditCard size={18} />
          <span>إدارة الاشتراك والترقية</span>
        </button>

        {subscription?.plan === 'family' && (
          <button
            onClick={() => setActiveTab('family')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'family' ? '3px solid #fbbf24' : '3px solid transparent',
              color: activeTab === 'family' ? '#fbbf24' : 'var(--text-muted)',
              fontWeight: activeTab === 'family' ? 800 : 600,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <Users size={18} />
            <span>إدارة أفراد العائلة ({familyMembers.length})</span>
          </button>
        )}
      </div>

      {actionFeedback && (
        <div style={{
          backgroundColor: 'rgba(0, 229, 255, 0.12)',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          color: '#00e5ff',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          fontWeight: 700
        }}>
          {actionFeedback}
        </div>
      )}

      {/* TAB 1: Stats & Achievements */}
      {activeTab === 'stats' && (
        <>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '14px',
            marginBottom: '28px'
          }}>
            {/* Streak */}
            <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Flame size={28} color="#f97316" className="animate-flame" />
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                  {profile.streak} يوم
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>شعلة الحماس</div>
              </div>
            </div>

            {/* Total XP */}
            <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Star size={28} color="#fbbf24" fill="#fbbf24" />
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                  {profile.xp.toLocaleString('ar-EG')}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>مجموع نقاط XP</div>
              </div>
            </div>

            {/* Completed Lessons */}
            <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={28} color="#10b981" />
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                  {completedLessons.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>دروس مكتملة</div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target size={28} color="#00e5ff" />
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                  %{accuracyPercent}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>دقة الإجابات</div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="game-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Award size={22} color="#fbbf24" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                أوسمة وإنجازات صقر كيميكس (Achievements)
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: ach.unlocked ? 'rgba(251, 191, 36, 0.08)' : 'var(--bg-main)',
                    border: ach.unlocked ? '1px solid rgba(251, 191, 36, 0.35)' : '1px solid var(--border-color)',
                    opacity: ach.unlocked ? 1 : 0.65
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: ach.unlocked ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    flexShrink: 0
                  }}>
                    {ach.unlocked ? ach.icon : <Lock size={20} color="var(--text-dim)" />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: ach.unlocked ? '#fbbf24' : 'var(--text-main)' }}>
                      {ach.titleAr}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {ach.descriptionAr}
                    </div>

                    <div style={{
                      width: '100%',
                      height: '5px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100))}%`,
                        height: '100%',
                        backgroundColor: ach.unlocked ? '#10b981' : '#fbbf24',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: Subscription Management */}
      {activeTab === 'subscription' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Current Subscription Card */}
          <div 
            className="game-card"
            style={{
              padding: '28px',
              backgroundColor: 'rgba(11, 19, 41, 0.95)',
              border: subscriptionAccess.hasPremiumAccess ? '2px solid rgba(0, 229, 255, 0.4)' : '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Crown size={26} color={subscriptionAccess.hasPremiumAccess ? '#fbbf24' : '#94a3b8'} />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>
                    {subscription ? (
                      subscription.plan === 'individual' ? 'الخطة الفردية (Individual)' :
                      subscription.plan === 'family' ? 'الخطة العائلية (Family)' : 'خطة المؤسسات والمدارس'
                    ) : 'الخطة المجانية (Free Tier)'}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    backgroundColor: statusBadge.bg,
                    color: statusBadge.color,
                    padding: '3px 12px',
                    borderRadius: '16px',
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}>
                    {statusBadge.text}
                  </span>
                  {subscription && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      دورة الفوترة: {subscription.billingCycle === 'annual' ? 'سنوي' : 'شهري'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigateTo('subscription')}
                  className="btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.9rem', borderRadius: '12px' }}
                >
                  {subscription ? 'تغيير الخطة / الترقية' : 'الترقية لـ KEMIX Premium'}
                </button>

                {subscription?.status === 'active' && (
                  <button
                    onClick={handleCancelRenew}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#ef4444',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    إلغاء التجديد التلقائي
                  </button>
                )}

                {(subscription?.status === 'cancelled' || subscription?.status === 'expired') && (
                  <button
                    onClick={handleReactivate}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      color: '#10b981',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    إعادة الاشتراك والتفعيل
                  </button>
                )}
              </div>
            </div>

            {/* Dates & Billing Info Grid */}
            {subscription ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '2px' }}>تاريخ البداية:</div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {new Date(subscription.startDate).toLocaleDateString('ar-EG')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '2px' }}>تاريخ التجديد / النهاية:</div>
                  <div style={{ fontWeight: 800, color: '#00e5ff', fontSize: '0.9rem' }}>
                    {new Date(subscription.endDate).toLocaleDateString('ar-EG')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '2px' }}>الأيام المتبقية:</div>
                  <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.9rem' }}>
                    {subscriptionAccess.daysRemaining} يوم
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '2px' }}>وسيلة الدفع:</div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {subscription.paymentMethod === 'credit_card' ? 'بطاقة بنكية' : (subscription.paymentMethod || 'محفظة إلكترونية')}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                marginBottom: '20px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                أنت حالياً على المستوى المجاني. يمكنك تجربة دروس العالم الأول وتحدياته الأساسية مجاناً.
              </div>
            )}

            {/* Plan Perks Checklist */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
                المميزات والصلاحيات المتاحة بحسابك:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {(subscription ? config.features[subscription.plan] : config.features.individual.slice(0, 4)).map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color={subscription ? '#00e5ff' : '#94a3b8'} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: subscription ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* If organization user, shortcut to Organization Dashboard */}
          {db.organizationAccount && (
            <div className="game-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={28} color="#a855f7" />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{db.organizationAccount.orgName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    لوحة تحكم الفصول والمجموعات والطلاب
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateTo('organization_dashboard')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.18)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                فتح لوحة المؤسسة
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Family Members Management */}
      {activeTab === 'family' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="game-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  حسابات العائلة المستقلة ({familyMembers.length} من أصل {config.familyMaxMembers})
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  لكل فرد من العائلة ملفه المستقل، نقاط XP، المراحل المكتملة، والشعلة دون تداخل.
                </p>
              </div>

              {familyMembers.length < config.familyMaxMembers && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', fontSize: '0.88rem' }}
                >
                  <UserPlus size={16} />
                  <span>إضافة فرد جديد</span>
                </button>
              )}
            </div>

            {/* Members List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {familyMembers.map(member => {
                const isActive = (activeFamilyMemberId ? member.id === activeFamilyMemberId : member.role === 'owner');

                return (
                  <div
                    key={member.id}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: isActive ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                      border: isActive ? '2px solid #00e5ff' : '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem'
                      }}>
                        {member.avatar}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                            {member.name}
                          </span>
                          {member.role === 'owner' && (
                            <span style={{ fontSize: '0.7rem', color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.15)', padding: '1px 6px', borderRadius: '8px' }}>
                              مدير
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          المستوى {member.level} • {member.xp} XP • {member.streak} أيام شعلة
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
                      {isActive ? (
                        <span style={{ fontSize: '0.8rem', color: '#00e5ff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} />
                          <span>الحساب النشط حالياً</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => switchFamilyMember(member.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'none',
                            border: 'none',
                            color: '#00e5ff',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          <ArrowRightLeft size={14} />
                          <span>التبديل لهذا الحساب</span>
                        </button>
                      )}

                      {member.role !== 'owner' && (
                        <button
                          onClick={() => removeFamilyMember(member.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px',
                            fontSize: '0.78rem'
                          }}
                        >
                          إزالة
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddMemberModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 13, 30, 0.85)', backdropFilter: 'blur(10px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="game-card animate-scale-up" style={{ maxWidth: '420px', width: '100%', backgroundColor: '#0b1329', padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '14px', color: 'var(--text-main)' }}>
              إضافة فرد جديد لحساب العائلة
            </h3>

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>اسم الفرد / الابن:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: يوسف"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>اختر الأفاتار الشخصي:</label>
                <div style={{ display: 'flex', gap: '10px', fontSize: '1.6rem' }}>
                  {['🦅', '🦉', '🚀', '⭐', '🦁', '🦊'].map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setNewMemberAvatar(av)}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        border: newMemberAvatar === av ? '2px solid #00e5ff' : '1px solid var(--border-color)',
                        backgroundColor: newMemberAvatar === av ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {memberFormError && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem' }}>{memberFormError}</div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '10px' }}>
                  إضافة الحساب
                </button>
                <button type="button" onClick={() => setShowAddMemberModal(false)} style={{ padding: '10px 16px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
