import React from 'react';

export type MascotMood = 'happy' | 'thinking' | 'encouraging' | 'boss' | 'idle';

interface HorusMascotProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HorusMascot: React.FC<HorusMascotProps> = ({
  mood = 'idle',
  speechText,
  size = 'md'
}) => {
  const sizeMap = {
    sm: { img: 56, text: '0.8rem' },
    md: { img: 88, text: '0.92rem' },
    lg: { img: 120, text: '1.05rem' }
  };

  const defaultDialogue: Record<MascotMood, string> = {
    idle: 'مرحباً يا بطل كيميكس! أنا صقر البرمجة "حورس"، جاهز للتحدي؟',
    happy: 'عظيم جداً! كودك نظيف ومنطقك سليم 100%! 🦅⚡',
    thinking: 'تذكّر دائماً: البرمجة هي تقسيم المشكلة الكبيرة لخطوات بسيطة.',
    encouraging: 'لا تيأس أبداً! حتى كبار مهندسي البرمجيات يخطئون ويعيدون المحاولة.',
    boss: 'انتبه! هذا تحدي الزعيم، استجمع كل ما تعلمته واقهر التحدي!'
  };

  const currentSpeech = speechText || defaultDialogue[mood];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      margin: '12px 0',
      direction: 'rtl'
    }}>
      {/* Falcon Mascot Avatar */}
      <div 
        style={{
          position: 'relative',
          width: sizeMap[size].img,
          height: sizeMap[size].img,
          borderRadius: '50%',
          padding: '3px',
          background: mood === 'boss'
            ? 'linear-gradient(135deg, #ef4444, #f59e0b)'
            : mood === 'happy'
            ? 'linear-gradient(135deg, #00e5ff, #f59e0b)'
            : 'linear-gradient(135deg, #d97706, #00e5ff)',
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.35)',
          flexShrink: 0,
          transition: 'transform 0.2s ease'
        }}
        className={mood === 'happy' ? 'animate-pop' : 'animate-float'}
      >
        <img
          src="./kemix-falcon.jpg"
          alt="صقر كيميكس - حورس"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Fallback to emoji if image cannot be loaded
            e.currentTarget.style.display = 'none';
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '-2px',
          backgroundColor: '#070d1e',
          border: '1px solid #00e5ff',
          borderRadius: '10px',
          padding: '2px 6px',
          fontSize: '0.68rem',
          fontWeight: 800,
          color: '#00e5ff'
        }}>
          حورس
        </div>
      </div>

      {/* Speech Bubble */}
      {currentSpeech && (
        <div 
          className="animate-pop"
          style={{
            position: 'relative',
            backgroundColor: 'rgba(11, 19, 41, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '16px',
            padding: '12px 18px',
            color: '#f8fafc',
            fontSize: sizeMap[size].text,
            lineHeight: 1.5,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            maxWidth: '480px'
          }}
        >
          {/* Arrow pointing to mascot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '-8px',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid rgba(0, 229, 255, 0.35)'
          }} />

          <span style={{ fontWeight: 600 }}>{currentSpeech}</span>
        </div>
      )}
    </div>
  );
};

export default HorusMascot;
