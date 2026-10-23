import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import OutOfHeartsModal from './components/OutOfHeartsModal';
import RewardModal from './components/RewardModal';
import PaywallModal from './components/PaywallModal';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import LessonScreen from './screens/LessonScreen';
import CodeEditorScreen from './screens/CodeEditorScreen';
import PracticeScreen from './screens/PracticeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShopScreen from './screens/ShopScreen';
import AdminScreen from './screens/AdminScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import OrganizationDashboardScreen from './screens/OrganizationDashboardScreen';

const MainContent: React.FC = () => {
  const { currentScreen, loading, db } = useGame();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
        fontSize: '1.2rem',
        fontWeight: 800
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }} className="animate-float">🦅</div>
          <div style={{ color: '#00e5ff', fontSize: '1.4rem', fontWeight: 900 }}>KEMIX</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            جاري تهيئة عالم البرمجة التفاعلي...
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen />;
  }

  if (currentScreen === 'lesson') {
    return (
      <>
        <LessonScreen />
        <OutOfHeartsModal />
        <RewardModal />
        <PaywallModal />
      </>
    );
  }

  return (
    <div 
      data-theme={db.profile.theme}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <TopBar />

      <div className="app-container" style={{ flex: 1 }}>
        <Navigation />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'learn' && <LearnScreen />}
          {currentScreen === 'shop' && <ShopScreen />}
          {currentScreen === 'code_editor' && <CodeEditorScreen />}
          {currentScreen === 'practice' && <PracticeScreen />}
          {currentScreen === 'leaderboard' && <LeaderboardScreen />}
          {currentScreen === 'profile' && <ProfileScreen />}
          {currentScreen === 'admin' && <AdminScreen />}
          {currentScreen === 'subscription' && <SubscriptionScreen />}
          {currentScreen === 'organization_dashboard' && <OrganizationDashboardScreen />}
        </main>
      </div>

      {/* Global Cyber Desktop Footer Strip matching Reference Board */}
      <footer style={{
        backgroundColor: '#040816',
        borderTop: '1px solid rgba(0, 229, 255, 0.2)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.82rem',
        color: 'var(--text-dim)',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            color: '#fbbf24',
            fontWeight: 900,
            fontSize: '0.95rem',
            letterSpacing: '1px'
          }}>
            KEMIX
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span style={{ color: '#94a3b8' }}>
            معاً نحو مستقبل أفضل .. أكثر من مجرد لعبة ... إنها رحلة لبناء مهاراتك البرمجية
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '2px 10px',
            borderRadius: '12px',
            color: '#10b981',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>يعمل بدون إنترنت (Offline Ready)</span>
          </div>
          <span style={{ color: '#00e5ff', fontWeight: 700, fontSize: '0.78rem' }}>
            🖥️ متاح ومخصص لنظام Windows
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            v2.4.0
          </span>
        </div>
      </footer>

      <OutOfHeartsModal />
      <RewardModal />
      <PaywallModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
};

export default App;
