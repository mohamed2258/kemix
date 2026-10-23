import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, Sparkles, Clock, CheckCircle2, AlertTriangle, Code } from 'lucide-react';
import { executePythonCode, ExecutionResult } from '../utils/codeSandbox';
import HorusMascot from '../components/HorusMascot';
import { useGame } from '../context/GameContext';

const sampleSnippets: { title: string; code: string }[] = [
  {
    title: 'برنامج صقر كيميكس 🦅',
    code: `# برنامج الترحيب الخاص بصقر كيميكس
hero = "حورس"
xp = 50
print("مرحباً بك مع الصقر:", hero)
print("نقاط البداية المكتسبة:", xp)`
  },
  {
    title: 'المتغيرات والعمليات الحسابية 📦',
    code: `# حساب نقاط اللاعب الإجمالية
base_score = 100
bonus = 25
total = base_score + bonus
print("المجموع النهائي:", total)`
  },
  {
    title: 'الشروط واتخاذ القرارات ⚖️',
    code: `# فحص مستوى اللاعب وترقيته
level = 5
if level >= 5:
    print("تهانينا! لقد تأهلت للمستوى المتقدم 🚀")`
  }
];

export const CodeEditorScreen: React.FC = () => {
  const { db, addXP } = useGame();
  const [code, setCode] = useState<string>(sampleSnippets[0].code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRun = async () => {
    setIsRunning(true);
    const res = await executePythonCode(code);
    setResult(res);
    setIsRunning(false);

    if (res.success && res.output && !res.output.includes('لا توجد مخرجات')) {
      addXP(10); // Reward small XP for running working code
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00e5ff, #0891b2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070d1e'
            }}>
              <Code size={24} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>
              محرر أكواد كيميكس (KEMIX Sandbox)
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            اكتب، جرّب، وشاهد ناتج كود بايثون مباشرة في بيئة تفاعلية آمنة وسريعة.
          </p>
        </div>

        {/* Template Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sampleSnippets.map((snippet, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCode(snippet.code);
                setResult(null);
              }}
              className="btn-game btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <span>{snippet.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Horus Mascot Advice */}
      <HorusMascot
        mood={result ? (result.success ? 'happy' : 'encouraging') : 'thinking'}
        speechText={
          result
            ? result.success
              ? 'مخرجات ممتازة! تم تنفيذ الكود بسلاسة وكسبت +10 XP! ⚡'
              : 'حدث خطأ في الكود؟ لا تقلق، راجع سطر الخطأ وعدله فوراً!'
            : 'جرّب كتابة دوال print() والمتغيرات الحسابية واضغط على تشغيل الكود.'
        }
      />

      {/* Editor & Terminal Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '20px',
        marginTop: '16px'
      }}>
        {/* Code Input Box */}
        <div className="game-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '12px 18px',
            backgroundColor: 'rgba(0, 229, 255, 0.08)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00e5ff' }}>
              🐍 main.py — محرر بايثون
            </span>
            <button
              onClick={() => {
                setCode('');
                setResult(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem'
              }}
            >
              <RotateCcw size={14} />
              <span>مسح</span>
            </button>
          </div>

          <div style={{ position: 'relative', flex: 1, minHeight: '280px' }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# اكتب كود بايثون هنا..."
              style={{
                width: '100%',
                height: '100%',
                minHeight: '280px',
                padding: '16px',
                backgroundColor: '#040814',
                color: '#38bdf8',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-code)',
                fontSize: '0.98rem',
                lineHeight: 1.6,
                direction: 'ltr',
                textAlign: 'left',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="btn-game btn-kemix-cyan"
              style={{ padding: '10px 24px' }}
            >
              <Play size={18} fill="currentColor" />
              <span>{isRunning ? 'جاري التشغيل...' : 'تشغيل الكود (Run)'}</span>
            </button>
          </div>
        </div>

        {/* Console Terminal Output */}
        <div className="game-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '12px 18px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="#00e5ff" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                شاشة الطرفية والمخرجات (Terminal Output)
              </span>
            </div>

            {result && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <Clock size={13} />
                <span>{result.executionTimeMs} ms</span>
              </div>
            )}
          </div>

          <div style={{
            flex: 1,
            minHeight: '280px',
            padding: '16px',
            backgroundColor: '#02050e',
            fontFamily: 'var(--font-code)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            direction: 'ltr',
            textAlign: 'left',
            overflowY: 'auto'
          }}>
            {!result ? (
              <div style={{ color: '#64748b', fontStyle: 'italic', direction: 'rtl', textAlign: 'right' }}>
                اضغط على زر "تشغيل الكود" لتنفيذ البرنامج ومشاهدة المخرجات هنا...
              </div>
            ) : result.error ? (
              <div>
                <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px' }}>
                  ❌ Traceback (Error Detected):
                </div>
                <div style={{ color: '#fca5a5' }}>{result.error}</div>
              </div>
            ) : (
              <div>
                <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                  ✓ Program Output:
                </div>
                <div style={{ color: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                  {result.output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorScreen;
