import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShopItem } from '../types';
import { Coins, Check, Sparkles, Shield, Heart, Flame, ArrowLeft, History, ShoppingBag, Eye } from 'lucide-react';
import HorusMascot from '../components/HorusMascot';
import { trackEvent } from '../services/analyticsService';

export const ShopScreen: React.FC = () => {
  const { db, shopItems, buyShopItem, equipItem, navigateTo } = useGame();
  const { profile, coinTransactions } = db;

  const [activeCategory, setActiveCategory] = useState<'all' | 'avatar' | 'frame' | 'freeze' | 'hearts'>('all');
  const [purchaseNotice, setPurchaseNotice] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredItems = shopItems.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleBuy = (item: ShopItem) => {
    // تتبع فوري للنقر على زر الشراء
    trackEvent('shop_buy_click', {
      screen: 'shop',
      userId: profile.id,
      userName: profile.name,
      amount: item.price,
      details: {
        itemId: item.id,
        itemTitle: item.titleAr,
        price: item.price,
        currentCoins: profile.coins
      }
    });

    const res = buyShopItem(item);
    setPurchaseNotice({ message: res.message, isSuccess: res.success });
    setTimeout(() => {
      setPurchaseNotice(null);
    }, 4000);
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item);
    setPurchaseNotice({ message: `تم تفعيل ${item.titleAr} على ملفك الشخصي بنجاح!`, isSuccess: true });
    setTimeout(() => {
      setPurchaseNotice(null);
    }, 3000);
  };

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <ShoppingBag size={24} />
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-main)' }}>
              متجر كيميكس للمكافآت والمظاهر
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
            استبدل عملاتك الافتراضية بمظاهر الصقر حورس، وإطارات مشعة، وتجميد الشعلة لحماية تقدمك!
          </p>
        </div>

        <HorusMascot size="sm" mood="happy" speechText="كل عملة تجمعها هي مكافأة لجهدك البرمجي! اختر مظهرك المفضل!" />
      </div>

      {/* Currency Balance & Transactions Hero */}
      <div 
        className="game-card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.16), rgba(11, 19, 41, 0.95))',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #fbbf24, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(251, 191, 36, 0.4)'
          }}>
            <Coins size={32} color="#070d1e" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>رصيدك المتاح حالياً</div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ffffff' }}>
              {profile.coins} <span style={{ fontSize: '1.1rem', color: '#fbbf24' }}>عملة كيميكس 🪙</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowHistory(prev => !prev)}
            className="btn-game btn-outline"
            style={{ padding: '10px 16px', fontSize: '0.88rem' }}
          >
            <History size={16} />
            <span>سجل العملات</span>
          </button>
          <button
            onClick={() => navigateTo('learn')}
            className="btn-game btn-kemix-gold"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <Sparkles size={16} />
            <span>حصد المزيد من العملات</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {purchaseNotice && (
        <div 
          className="animate-pop"
          style={{
            marginBottom: '20px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: purchaseNotice.isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${purchaseNotice.isSuccess ? '#10b981' : '#ef4444'}`,
            color: purchaseNotice.isSuccess ? '#10b981' : '#ef4444',
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{purchaseNotice.message}</span>
          <button
            onClick={() => setPurchaseNotice(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Coin Transactions History Drawer */}
      {showHistory && (
        <div 
          className="game-card animate-pop"
          style={{
            padding: '20px',
            marginBottom: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              📜 سجل حركات العملات والمكافآت
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="btn-game btn-outline"
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            >
              إغلاق السجل
            </button>
          </div>

          {!coinTransactions || coinTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px', fontSize: '0.9rem' }}>
              لا توجد معاملات مسجلة حتى الآن. أكمل الدروس وابدأ بإنفاق عملاتك!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {[...coinTransactions].reverse().map(tx => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      color: tx.type === 'earn' ? '#10b981' : '#ef4444',
                      fontWeight: 800,
                      fontSize: '1rem'
                    }}>
                      {tx.type === 'earn' ? '+ ' : '- '}
                    </span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{tx.reasonAr}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontWeight: 800,
                      color: tx.type === 'earn' ? '#10b981' : '#ef4444'
                    }}>
                      {tx.amount} 🪙
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {new Date(tx.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Tabs matching Reference Board Screen 11 */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'all', label: 'الكل' },
          { id: 'avatar', label: 'المظهر (الأزياء والدروع)' },
          { id: 'freeze', label: 'الإضافية (القلوب والتجميد)' },
          { id: 'history', label: 'العمليات والسجل' }
        ].map(cat => {
          const isActive = (cat.id === 'history' && showHistory) || (activeCategory === cat.id && !showHistory);
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'history') {
                  setShowHistory(true);
                } else {
                  setShowHistory(false);
                  setActiveCategory(cat.id as any);
                }
              }}
              style={{
                padding: '11px 22px',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '2px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: isActive ? 'rgba(0, 229, 255, 0.15)' : '#070d1e',
                color: isActive ? '#00e5ff' : 'var(--text-muted)',
                fontWeight: isActive ? 900 : 700,
                fontSize: '0.94rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 0 14px rgba(0, 229, 255, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '18px'
      }}>
        {filteredItems.map(item => {
          const isOwned = Boolean(
            (item.category === 'avatar' || item.category === 'frame') &&
            profile.inventory?.includes(item.id)
          );

          const isEquipped = Boolean(
            (item.category === 'avatar' && profile.avatar === item.icon) ||
            (item.category === 'frame' && profile.equippedFrame === item.id)
          );

          const canAfford = profile.coins >= item.price;

          return (
            <div
              key={item.id}
              className="game-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isEquipped 
                  ? '2px solid #00e5ff' 
                  : isOwned 
                  ? '1px solid rgba(16, 185, 129, 0.4)' 
                  : '1px solid var(--border-color)',
                boxShadow: isEquipped ? '0 0 16px rgba(0, 229, 255, 0.2)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isEquipped && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#00e5ff',
                  color: '#070d1e',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  مُفعّل حالياً ✓
                </div>
              )}

              <div>
                {/* Icon Presentation */}
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.4rem',
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
                }}>
                  {item.icon}
                </div>

                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  {item.titleAr}
                </h3>

                <p style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  minHeight: '40px',
                  marginBottom: '16px'
                }}>
                  {item.descriptionAr}
                </p>
              </div>

              {/* Action Buttons */}
              <div>
                {isOwned ? (
                  isEquipped ? (
                    <button
                      disabled
                      className="btn-game btn-outline"
                      style={{ width: '100%', padding: '10px', opacity: 0.8, cursor: 'default' }}
                    >
                      <Check size={16} color="#00e5ff" />
                      <span>قيد الاستخدام</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEquip(item)}
                      className="btn-game btn-kemix-cyan"
                      style={{ width: '100%', padding: '10px' }}
                    >
                      <Eye size={16} />
                      <span>تفعيل على ملفي</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`btn-game ${canAfford ? 'btn-kemix-gold' : 'btn-outline'}`}
                    style={{
                      width: '100%',
                      padding: '10px',
                      opacity: canAfford ? 1 : 0.6,
                      cursor: canAfford ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <span>شراء مقابل {item.price} 🪙</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopScreen;
