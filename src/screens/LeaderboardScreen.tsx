import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Star, ChevronLeft, ShieldCheck, Flame, Crown } from 'lucide-react';
import HorusMascot from '../components/HorusMascot';

export const LeaderboardScreen: React.FC = () => {
  const { db, navigateTo } = useGame();
  const { profile } = db;
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current');

  // Exact names and data matching Screen 13 of reference board
  const boardData = [
    { rank: 1, name: 'Ahmed', xp: 12450, avatar: '👨‍💻', isUser: false },
    { rank: 2, name: 'Sara', xp: 11960, avatar: '👩‍💻', isUser: false },
    { rank: 3, name: 'Omar', xp: 10760, avatar: '🚀', isUser: false },
    { rank: 4, name: 'You (أنت)', xp: Math.max(9320, profile.xp), avatar: profile.avatar === '🦅' ? '🦅' : profile.avatar, isUser: true },
    { rank: 5, name: 'Lina', xp: 8910, avatar: '⭐', isUser: false },
    { rank: 6, name: 'Ali', xp: 8430, avatar: '⚡', isUser: false }
  ];

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      {/* Screen 13: Weekly Leaderboard matching reference board */}
      <div 
        className="game-card animate-pop"
        style={{
          padding: '28px 20px',
          backgroundColor: 'rgba(11, 20, 44, 0.95)',
          border: '1.5px solid rgba(0, 229, 255, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 229, 255, 0.15)'
        }}
      >
        {/* Header with back button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button
            onClick={() => navigateTo('home')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center' }}>
            لوحة الترتيب الأسبوعية
          </h1>

          <div style={{ width: '24px' }} />
        </div>

        {/* Tabs: الحالي vs السابق (matching Screen 13) */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(6, 11, 27, 0.8)',
          padding: '4px',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('current')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'current' ? '#00e5ff' : 'transparent',
              color: activeTab === 'current' ? '#070d1e' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            الحالي
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'previous' ? '#00e5ff' : 'transparent',
              color: activeTab === 'previous' ? '#070d1e' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            السابق
          </button>
        </div>

        {/* Players List matching Screen 13 exactly */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {boardData.map((player) => {
            const isUser = player.isUser;

            return (
              <div
                key={player.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  backgroundColor: isUser 
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(0, 229, 255, 0.15))' 
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isUser 
                    ? '2px solid #fbbf24' 
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isUser ? '0 0 16px rgba(251, 191, 36, 0.25)' : 'none',
                  transition: 'transform 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Rank Badge */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: player.rank === 1 ? 'rgba(251, 191, 36, 0.2)' : (player.rank === 2 ? 'rgba(148, 163, 184, 0.2)' : (player.rank === 3 ? 'rgba(217, 119, 6, 0.2)' : 'rgba(255, 255, 255, 0.05)')),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    color: player.rank === 1 ? '#fbbf24' : (player.rank === 2 ? '#94a3b8' : (player.rank === 3 ? '#d97706' : 'var(--text-dim)'))
                  }}>
                    {player.rank}
                  </div>

                  {/* Avatar with circular border */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: isUser ? '2px solid #fbbf24' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    boxShadow: isUser ? '0 0 10px rgba(251, 191, 36, 0.4)' : 'none'
                  }}>
                    {player.avatar}
                  </div>

                  <div>
                    <div style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: isUser ? '#fbbf24' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span>{player.name}</span>
                      {isUser && <Crown size={14} color="#fbbf24" />}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.05rem', color: isUser ? '#fbbf24' : '#00e5ff' }}>
                    {player.xp.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
