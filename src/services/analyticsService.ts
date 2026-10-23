/**
 * KEMIX Analytics & Event Tracking Engine
 * Decoupled integration with Google Sheets via Google Apps Script Web App
 */

export interface AnalyticsEventPayload {
  timestamp: string;
  event: string;
  userId?: string;
  userName?: string;
  plan?: string;
  cycle?: string;
  amount?: number;
  paymentMethod?: string;
  screen?: string;
  funnelStep?: string;
  eventGroup?: string;
  details?: Record<string, any>;
  url?: string;
  userAgent?: string;
}

const STORAGE_KEY_URL = 'kemix_analytics_apps_script_url';

// رابط Google Apps Script الافتراضي المُعدَّ مسبقاً
const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_Px6yTL5sB8Ye8cmMLZG4k_JWtb_axfqDAeCLKAzAXOf09bzefprcWBGn9yFEYU6_/exec';

export const getAnalyticsScriptUrl = (): string => {
  const customUrl = localStorage.getItem(STORAGE_KEY_URL);
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }
  // استخدم الرابط الافتراضي إذا لم يكن هناك رابط مخصص
  return (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) || DEFAULT_APPS_SCRIPT_URL;
};

export const setAnalyticsScriptUrl = (url: string): void => {
  if (!url || !url.trim()) {
    localStorage.removeItem(STORAGE_KEY_URL);
  } else {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  }
};

/**
 * Sends an event to Google Apps Script Web App.
 * Uses `mode: 'no-cors'` and `Content-Type: text/plain` to prevent browser CORS blockages.
 */
export const trackEvent = async (
  eventName: string,
  extra: Partial<AnalyticsEventPayload> = {}
): Promise<boolean> => {
  const scriptUrl = getAnalyticsScriptUrl();

  const payload: AnalyticsEventPayload = {
    timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
    event: eventName,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    ...extra
  };

  // Always log locally for debugging and offline audit
  console.log(`[KEMIX Analytics] 📊 Event tracked: ${eventName}`, payload);

  if (!scriptUrl) {
    // If not configured yet, silently pass
    return false;
  }

  // Send to Google Apps Script via fetch (keepalive ensures delivery even during navigation)
  try {
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('[KEMIX Analytics] Background fetch failed:', err);
    });

    return true;
  } catch (err) {
    console.warn('[KEMIX Analytics] Failed to send event to Google Apps Script:', err);
    return false;
  }
};

/**
 * Tracks payment button clicks specifically
 */
export const trackPaymentClick = (
  step: 'plan_selected' | 'payment_executed' | 'org_quote_requested' | 'paywall_click',
  data: {
    plan?: string;
    cycle?: string;
    amount?: number;
    paymentMethod?: string;
    userId?: string;
    userName?: string;
  }
) => {
  return trackEvent(step, {
    ...data,
    funnelStep: step,
    eventGroup: 'payment',
    details: {
      funnelStep: step,
      ...data
    }
  });
};

/**
 * Tracks page / screen views
 */
export const trackScreenView = (screenName: string, userId?: string, userName?: string) => {
  return trackEvent('screen_view', {
    screen: screenName,
    userId,
    userName,
    details: { screen: screenName }
  });
};

/**
 * Tests connection with Google Apps Script
 */
export const testAnalyticsConnection = async (testUrl?: string): Promise<{ success: boolean; message: string }> => {
  const targetUrl = testUrl || getAnalyticsScriptUrl();
  if (!targetUrl) {
    return { success: false, message: 'لم يتم إدخال رابط Google Apps Script Web App بعد.' };
  }

  try {
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({
        timestamp: new Date().toLocaleString('ar-EG'),
        event: 'test_ping',
        userName: 'مشرف كيميكس',
        details: { message: 'تجربة اتصال ناجحة مع Google Sheets' }
      })
    });
    return { success: true, message: 'تم إرسال إشارة الاختبار إلى الشيت بنجاح! تحقق من صفحة Google Sheets الآن.' };
  } catch (err: any) {
    return { success: false, message: `فشل الاتصال: ${err?.message || 'خطأ غير معروف'}` };
  }
};
