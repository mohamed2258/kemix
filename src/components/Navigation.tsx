import React from 'react';
import { useGame, ScreenType } from '../context/GameContext';
import { Home, Compass, Dumbbell, Trophy, User, Shield, Code2, ShoppingBag, Crown, Building2 } from 'lucide-react';

interface NavItem {
  id: ScreenType;
  labelAr: string;
  icon: React.ReactNode;
}

export const Navigation: React.FC = () => {
  const { currentScreen, navigateTo, db } = useGame();

  const navItems: NavItem[] = [
    { id: 'home', labelAr: 'الرئيسية', icon: <Home size={22} /> },
    { id: 'learn', labelAr: 'خريطة التعلّم', icon: <Compass size={22} /> },
    { id: 'subscription', labelAr: 'الاشتراكات والترقية', icon: <Crown size={22} /> },
    { id: 'shop', labelAr: 'المتجر والمكافآت', icon: <ShoppingBag size={22} /> },
    { id: 'code_editor', labelAr: 'محرر الأكواد', icon: <Code2 size={22} /> },
    { id: 'practice', labelAr: 'التقوية وبنك الأخطاء', icon: <Dumbbell size={22} /> },
    { id: 'leaderboard', labelAr: 'المتصدرين', icon: <Trophy size={22} /> },
    { id: 'profile', labelAr: 'ملفي والاشتراك', icon: <User size={22} /> },
    ...(db.organizationAccount ? [{ id: 'organization_dashboard' as ScreenType, labelAr: 'لوحة المؤسسة', icon: <Building2 size={22} /> }] : []),
    { id: 'admin', labelAr: 'لوحة المحتوى CMS', icon: <Shield size={20} /> },
  ];

  if (currentScreen === 'lesson' || currentScreen === 'onboarding') {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        style={{
          width: '240px',
          backgroundColor: 'var(--bg-glass)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          gap: '8px',
          flexShrink: 0
        }}
        className="hidden-mobile"
      >
        <div style={{ marginBottom: '16px', paddingRight: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.8px' }}>
            بوابة كيميكس البرمجية
          </span>
        </div>

        {navItems.map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(251, 191, 36, 0.1))' : 'transparent',
                color: isActive ? '#00e5ff' : 'var(--text-muted)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'right',
                transition: 'all 0.15s ease',
                outline: 'none',
                borderRight: isActive ? '4px solid #00e5ff' : '4px solid transparent'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.06)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <span style={{ color: isActive ? '#00e5ff' : 'inherit' }}>
                {item.icon}
              </span>
              <span>{item.labelAr}</span>
            </button>
          );
        })}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8px 2px',
          zIndex: 50
        }}
        className="visible-mobile"
      >
        {navItems.slice(0, 5).map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: isActive ? '#00e5ff' : 'var(--text-dim)',
                padding: '6px 8px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <div style={{
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.15s ease'
              }}>
                {item.icon}
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: isActive ? 800 : 500,
                color: isActive ? '#00e5ff' : 'inherit'
              }}>
                {item.labelAr}
              </span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .visible-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navigation;
