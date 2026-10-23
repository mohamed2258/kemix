import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Challenge, Lesson } from '../types';
import { X, Heart, Flame, Lightbulb, CheckCircle2, AlertCircle, ArrowLeft, ArrowUp, ArrowDown, Play, BookOpen } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { executePythonCode } from '../utils/codeSandbox';
import { prepareAndShuffleOptions, evaluateAnswer, fisherYatesShuffle, ShuffledOption } from '../utils/shuffle';
import HorusMascot, { MascotMood } from '../components/HorusMascot';

export const LessonScreen: React.FC = () => {
  const { 
    activeLessonId, 
    activeUnitId, 
    activeBossChallenge, 
    exitLesson, 
    db, 
    loseHeart, 
    addXP, 
    recordChallengeAttempt, 
    finishLesson,
    combo
  } = useGame();

  let currentLesson: Lesson | null = null;
  let challenges: Challenge[] = [];

  const worlds = db.curriculum.worlds;

  if (activeBossChallenge) {
    for (const world of worlds) {
      if (world.bossChallenge?.id === activeLessonId) {
        challenges = [world.bossChallenge];
        break;
      }
      for (const unit of world.units) {
        if (unit.bossChallenge?.id === activeLessonId) {
          challenges = [unit.bossChallenge];
          break;
        }
      }
    }
  } else {
    for (const world of worlds) {
      for (const unit of world.units) {
        const found = unit.lessons.find(l => l.id === activeLessonId);
        if (found) {
          currentLesson = found;
          challenges = found.challenges;
          break;
        }
      }
      if (currentLesson) break;
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption<string>[]>([]);
  const [blankInputValue, setBlankInputValue] = useState<string>('');
  const [reorderedItems, setReorderedItems] = useState<string[]>([]);
  const [userCodeInput, setUserCodeInput] = useState<string>('');
  const [codeRunOutput, setCodeRunOutput] = useState<string | null>(null);
  const [codeRunError, setCodeRunError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mistakesInLesson, setMistakesInLesson] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentChallenge = challenges[currentIndex];

  useEffect(() => {
    if (currentChallenge?.type === 'reorder_code' && currentChallenge.options) {
      setReorderedItems(fisherYatesShuffle(currentChallenge.options));
    } else if (currentChallenge?.options && typeof currentChallenge.correctAnswer === 'string') {
      setShuffledOptions(prepareAndShuffleOptions(currentChallenge.options, currentChallenge.correctAnswer));
    } else {
      setShuffledOptions([]);
    }

    if (currentChallenge?.type === 'interactive_code') {
      setUserCodeInput(currentChallenge.starterCode || '');
      setCodeRunOutput(null);
      setCodeRunError(null);
    }
    setBlankInputValue('');
    setSelectedOption(null);
    setHasChecked(false);
    setShowHint(false);
    setStartTime(Date.now());
  }, [currentIndex, currentChallenge]);

  if (!currentChallenge) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>لم يتم العثور على التحدي المطلوب.</p>
        <button onClick={exitLesson} className="btn-game btn-kemix-cyan" style={{ marginTop: '16px' }}>
          العودة للخريطة
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex) / challenges.length) * 100);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...reorderedItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setReorderedItems(newItems);
  };

  // Run user code in sandbox
  const handleRunInteractiveCode = async () => {
    const res = await executePythonCode(userCodeInput);
    setCodeRunOutput(res.output);
    setCodeRunError(res.error || null);

    // Check if test cases match
    if (currentChallenge.testCases && currentChallenge.testCases.length > 0) {
      const expected = currentChallenge.testCases[0].expectedOutput.trim();
      const actual = res.output.trim();
      if (actual.includes(expected)) {
        setIsCorrect(true);
        setSelectedOption('executed_correct');
      } else {
        setIsCorrect(false);
      }
    } else {
      setIsCorrect(res.success);
      setSelectedOption('executed');
    }
  };

  const handleCheck = () => {
    if (hasChecked) {
      if (currentIndex + 1 < challenges.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const isPerfect = mistakesInLesson === 0;
        finishLesson(activeLessonId || 'boss', activeUnitId || 'boss_unit', isPerfect);
      }
      return;
    }

    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    let correct = false;

    if (currentChallenge.type === 'reorder_code') {
      const correctArr = currentChallenge.correctAnswer as string[];
      correct = JSON.stringify(reorderedItems) === JSON.stringify(correctArr);
    } else if (currentChallenge.type === 'interactive_code') {
      correct = isCorrect;
    } else if (currentChallenge.type === 'fill_blank') {
      correct = evaluateAnswer(blankInputValue, currentChallenge.correctAnswer as string);
    } else {
      correct = evaluateAnswer(selectedOption, currentChallenge.correctAnswer as string);
    }

    setIsCorrect(correct);
    setHasChecked(true);

    const submittedAnswer = currentChallenge.type === 'reorder_code'
      ? reorderedItems
      : currentChallenge.type === 'fill_blank'
      ? blankInputValue
      : selectedOption || userCodeInput;

    if (correct) {
      soundEngine.playCorrect(db.profile.soundEnabled);
      addXP(currentChallenge.xpReward);
      recordChallengeAttempt(
        currentChallenge.id,
        activeLessonId || 'boss',
        true,
        timeSpent,
        submittedAnswer
      );
    } else {
      setMistakesInLesson(prev => prev + 1);
      loseHeart();
      recordChallengeAttempt(
        currentChallenge.id,
        activeLessonId || 'boss',
        false,
        timeSpent,
        submittedAnswer
      );
    }
  };

  const isAnswerSelected = currentChallenge.type === 'reorder_code'
    ? reorderedItems.length > 0
    : currentChallenge.type === 'interactive_code'
    ? Boolean(codeRunOutput || selectedOption)
    : currentChallenge.type === 'fill_blank'
    ? Boolean(blankInputValue.trim())
    : Boolean(selectedOption);

  const mascotMood: MascotMood = hasChecked
    ? isCorrect ? 'happy' : 'encouraging'
    : showHint ? 'thinking' : 'idle';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-main)',
      position: 'relative',
      paddingBottom: hasChecked ? '180px' : '90px'
    }}>
      {/* Top Header */}
      <div style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        maxWidth: '820px',
        margin: '0 auto',
        width: '100%'
      }}>
        <button
          onClick={exitLesson}
          title="خروج من الدرس"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex'
          }}
        >
          <X size={26} />
        </button>

        {/* Progress Bar */}
        <div style={{
          flex: 1,
          height: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: '#00e5ff',
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
            borderRadius: '10px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {combo > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            padding: '4px 10px',
            borderRadius: '16px'
          }}>
            <Flame size={16} color="#f97316" className="animate-flame" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f97316' }}>
              x{combo}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Heart size={20} color="#ef4444" fill={db.profile.hearts > 0 ? '#ef4444' : 'none'} />
          <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>
            {db.profile.hearts}
          </span>
        </div>
      </div>

      {/* Challenge Area */}
      <div style={{
        flex: 1,
        maxWidth: '740px',
        margin: '0 auto',
        width: '100%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Horus Mascot Interactive Mood */}
        <HorusMascot mood={mascotMood} size="sm" />

        {/* English Vocabulary Highlight Card */}
        {currentChallenge.englishTerm && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            marginBottom: '16px',
            width: 'fit-content'
          }}>
            <BookOpen size={18} color="#00e5ff" />
            <span style={{ fontWeight: 900, color: '#00e5ff', fontSize: '0.92rem' }}>
              {currentChallenge.englishTerm.term}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              ({currentChallenge.englishTerm.phoneticAr})
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
              = {currentChallenge.englishTerm.meaningAr}
            </span>
          </div>
        )}

        {/* Challenge Question */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#fbbf24',
            backgroundColor: 'rgba(251, 191, 36, 0.12)',
            padding: '4px 10px',
            borderRadius: '12px',
            marginBottom: '8px'
          }}>
            {currentChallenge.titleAr}
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.5 }}>
            {currentChallenge.questionAr}
          </h2>
        </div>

        {/* Code Snippet Box if available */}
        {currentChallenge.codeSnippet && (
          <div className="code-box" style={{ marginBottom: '20px' }}>
            <pre style={{ margin: 0 }}>{currentChallenge.codeSnippet}</pre>
          </div>
        )}

        {/* Starter Code for Code Completion */}
        {currentChallenge.starterCode && currentChallenge.type !== 'interactive_code' && (
          <div className="code-box" style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
            <code>
              {currentChallenge.starterCode.replace('____', selectedOption || '_____')}
            </code>
          </div>
        )}

        {/* Multiple Choice, True/False, Predict, Find Bug, Term Match */}
        {(currentChallenge.type === 'multiple_choice' || currentChallenge.type === 'true_false' || currentChallenge.type === 'code_completion' || currentChallenge.type === 'predict_output' || currentChallenge.type === 'find_bug' || currentChallenge.type === 'term_match') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shuffledOptions.map((opt, optIdx) => {
              const option = opt.value;
              const isSelected = selectedOption === option;
              const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
              const letter = optionLetters[optIdx] || String(optIdx + 1);

              let borderColor = 'rgba(255, 255, 255, 0.08)';
              let bgColor = '#090f24';
              let badgeBg = 'rgba(255, 255, 255, 0.06)';
              let badgeColor = 'var(--text-dim)';

              if (hasChecked) {
                if (evaluateAnswer(option, currentChallenge.correctAnswer as string)) {
                  borderColor = '#10b981';
                  bgColor = 'rgba(16, 185, 129, 0.16)';
                  badgeBg = '#10b981';
                  badgeColor = '#ffffff';
                } else if (isSelected && !isCorrect) {
                  borderColor = '#ef4444';
                  bgColor = 'rgba(239, 68, 68, 0.16)';
                  badgeBg = '#ef4444';
                  badgeColor = '#ffffff';
                }
              } else if (isSelected) {
                borderColor = '#00e5ff';
                bgColor = 'rgba(0, 229, 255, 0.12)';
                badgeBg = '#00e5ff';
                badgeColor = '#030712';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!hasChecked) {
                      setSelectedOption(option);
                      soundEngine.playTap(db.profile.soundEnabled);
                    }
                  }}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    cursor: hasChecked ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: isSelected ? '0 0 16px rgba(0, 229, 255, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-code)',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}>
                      {letter}
                    </div>
                    <span style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {option}
                    </span>
                  </div>

                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid #00e5ff' : '2px solid rgba(255, 255, 255, 0.2)',
                    flexShrink: 0,
                    transition: 'all 0.1s ease'
                  }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Fill Blank / Type Answer Challenge */}
        {currentChallenge.type === 'fill_blank' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="game-card" style={{ padding: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#00e5ff', fontWeight: 700, marginBottom: '8px' }}>
                ✏️ اكتب الإجابة أو الكود الناقص:
              </label>
              <input
                type="text"
                disabled={hasChecked}
                value={blankInputValue}
                onChange={(e) => setBlankInputValue(e.target.value)}
                placeholder="اكتب الإجابة هنا..."
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#030712',
                  border: hasChecked 
                    ? isCorrect ? '2px solid #10b981' : '2px solid #ef4444'
                    : '1px solid var(--border-color)',
                  color: '#38bdf8',
                  fontFamily: 'var(--font-code)',
                  fontSize: '1.1rem',
                  outline: 'none',
                  direction: 'ltr',
                  textAlign: 'left'
                }}
              />
            </div>
          </div>
        )}

        {/* Interactive Code Writing Challenge */}
        {currentChallenge.type === 'interactive_code' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="game-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(0, 229, 255, 0.08)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#00e5ff'
              }}>
                💻 محرر كيميكس التفاعلي — اكتب الكود المطلوب:
              </div>
              <textarea
                value={userCodeInput}
                onChange={(e) => setUserCodeInput(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#040814',
                  color: '#38bdf8',
                  fontFamily: 'var(--font-code)',
                  fontSize: '1rem',
                  border: 'none',
                  outline: 'none',
                  direction: 'ltr',
                  textAlign: 'left'
                }}
              />
              <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--bg-main)' }}>
                <button
                  onClick={handleRunInteractiveCode}
                  className="btn-game btn-kemix-cyan"
                  style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>تنفيذ الكود والتحقق</span>
                </button>
              </div>
            </div>

            {/* Execution Output Preview */}
            {codeRunOutput !== null && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#02050e',
                border: codeRunError ? '1px solid #ef4444' : '1px solid #10b981',
                fontFamily: 'var(--font-code)',
                fontSize: '0.9rem',
                direction: 'ltr',
                textAlign: 'left'
              }}>
                <div style={{ color: codeRunError ? '#ef4444' : '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                  {codeRunError ? '❌ Error:' : '✓ Output:'}
                </div>
                <div style={{ color: '#f8fafc' }}>{codeRunError || codeRunOutput}</div>
              </div>
            )}
          </div>
        )}

        {/* Reorder Code Renderer */}
        {currentChallenge.type === 'reorder_code' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
              استخدم الأسهم لتحريك الأسطر إلى الترتيب البرمجي الصحيح:
            </p>
            {reorderedItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  direction: 'ltr'
                }}
              >
                <code style={{ fontSize: '0.98rem', color: '#38bdf8' }}>
                  {item}
                </code>

                {!hasChecked && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      style={{
                        padding: '6px',
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: idx === 0 ? 'var(--text-dim)' : 'var(--text-main)',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === reorderedItems.length - 1}
                      style={{
                        padding: '6px',
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: idx === reorderedItems.length - 1 ? 'var(--text-dim)' : 'var(--text-main)',
                        cursor: idx === reorderedItems.length - 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <div 
            className="animate-pop"
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              color: '#fbbf24',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}
          >
            💡 <strong>تلميح الصقر حورس:</strong> {currentChallenge.hintAr}
          </div>
        )}
      </div>

      {/* Feedback Drawer */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: hasChecked 
          ? isCorrect ? 'rgba(6, 78, 59, 0.95)' : 'rgba(127, 29, 29, 0.95)'
          : 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderTop: hasChecked 
          ? isCorrect ? '2px solid #10b981' : '2px solid #ef4444'
          : '1px solid var(--border-color)',
        padding: '18px 24px',
        zIndex: 50,
        transition: 'background-color 0.25s ease'
      }}>
        <div style={{
          maxWidth: '740px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {hasChecked && (
            <div className="animate-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {isCorrect ? (
                <CheckCircle2 size={32} color="#10b981" style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={32} color="#ef4444" style={{ flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>
                  {isCorrect ? '🎉 رائع جداً! إجابة دقيقة!' : '❌ لا بأس! أوشكت على الوصول'}
                </div>
                <div style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {currentChallenge.explanationAr}
                </div>
                {!isCorrect && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.25)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    color: '#fecaca',
                    fontWeight: 700
                  }}>
                    <span>💡 الحل الصحيح: </span>
                    <code style={{ direction: 'ltr', display: 'inline-block', color: '#ffffff', backgroundColor: '#020617', padding: '2px 8px', borderRadius: '4px', margin: '0 4px' }}>
                      {Array.isArray(currentChallenge.correctAnswer) ? currentChallenge.correctAnswer.join(' ➔ ') : String(currentChallenge.correctAnswer)}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            {!hasChecked ? (
              <button
                onClick={() => setShowHint(prev => !prev)}
                className="btn-game btn-outline"
                style={{ padding: '12px 18px' }}
                title="طلب تلميح مساعد"
              >
                <Lightbulb size={18} color="#fbbf24" />
                <span>تلميح</span>
              </button>
            ) : <div />}

            <button
              onClick={handleCheck}
              disabled={!isAnswerSelected}
              className={`btn-game ${
                hasChecked 
                  ? isCorrect ? 'btn-green' : 'btn-kemix-gold'
                  : 'btn-kemix-cyan'
              }`}
              style={{
                flex: hasChecked ? 1 : 'none',
                minWidth: '180px',
                padding: '14px 28px',
                fontSize: '1.05rem'
              }}
            >
              <span>{hasChecked ? 'استمر' : 'تحقق من الإجابة'}</span>
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonScreen;
