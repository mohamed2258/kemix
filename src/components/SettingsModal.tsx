import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, Moon, Sun, RotateCcw, Monitor, X, Check } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

const avatars = ['🦅', '🚀', '👨‍💻', '👩‍💻', '🐍', '🦁', '⚡', '🤖', '👑'];

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { db, toggleSound, toggleTheme, updateProfile, resetProgress } = useGame();
  const { profile } = db;
  const [nameInput, setNameInput] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      name: nameInput.trim() || 'بطل كيميكس',
      avatar: selectedAvatar
    });
    onClose();
  };

  const isDesktop = typeof window !== 'undefined' && Boolean(window.electronAPI?.isDesktop);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 7, 18, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 100
    }}>
      <div 
        className="game-card animate-pop"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '28px 24px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00e5ff' }}>
            ⚙️ إعدادات منصة KEMIX
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Avatar Selection */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
            الصورة الرمزية (الأفاتار)
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {avatars.map(av => (
              <button
                key={av}
                onClick={() => setSelectedAvatar(av)}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  fontSize: '1.4rem',
                  border: selectedAvatar === av ? '2px solid #00e5ff' : '1px solid var(--border-color)',
                  backgroundColor: selectedAvatar === av ? 'rgba(0, 229, 255, 0.2)' : 'var(--bg-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Player Name */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
            اسم اللاعب
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
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

        {/* Sound & Theme Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {profile.soundEnabled ? <Volume2 size={20} color="#10b981" /> : <VolumeX size={20} color="var(--text-dim)" />}
              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>المؤثرات الصوتية</span>
            </div>
            <button
              onClick={toggleSound}
              className="btn-game btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              {profile.soundEnabled ? 'مفعّلة' : 'مكتومة'}
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {profile.theme === 'dark' ? <Moon size={20} color="#00e5ff" /> : <Sun size={20} color="#fbbf24" />}
              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>المظهر والألوان</span>
            </div>
            <button
              onClick={toggleTheme}
              className="btn-game btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              {profile.theme === 'dark' ? 'داكن (Dark) 🌙' : 'فاتح (Light) ☀️'}
            </button>
          </div>
        </div>

        {/* Environment Status */}
        <div style={{
          backgroundColor: 'rgba(0, 229, 255, 0.08)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Monitor size={20} color="#00e5ff" />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div>البيئة: {isDesktop ? 'تطبيق Windows Desktop مستقل (KEMIX Electron)' : 'مستعرض ويب متجاوب'}</div>
            <div style={{ color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
              ✓ يعمل بنظام Hybrid Offline بدون الحاجة لإنترنت دائم
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <button
            onClick={handleSaveProfile}
            className="btn-game btn-kemix-cyan"
            style={{ width: '100%', padding: '12px' }}
          >
            <Check size={18} />
            <span>حفظ التعديلات</span>
          </button>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} />
              <span>إعادة ضبط تقدم اللاعب للصفر</span>
            </button>
          ) : (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '8px' }}>
                هل أنت متأكد من رغبتك في تصفير النقاط والعودة للمستوى 1؟
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={async () => {
                    await resetProgress();
                    onClose();
                  }}
                  className="btn-game"
                  style={{ backgroundColor: '#ef4444', color: '#fff', padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  نعم، تصفير والبدء من جديد
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="btn-game btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
