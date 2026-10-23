/**
 * =========================================================================
 * كود Google Apps Script لربط تطبيق KEMIX بـ Google Sheets
 * لتسجيل ضغطات زر الدفع وتتبع تفاعلات المستخدمين في الموقع
 * =========================================================================
 * 
 * طريقة التركيب والاستخدام:
 * 1. افتح Google Sheets وأنشئ شيت جديد باسم "KEMIX Analytics".
 * 2. من القائمة العلوية اضغط على: ملحقات (Extensions) > Apps Script.
 * 3. احذف أي كود موجود والصق هذا الكود كاملاً.
 * 4. اضغط على زر "Deploy" (نشر) بالأعلى جهة اليمين > New deployment (نشر جديد).
 * 5. اختر نوع النشر: Web app (تطبيق ويب).
 * 6. اضبط الإعدادات التالية:
 *    - Description: KEMIX Analytics Webhook
 *    - Execute as: Me (أنا - بحسابك)
 *    - Who has access: Anyone (أي شخص - لكي يستقبل الموقع البيانات دون تسجيل دخول)
 * 7. اضغط Deploy وانسخ رابط Web App URL الناتج وضعه في إعدادات التطبيق.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateEventsSheet(ss);
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = { raw: e.postData.contents };
      }
    }

    var timestamp = data.timestamp || new Date().toLocaleString('ar-EG');
    var eventType = data.event || 'action';
    var userName = data.userName || data.userId || 'زائر';
    var plan = data.plan || (data.details ? data.details.plan : '') || '';
    var cycle = data.cycle || (data.details ? data.details.cycle : '') || '';
    var amount = data.amount || (data.details ? data.details.amount : '') || '';
    var paymentMethod = data.paymentMethod || (data.details ? data.details.paymentMethod : '') || '';
    var screen = data.screen || (data.details ? data.details.screen : '') || '';
    var details = data.details ? JSON.stringify(data.details) : '';
    var url = data.url || '';

    // ترجمة وتوضيح اسم الحدث لسهولة القراءة
    var eventDisplay = eventType;
    if (eventType === 'plan_selected' || eventType === 'payment_click' || eventType === 'checkout_start') {
      eventDisplay = '💳 نقر على زر الدفع / اختيار الخطة';
    } else if (eventType === 'payment_executed') {
      eventDisplay = '✅ تأكيد وإتمام الدفع والاشتراك';
    } else if (eventType === 'paywall_click') {
      eventDisplay = '🔒 محاولة فتح محتوى مقفول (Paywall)';
    } else if (eventType === 'org_quote_requested') {
      eventDisplay = '🏢 طلب عرض سعر مؤسسات';
    } else if (eventType === 'screen_view') {
      eventDisplay = '👁️ تصفح شاشة';
    } else if (eventType === 'lesson_complete') {
      eventDisplay = '🎓 إكمال درس';
    } else if (eventType === 'shop_purchase' || eventType === 'shop_buy_click') {
      eventDisplay = '🛒 شراء من المتجر';
    } else if (eventType === 'manual_admin_test' || eventType === 'test_ping') {
      eventDisplay = '⚡ تجربة من لوحة الإدارة';
    }

    // إضافة الصف للشيت
    sheet.appendRow([
      timestamp,
      eventDisplay,
      userName,
      plan,
      cycle === 'annual' ? 'سنوي' : (cycle === 'monthly' ? 'شهري' : cycle),
      amount ? amount + ' ج.م' : '',
      paymentMethod,
      screen,
      details,
      url
    ]);

    // تحديث لوحة الملخص
    updateDashboardSummary(ss);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', eventRecorded: eventDisplay }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'KEMIX Analytics Webhook is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * إنشاء شيت الأحداث وتنسيق الأعمدة إذا كان جديداً
 */
function getOrCreateEventsSheet(ss) {
  var sheetName = 'سجل التفاعلات (Events)';
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [
      'التاريخ والوقت',
      'نوع الحدث',
      'اسم المستخدم',
      'الخطة المختارة',
      'الدورة (شهري/سنوي)',
      'المبلغ (ج.م)',
      'طريقة الدفع',
      'الشاشة الحالية',
      'التفاصيل الفنية (JSON)',
      'رابط الصفحة'
    ];
    sheet.appendRow(headers);
    
    // تنسيق الهيدر بالألوان
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#0b142c');
    headerRange.setFontColor('#fbbf24');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    sheet.setFrozenRows(1);
    
    // ضبط اتجاه الشيت من اليمين لليسار
    sheet.setRightToLeft(true);
  }
  return sheet;
}

/**
 * تحديث لوحة الإحصائيات المباشرة
 */
function updateDashboardSummary(ss) {
  var dashName = 'لوحة الإحصائيات (Summary)';
  var dash = ss.getSheetByName(dashName);
  
  if (!dash) {
    dash = ss.insertSheet(dashName, 0);
    dash.setRightToLeft(true);
  }

  dash.getRange('A1:B10').clear();

  dash.getRange('A1').setValue('📊 لوحة تحكم ومؤشرات KEMIX').setFontWeight('bold').setFontSize(14).setFontColor('#00e5ff');
  dash.getRange('A2').setValue('آخر تحديث:').setFontWeight('bold');
  dash.getRange('B2').setValue(new Date().toLocaleString('ar-EG'));

  dash.getRange('A4').setValue('💳 إجمالي النقرات على الاشتراك والدفع:').setFontWeight('bold');
  dash.getRange('B4').setFormula('=COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*دفع*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*اشتراك*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*خطة*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*payment*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*plan*")');

  dash.getRange('A5').setValue('👁️ إجمالي زيارات وتصفح الشاشات:').setFontWeight('bold');
  dash.getRange('B5').setFormula('=COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*تصفح*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*screen*")');

  dash.getRange('A6').setValue('🎓 إجمالي الدروس المكتملة:').setFontWeight('bold');
  dash.getRange('B6').setFormula('=COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*درس*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*lesson*")');

  dash.getRange('A7').setValue('🛒 إجمالي المشتريات من المتجر:').setFontWeight('bold');
  dash.getRange('B7').setFormula('=COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*متجر*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*شراء*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*shop*")');

  dash.getRange('A8').setValue('🔒 محاولات الوصول المقفول (Paywall):').setFontWeight('bold');
  dash.getRange('B8').setFormula('=COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*مقفول*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*Paywall*")');

  dash.getRange('A9').setValue('🏢 طلبات المؤسسات والمدارس:').setFontWeight('bold');
  dash.getRange('B9').setFormula('=COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*مؤسسات*") + COUNTIF(\'سجل التفاعلات (Events)\'!B:B, "*org*")');

  dash.getRange('A4:B9').setBackground('#f8fafc').setBorder(true, true, true, true, true, true);
  dash.getRange('B4:B9').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
}
