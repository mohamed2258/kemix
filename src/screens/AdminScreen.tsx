import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { World, Unit, Lesson, Challenge, ChallengeType } from '../types';
import { 
  Shield, 
  PlusCircle, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Eye, 
  BarChart3, 
  Layers, 
  BookOpen, 
  Save, 
  RefreshCw,
  CreditCard,
  DollarSign,
  Link,
  TestTube,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { dbService } from '../services/db';
import { calculateSavingsPercent } from '../services/subscriptionService';
import { getAnalyticsScriptUrl, setAnalyticsScriptUrl, testAnalyticsConnection, trackEvent } from '../services/analyticsService';

export const AdminScreen: React.FC = () => {
  const { db, updateCurriculum, addOrUpdateWorld, deleteWorld, importCurriculumFile, triggerSync, updateSubscriptionConfig } = useGame();
  const [activeTab, setActiveTab] = useState<'worlds' | 'add_world' | 'add_lesson' | 'import_export' | 'analytics' | 'pricing'>('worlds');

  // Pricing CMS State
  const currentConfig = db.subscriptionConfig;
  const [indMonthlyPrice, setIndMonthlyPrice] = useState(currentConfig.individualMonthlyPrice);
  const [indAnnualPrice, setIndAnnualPrice] = useState(currentConfig.individualAnnualPrice);
  const [famMonthlyPrice, setFamMonthlyPrice] = useState(currentConfig.familyMonthlyPrice);
  const [famAnnualPrice, setFamAnnualPrice] = useState(currentConfig.familyAnnualPrice);
  const [trialDays, setTrialDays] = useState(currentConfig.trialPeriodDays);
  const [famMaxMembers, setFamMaxMembers] = useState(currentConfig.familyMaxMembers);
  const [tier25Price, setTier25Price] = useState(currentConfig.organizationTiers[0]?.priceAnnual || 2499);
  const [tier50Price, setTier50Price] = useState(currentConfig.organizationTiers[1]?.priceAnnual || 4499);
  const [tier100Price, setTier100Price] = useState(currentConfig.organizationTiers[2]?.priceAnnual || 7999);


  // New World Form state
  const [newWorldTitleAr, setNewWorldTitleAr] = useState('');
  const [newWorldTitleEn, setNewWorldTitleEn] = useState('');
  const [newWorldDescAr, setNewWorldDescAr] = useState('');
  const [newWorldIcon, setNewWorldIcon] = useState('🌐');
  const [newWorldLevelReq, setNewWorldLevelReq] = useState(1);

  // New Lesson / Challenge Form state
  const [targetWorldId, setTargetWorldId] = useState(db.curriculum.worlds[0]?.id || '');
  const [newLessonTitleAr, setNewLessonTitleAr] = useState('');
  const [newLessonDescAr, setNewLessonDescAr] = useState('');
  const [newLessonConceptAr, setNewLessonConceptAr] = useState('');
  const [newEnglishTerm, setNewEnglishTerm] = useState('');
  const [newLessonXP, setNewLessonXP] = useState(30);

  // JSON Import / Export state
  const [jsonText, setJsonText] = useState('');
  const [jsonMessage, setJsonMessage] = useState<string | null>(null);

  // Google Analytics Integration State
  const [analyticsScriptUrl, setAnalyticsScriptUrlState] = useState<string>(() => getAnalyticsScriptUrl());
  const [analyticsTestStatus, setAnalyticsTestStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const worlds = db.curriculum.worlds;

  const handleCreateWorld = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorldTitleAr.trim()) return;

    const newWorld: World = {
      id: 'world_' + Date.now(),
      titleAr: newWorldTitleAr.trim(),
      titleEn: newWorldTitleEn.trim() || 'New World',
      descriptionAr: newWorldDescAr.trim() || 'عالم تعليمي جديد في منصة كيميكس.',
      icon: newWorldIcon.trim() || '🌐',
      order: worlds.length + 1,
      themeColor: '#00e5ff',
      accentGradient: 'linear-gradient(135deg, #00e5ff, #0891b2)',
      requiredLevelToUnlock: newWorldLevelReq,
      units: []
    };

    addOrUpdateWorld(newWorld);
    setNewWorldTitleAr('');
    setNewWorldTitleEn('');
    setNewWorldDescAr('');
    setActiveTab('worlds');
    setJsonMessage('تمت إضافة العالم الجديد بنجاح وحفظه في قاعدة البيانات!');
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitleAr.trim() || !targetWorldId) return;

    const world = worlds.find(w => w.id === targetWorldId);
    if (!world) return;

    const newLesson: Lesson = {
      id: 'lesson_' + Date.now(),
      unitId: 'unit_default',
      worldId: targetWorldId,
      titleAr: newLessonTitleAr.trim(),
      descriptionAr: newLessonDescAr.trim() || 'وصف الدرس التعليمي',
      order: 1,
      conceptIntroAr: newLessonConceptAr.trim() || 'مفهوم برمجي أساسي جديد',
      englishFocusTerm: newEnglishTerm.trim() || 'Programming',
      xpReward: newLessonXP,
      coinReward: 10,
      challenges: [
        {
          id: 'ch_' + Date.now(),
          type: 'multiple_choice',
          titleAr: 'سؤال مفهوم ' + newLessonTitleAr,
          questionAr: 'ما هو المفهوم الأساسي لـ ' + newLessonTitleAr + '؟',
          options: ['مفهوم برمجي صحيح 100%', 'خيار تجريبي غير صحيح', 'خيار آخر'],
          correctAnswer: 'مفهوم برمجي صحيح 100%',
          explanationAr: 'أحسنت! هذا التفسير التعليمي يوضح صحة الإجابة.',
          hintAr: 'اختر الخيار الأول دائماً للتجربة.',
          xpReward: 10,
          coinReward: 5
        }
      ]
    };

    // If world has no unit, create one
    let updatedUnits = [...world.units];
    if (updatedUnits.length === 0) {
      updatedUnits.push({
        id: 'unit_' + Date.now(),
        worldId: targetWorldId,
        titleAr: 'الوحدة 1: المهارات الأساسية',
        descriptionAr: 'مجموعة الدروس والتحديات الأولى',
        order: 1,
        lessons: [newLesson]
      });
    } else {
      updatedUnits[0].lessons.push(newLesson);
    }

    addOrUpdateWorld({ ...world, units: updatedUnits });
    setNewLessonTitleAr('');
    setNewLessonDescAr('');
    setNewLessonConceptAr('');
    setNewEnglishTerm('');
    setActiveTab('worlds');
    setJsonMessage('تمت إضافة الدرس والتحدي وحفظهما بنجاح دون الحاجة لإعادة تجميع التطبيق!');
  };

  const handleExportJSON = () => {
    const exported = dbService.exportCurriculumJSON(db.curriculum);
    setJsonText(exported);
    setJsonMessage('تم توليد كود الـ JSON بنجاح. يمكنك نسخه أو نشره للمستخدمين!');
  };

  const handleImportJSON = () => {
    if (!jsonText.trim()) return;
    const success = importCurriculumFile(jsonText);
    if (success) {
      setJsonMessage('✓ تم استيراد ونشر المحتوى بنجاح! تم تحديث كافة العوالم والمراحل فوراً.');
    } else {
      setJsonMessage('❌ خطأ في تنسيق ملف الـ JSON. تأكد من صحة البيانات.');
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070d1e'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>
                لوحة إدارة المحتوى الديناميكي (KEMIX Admin CMS)
              </h1>
              <span style={{ fontSize: '0.8rem', color: '#00e5ff', fontWeight: 700 }}>
                إصدار المنهج الحالي: v{db.curriculum.version} • آخر تحديث: {db.curriculum.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* Sync Status Button */}
        <button
          onClick={triggerSync}
          className="btn-game btn-outline"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} />
          <span>{db.syncStatus === 'syncing' ? 'جاري المزامنة...' : 'مزامنة المحتوى المحلي'}</span>
        </button>
      </div>

      {/* Success / Alert message */}
      {jsonMessage && (
        <div 
          className="animate-pop"
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(0, 229, 255, 0.12)',
            border: '1px solid #00e5ff',
            color: '#00e5ff',
            fontSize: '0.92rem',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{jsonMessage}</span>
          <button onClick={() => setJsonMessage(null)} style={{ background: 'none', border: 'none', color: '#00e5ff', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {/* Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '6px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('worlds')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'worlds' ? '#00e5ff' : 'transparent',
            color: activeTab === 'worlds' ? '#070d1e' : '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          إدارة العوالم والمراحل ({worlds.length})
        </button>
        <button
          onClick={() => setActiveTab('add_world')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'add_world' ? '#00e5ff' : 'transparent',
            color: activeTab === 'add_world' ? '#070d1e' : '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          + إضافة عالم جديد
        </button>
        <button
          onClick={() => setActiveTab('add_lesson')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'add_lesson' ? '#00e5ff' : 'transparent',
            color: activeTab === 'add_lesson' ? '#070d1e' : '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          + إضافة درس وتحديات
        </button>
        <button
          onClick={() => setActiveTab('import_export')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'import_export' ? '#00e5ff' : 'transparent',
            color: activeTab === 'import_export' ? '#070d1e' : '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          تصدير / استيراد المحتوى (JSON)
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'analytics' ? '#00e5ff' : 'transparent',
            color: activeTab === 'analytics' ? '#070d1e' : '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          تحليلات المستخدمين
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'pricing' ? '#fbbf24' : 'transparent',
            color: activeTab === 'pricing' ? '#070d1e' : '#ffffff',
            fontWeight: 900,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CreditCard size={15} />
          <span>إدارة أسعار وخطط الاشتراكات (Pricing CMS)</span>
        </button>
      </div>

      {/* Tab 1: Worlds Management */}
      {activeTab === 'worlds' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {worlds.map((w, index) => (
            <div
              key={w.id}
              className="game-card"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '2rem' }}>{w.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      العالم {index + 1}: {w.titleAr}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#00e5ff', fontWeight: 700 }}>
                      ({w.titleEn})
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {w.descriptionAr}
                  </p>
                  <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '4px' }}>
                    يتطلب مستوى: {w.requiredLevelToUnlock} • يحتوي {w.units.length} وحدات تعليمية
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => deleteWorld(w.id)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                  title="حذف هذا العالم"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Add New World */}
      {activeTab === 'add_world' && (
        <form onSubmit={handleCreateWorld} className="game-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px', color: '#00e5ff' }}>
            إنشاء عالم تعليمي جديد وحفظه تلقائياً
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                اسم العالم بالعربية:
              </label>
              <input
                type="text"
                required
                value={newWorldTitleAr}
                onChange={(e) => setNewWorldTitleAr(e.target.value)}
                placeholder="مثلاً: عالم هياكل البيانات"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                اسم العالم بالإنجليزية (Title En):
              </label>
              <input
                type="text"
                value={newWorldTitleEn}
                onChange={(e) => setNewWorldTitleEn(e.target.value)}
                placeholder="e.g. Data Structures World"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  direction: 'ltr',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 180px 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                الأيقونة (Emoji):
              </label>
              <input
                type="text"
                value={newWorldIcon}
                onChange={(e) => setNewWorldIcon(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                المستوى المطلوب للفتح:
              </label>
              <input
                type="number"
                min={1}
                value={newWorldLevelReq}
                onChange={(e) => setNewWorldLevelReq(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                وصف موجز للعالم:
              </label>
              <input
                type="text"
                value={newWorldDescAr}
                onChange={(e) => setNewWorldDescAr(e.target.value)}
                placeholder="اكتب ماذا سيتعلم اللاعب في هذا العالم..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-game btn-kemix-cyan" style={{ padding: '12px 28px' }}>
            <PlusCircle size={18} />
            <span>حفظ ونشر العالم الجديد</span>
          </button>
        </form>
      )}

      {/* Tab 3: Add New Lesson */}
      {activeTab === 'add_lesson' && (
        <form onSubmit={handleCreateLesson} className="game-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px', color: '#fbbf24' }}>
            إضافة مرحلة ودرس جديد داخل عالم محدد
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              اختر العالم التابع له:
            </label>
            <select
              value={targetWorldId}
              onChange={(e) => setTargetWorldId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)'
              }}
            >
              {worlds.map(w => (
                <option key={w.id} value={w.id}>{w.icon} {w.titleAr} ({w.titleEn})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                عنوان الدرس بالعربية:
              </label>
              <input
                type="text"
                required
                value={newLessonTitleAr}
                onChange={(e) => setNewLessonTitleAr(e.target.value)}
                placeholder="مثلاً: التعرف على الدوال (Functions)"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                المصطلح الإنجليزي المستهدف (Focus English Term):
              </label>
              <input
                type="text"
                value={newEnglishTerm}
                onChange={(e) => setNewEnglishTerm(e.target.value)}
                placeholder="e.g. Function / Recursion"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  direction: 'ltr'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              المفهوم البرمجي السريع (Concept Intro):
            </label>
            <textarea
              rows={3}
              value={newLessonConceptAr}
              onChange={(e) => setNewLessonConceptAr(e.target.value)}
              placeholder="اكتب شرحاً سريعاً يظهر للاعب في بداية الدرس..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-arabic)'
              }}
            />
          </div>

          <button type="submit" className="btn-game btn-kemix-gold" style={{ padding: '12px 28px' }}>
            <Save size={18} />
            <span>حفظ الدرس والتحدي ونشره للمستخدمين</span>
          </button>
        </form>
      )}

      {/* Tab 4: Import / Export JSON */}
      {activeTab === 'import_export' && (
        <div className="game-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '10px', color: '#00e5ff' }}>
            تصدير واستيراد المنهج بدون إعادة بناء التطبيق (Zero-Rebuild Content)
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            يمكنك تصدير المنهج كملف JSON كامل، أو تعديله، أو لصق حزمة تحديث جديدة واستيرادها فوراً لتظهر للمستخدمين مباشرة.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={handleExportJSON}
              className="btn-game btn-outline"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <Download size={16} />
              <span>توليد وتصدير كود المنهج (Export JSON)</span>
            </button>

            <button
              onClick={handleImportJSON}
              className="btn-game btn-kemix-cyan"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <Upload size={16} />
              <span>استيراد وتحديث المنهج (Import JSON)</span>
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={12}
            placeholder='الصق كود JSON الخاص بالمنهج هنا...'
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#040814',
              color: '#38bdf8',
              fontFamily: 'var(--font-code)',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              direction: 'ltr',
              textAlign: 'left'
            }}
          />
        </div>
      )}

      {/* Tab 5: Analytics & Google Sheets Integration */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Live Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="game-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>إجمالي المحاولات</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00e5ff', marginTop: '4px' }}>{db.attempts.length}</div>
            </div>
            <div className="game-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>الدروس المنجزة</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>{db.completedLessons.length}</div>
            </div>
            <div className="game-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>العملات المكسوبة</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24', marginTop: '4px' }}>{db.profile.coins}</div>
            </div>
            <div className="game-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>مستوى اللاعب</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#a855f7', marginTop: '4px' }}>Lv.{db.profile.level}</div>
            </div>
          </div>

          {/* Google Apps Script Integration Panel */}
          <div className="game-card" style={{ padding: '24px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link size={22} color="#10b981" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ربط Google Sheets عبر Apps Script
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  كل نقرة على زر الدفع، وتصفح الشاشات، وإتمام الدروس تُسجَّل تلقائياً في شيت Google
                </p>
              </div>
            </div>

            {/* Step Instructions */}
            <div style={{
              backgroundColor: 'rgba(0, 229, 255, 0.06)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              lineHeight: '1.8',
              color: 'var(--text-muted)'
            }}>
              <div style={{ color: '#00e5ff', fontWeight: 900, marginBottom: '8px', fontSize: '0.9rem' }}>
                📋 خطوات إعداد الشيت (مرة واحدة فقط):
              </div>
              <div><span style={{ color: '#fbbf24', fontWeight: 800 }}>1.</span> افتح Google Sheets وأنشئ شيت جديد</div>
              <div><span style={{ color: '#fbbf24', fontWeight: 800 }}>2.</span> من القائمة اضغط: <strong style={{ color: '#00e5ff' }}>ملحقات (Extensions) &rarr; Apps Script</strong></div>
              <div><span style={{ color: '#fbbf24', fontWeight: 800 }}>3.</span> احذف الكود الموجود والصق محتوى ملف <strong style={{ color: '#fbbf24' }}>google_apps_script.gs</strong> الموجود في جذر المشروع</div>
              <div><span style={{ color: '#fbbf24', fontWeight: 800 }}>4.</span> اضغط <strong style={{ color: '#10b981' }}>Deploy &rarr; New deployment &rarr; Web app</strong></div>
              <div><span style={{ color: '#fbbf24', fontWeight: 800 }}>5.</span> اضبط "Who has access" على <strong style={{ color: '#10b981' }}>Anyone</strong> ثم انسخ رابط Web App URL</div>
              <div><span style={{ color: '#fbbf24', fontWeight: 800 }}>6.</span> الصق الرابط في الحقل أدناه واضغط "حفظ وتفعيل"</div>
            </div>

            {/* URL Input */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', color: '#00e5ff', fontWeight: 800, marginBottom: '8px' }}>
                🔗 رابط Google Apps Script Web App URL:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="url"
                  value={analyticsScriptUrl}
                  onChange={e => setAnalyticsScriptUrlState(e.target.value)}
                  placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: '#040814',
                    border: analyticsScriptUrl ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#38bdf8',
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    direction: 'ltr'
                  }}
                />
                <button
                  onClick={() => {
                    setAnalyticsScriptUrl(analyticsScriptUrl);
                    setAnalyticsTestStatus({ success: true, message: '✓ تم حفظ الرابط! اضغط "اختبار الاتصال" للتحقق.' });
                  }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Save size={16} />
                  حفظ وتفعيل
                </button>
              </div>
            </div>

            {/* Test Connection Button */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={async () => {
                  setIsTesting(true);
                  setAnalyticsTestStatus(null);
                  const result = await testAnalyticsConnection(analyticsScriptUrl || undefined);
                  setAnalyticsTestStatus(result);
                  setIsTesting(false);
                }}
                disabled={isTesting || !analyticsScriptUrl}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 229, 255, 0.15)',
                  border: '1px solid #00e5ff',
                  color: '#00e5ff',
                  fontWeight: 800,
                  cursor: isTesting || !analyticsScriptUrl ? 'not-allowed' : 'pointer',
                  opacity: !analyticsScriptUrl ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem'
                }}
              >
                <TestTube size={16} />
                {isTesting ? 'جاري الاختبار...' : 'اختبار الاتصال بالشيت'}
              </button>

              <button
                onClick={() => {
                  trackEvent('manual_admin_test', {
                    screen: 'admin',
                    userId: db.profile.id,
                    userName: db.profile.name,
                    details: { message: 'تجربة يدوية من لوحة الإدارة' }
                  });
                  setAnalyticsTestStatus({ success: true, message: '⚡ تم إرسال حدث تجريبي! تحقق من Google Sheets الآن.' });
                }}
                disabled={!analyticsScriptUrl}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid #fbbf24',
                  color: '#fbbf24',
                  fontWeight: 800,
                  cursor: !analyticsScriptUrl ? 'not-allowed' : 'pointer',
                  opacity: !analyticsScriptUrl ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem'
                }}
              >
                <Zap size={16} />
                إرسال حدث تجريبي للشيت
              </button>
            </div>

            {/* Status Message */}
            {analyticsTestStatus && (
              <div style={{
                marginTop: '14px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: analyticsTestStatus.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${analyticsTestStatus.success ? '#10b981' : '#ef4444'}`,
                color: analyticsTestStatus.success ? '#10b981' : '#ef4444',
                fontSize: '0.88rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {analyticsTestStatus.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                {analyticsTestStatus.message}
              </div>
            )}
          </div>

          {/* Events Tracked Legend */}
          <div className="game-card" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: 900, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="#fbbf24" />
              الأحداث التي يتتبعها كيميكس ويرسلها للشيت تلقائياً:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {[
                { icon: '💳', event: 'plan_selected', label: 'نقر على خطة الاشتراك (Individual/Family/Org)', color: '#00e5ff' },
                { icon: '✅', event: 'payment_executed', label: 'نقر على زر إتمام الدفع الفعلي', color: '#10b981' },
                { icon: '🔒', event: 'paywall_click', label: 'محاولة الوصول لمحتوى بريميوم (Paywall)', color: '#f97316' },
                { icon: '🏢', event: 'org_quote_requested', label: 'طلب عرض سعر للمؤسسات والمدارس', color: '#a855f7' },
                { icon: '👁️', event: 'screen_view', label: 'زيارة وتصفح كل شاشة داخل التطبيق', color: '#fbbf24' },
                { icon: '🎓', event: 'lesson_complete', label: 'إتمام درس برمجي بنجاح', color: '#10b981' },
                { icon: '🛒', event: 'shop_purchase', label: 'شراء عنصر من متجر كيميكس', color: '#fbbf24' },
                { icon: '⚡', event: 'manual_admin_test', label: 'إشارة اختبار يدوية من لوحة الإدارة', color: '#94a3b8' },
              ].map(ev => (
                <div key={ev.event} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{ev.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-code)', color: ev.color, fontWeight: 700 }}>{ev.event}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1px' }}>{ev.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sheets Columns Description */}
          <div className="game-card" style={{ padding: '20px', fontSize: '0.85rem' }}>
            <h4 style={{ fontWeight: 900, color: 'var(--text-main)', marginBottom: '12px' }}>
              📊 أعمدة Google Sheet المُولَّدة تلقائياً:
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,229,255,0.1)', color: '#00e5ff' }}>
                    {['التاريخ والوقت', 'نوع الحدث', 'اسم المستخدم', 'الخطة', 'الدورة', 'المبلغ (ج.م)', 'طريقة الدفع', 'الشاشة', 'التفاصيل (JSON)', 'رابط الصفحة'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.06)', fontWeight: 900 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ color: 'var(--text-dim)' }}>
                    {['23/10/2026، 3:15 م', '💳 نقر على زر الدفع', 'محمد', 'individual', 'سنوي', '399.99 ج.م', 'credit_card', 'subscription', '{...}', 'https://...'].map((v, i) => (
                      <td key={i} style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.04)', fontFamily: i >= 8 ? 'var(--font-code)' : 'inherit' }}>{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}


      {/* Tab 6: Pricing & Subscription CMS */}
      {activeTab === 'pricing' && (
        <div className="game-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <CreditCard size={26} color="#fbbf24" />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>
                إدارة أسعار وباقات الاشتراكات المركزية
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
                تعديل أسعار الخطط ومدد التجارب المجانية وأسعار المؤسسات مع حساب فوري لنسب التوفير وحفظها بالخادم دون إعادة بناء التطبيق.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedTiers = [
                { id: 'tier_25', minUsers: 1, maxUsers: 25, priceAnnual: tier25Price, labelAr: 'حتى 25 مستخدمًا' },
                { id: 'tier_50', minUsers: 26, maxUsers: 50, priceAnnual: tier50Price, labelAr: 'حتى 50 مستخدمًا' },
                { id: 'tier_100', minUsers: 51, maxUsers: 100, priceAnnual: tier100Price, labelAr: 'حتى 100 مستخدم' },
                { id: 'tier_custom', minUsers: 101, maxUsers: 99999, priceAnnual: 0, labelAr: 'أكثر من 100 مستخدم', isCustom: true }
              ];

              updateSubscriptionConfig({
                individualMonthlyPrice: Number(indMonthlyPrice),
                individualAnnualPrice: Number(indAnnualPrice),
                familyMonthlyPrice: Number(famMonthlyPrice),
                familyAnnualPrice: Number(famAnnualPrice),
                trialPeriodDays: Number(trialDays),
                familyMaxMembers: Number(famMaxMembers),
                organizationTiers: updatedTiers
              });

              setJsonMessage('✓ تم حفظ ونشر إعدادات الأسعار الجديدة بنجاح! تنعكس التغييرات فوراً في جميع شاشات كيميكس.');
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Live Savings Indicator Preview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              padding: '16px',
              backgroundColor: 'rgba(251, 191, 36, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '14px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>نسبة توفير الخطة الفردية المحسوبة:</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#00e5ff', marginTop: '2px' }}>
                  {calculateSavingsPercent(indMonthlyPrice, indAnnualPrice)}% توفير
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>نسبة توفير الخطة العائلية المحسوبة:</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>
                  {calculateSavingsPercent(famMonthlyPrice, famAnnualPrice)}% توفير
                </div>
              </div>
            </div>

            {/* Individual Pricing */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00e5ff', marginBottom: '14px' }}>
                1. أسعار الخطة الفردية (Individual)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    السعر الشهري (ج.م):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={indMonthlyPrice}
                    onChange={e => setIndMonthlyPrice(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    السعر السنوي (ج.م):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={indAnnualPrice}
                    onChange={e => setIndAnnualPrice(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
              </div>
            </div>

            {/* Family Pricing */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', marginBottom: '14px' }}>
                2. أسعار الخطة العائلية (Family)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    السعر الشهري (ج.م):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={famMonthlyPrice}
                    onChange={e => setFamMonthlyPrice(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    السعر السنوي (ج.م):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={famAnnualPrice}
                    onChange={e => setFamAnnualPrice(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    الحد الأقصى لحسابات العائلة:
                  </label>
                  <input
                    type="number"
                    required
                    value={famMaxMembers}
                    onChange={e => setFamMaxMembers(parseInt(e.target.value) || 5)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
              </div>
            </div>

            {/* Trial & Organization Tiers */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a855f7', marginBottom: '14px' }}>
                3. التجربة المجانية وأسعار المؤسسات والمدارس
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    مدة التجربة المجانية (أيام):
                  </label>
                  <input
                    type="number"
                    required
                    value={trialDays}
                    onChange={e => setTrialDays(parseInt(e.target.value) || 7)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    باقة حتى 25 طالب سنوي (ج.م):
                  </label>
                  <input
                    type="number"
                    required
                    value={tier25Price}
                    onChange={e => setTier25Price(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    باقة حتى 50 طالب سنوي (ج.م):
                  </label>
                  <input
                    type="number"
                    required
                    value={tier50Price}
                    onChange={e => setTier50Price(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    باقة حتى 100 طالب سنوي (ج.م):
                  </label>
                  <input
                    type="number"
                    required
                    value={tier100Price}
                    onChange={e => setTier100Price(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '14px 24px',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} />
              <span>حفظ وتطبيق إعدادات الأسعار فوراً على المنصة</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminScreen;
