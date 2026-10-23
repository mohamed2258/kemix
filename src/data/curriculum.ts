import { CurriculumData, Achievement } from '../types';

export const initialCurriculum: CurriculumData = {
  version: 2,
  lastUpdated: '2026-10-21',
  worlds: [
    {
      id: 'world_logic',
      titleAr: 'عالم التفكير المنطقي والخوارزميات',
      titleEn: 'Logic & Algorithms',
      descriptionAr: 'ابدأ من نقطة الصفر وتعلّم كيف يفكر المبرمج، وكيف تحلل المشاكل إلى خطوات خوارزمية دقيقة.',
      icon: '🧠',
      order: 1,
      themeColor: '#00e5ff',
      accentGradient: 'linear-gradient(135deg, #00e5ff, #0891b2)',
      requiredLevelToUnlock: 1,
      units: [
        {
          id: 'unit_algo_basics',
          worldId: 'world_logic',
          titleAr: 'الوحدة 1: ما هي الخوارزمية؟',
          descriptionAr: 'فهم خطوات الحل المنطقي وتسلسل الأوامر.',
          order: 1,
          lessons: [
            {
              id: 'lesson_algo_1',
              unitId: 'unit_algo_basics',
              worldId: 'world_logic',
              titleAr: 'مفهوم الخوارزمية (Algorithm)',
              descriptionAr: 'كيف تترجم الفكرة إلى خطوات مرتبة يفهمها الحاسوب.',
              order: 1,
              englishFocusTerm: 'Algorithm',
              conceptIntroAr: 'الخوارزمية (Algorithm) سميت نسبة للعالم المسلم الخوارزمي، وهي ببساطة مجموعة من الخطوات المنطقية المرتبة لحل مشكلة معينة، خطوة بخطوة.',
              xpReward: 30,
              coinReward: 10,
              challenges: [
                {
                  id: 'c_alg_1',
                  type: 'multiple_choice',
                  titleAr: 'تعريف الخوارزمية',
                  questionAr: 'ما هو التعريف الدقيق للخوارزمية (Algorithm) في علوم الحاسوب؟',
                  options: [
                    'مجموعة من الخطوات المنطقية المتسلسلة لحل مسألة محددة',
                    'قطعة إلكترونية داخل القرص الصلب',
                    'شاشة الحاسوب عند تشغيل لعبة',
                    'بريد إلكتروني يُرسل للمستخدم'
                  ],
                  correctAnswer: 'مجموعة من الخطوات المنطقية المتسلسلة لحل مسألة محددة',
                  explanationAr: 'رائع جداً! الخوارزمية هي قلب أي برنامج؛ تبدأ بمدخلات وتطبق خطوات مرتبة للوصول للمخرجات المطلوبة.',
                  hintAr: 'تذكر وصفة الطبخ: خطوات مرقمة وواضحة لتحقيق نتيجة معينة.',
                  englishTerm: { term: 'Algorithm', phoneticAr: 'ألجوريثم', meaningAr: 'خوارزمية / خطوات حل المسألة' },
                  xpReward: 10,
                  coinReward: 5
                },
                {
                  id: 'c_alg_2',
                  type: 'true_false',
                  titleAr: 'ترتيب التعليمات',
                  questionAr: 'هل تغيير ترتيب خطوات الخوارزمية يمكن أن يؤدي إلى نتيجة خاطئة أو غير متوقعة؟',
                  options: ['صح (True)', 'خطأ (False)'],
                  correctAnswer: 'صح (True)',
                  explanationAr: 'صحيح 100%! الترتيب أمر جوهري. لو وضعنا خطوة "تقديم الشاي" قبل "غلي الماء"، ستفشل العملية كلها!',
                  hintAr: 'فكر هل يمكن ارتداء الحذاء قبل ارتداء الجوارب؟ الترتيب حاسم.',
                  englishTerm: { term: 'Sequence', phoneticAr: 'سيكوينس', meaningAr: 'التسلسل والترتيب' },
                  xpReward: 10,
                  coinReward: 5
                },
                {
                  id: 'c_alg_3',
                  type: 'reorder_code',
                  titleAr: 'ترتيب خطوات خوارزمية تسجيل الدخول',
                  questionAr: 'رتب خطوات خوارزمية تسجيل الدخول (Login Algorithm) بالترتيب المنطقي الصحيح:',
                  options: [
                    'التحقق من صحة كلمة المرور المدخلة',
                    'طلب اسم المستخدم وكلمة المرور من اللاعب',
                    'السماح للاعب بالدخول وعرض الشاشة الرئيسية'
                  ],
                  correctAnswer: [
                    'طلب اسم المستخدم وكلمة المرور من اللاعب',
                    'التحقق من صحة كلمة المرور المدخلة',
                    'السماح للاعب بالدخول وعرض الشاشة الرئيسية'
                  ],
                  explanationAr: 'أحسنت الترتيب! إدخال البيانات أولاً، ثم مطابقتها، ثم اتخاذ القرار بالسماح بالدخول.',
                  hintAr: 'لا يمكن التحقق من كلمة المرور قبل أن يكتبها المستخدم!',
                  englishTerm: { term: 'Authentication', phoneticAr: 'أوثنتيكيشن', meaningAr: 'التحقق والمصادقة' },
                  xpReward: 15,
                  coinReward: 8
                },
                {
                  id: 'c_alg_4',
                  type: 'term_match',
                  titleAr: 'توصيل المصطلحات التقنية',
                  questionAr: 'صل كل مصطلح برمجي إنجليزي بمعناه العربي الدقيق:',
                  termPairs: [
                    { en: 'Algorithm', ar: 'خطوات الحل المرتبة' },
                    { en: 'Input', ar: 'المدخلات' },
                    { en: 'Output', ar: 'المخرجات والنتيجة' }
                  ],
                  options: ['Algorithm: خطوات الحل المرتبة', 'Input: المدخلات', 'Output: المخرجات والنتيجة'],
                  correctAnswer: 'Algorithm: خطوات الحل المرتبة',
                  explanationAr: 'مذهل! حفظ المصطلحات الإنجليزية الأساسية يجعلك تقرأ وتفهم مراجع البرمجة العالمية بسهولة.',
                  hintAr: 'Input تعني ما يدخل للنظام، وOutput ما يخرج منه.',
                  xpReward: 15,
                  coinReward: 8
                },
                {
                  id: 'c_alg_5',
                  type: 'multiple_choice',
                  titleAr: 'المدخلات والمخرجات (I/O)',
                  questionAr: 'في برنامج آلة حاسبة تجمع رقمين: ما هي المدخلات (Inputs)؟',
                  options: [
                    'الرقمان اللذان يدخلهما المستخدم',
                    'ناتج عملية الجمع النهائية',
                    'صوت النقر على لوحة المفاتيح',
                    'سعر جهاز الحاسوب'
                  ],
                  correctAnswer: 'الرقمان اللذان يدخلهما المستخدم',
                  explanationAr: 'إجابة دقيقة! الرقمان هما المدخلات (Inputs)، والعملية هي الجمع (+)، والنتيجة هي المخرجات (Output).',
                  hintAr: 'المدخل هو ما يحتاجه البرنامج ليبدأ عمله.',
                  englishTerm: { term: 'Input / Output (I/O)', phoneticAr: 'إنبوت / أوتبوت', meaningAr: 'المدخلات والمخرجات' },
                  xpReward: 10,
                  coinReward: 5
                }
              ]
            }
          ]
        }
      ],
      bossChallenge: {
        id: 'boss_logic',
        type: 'reorder_code',
        titleAr: '👑 معركة زعيم عالم المنطق: محرك حورس الذكي',
        questionAr: 'اهزم زعيم عالم المنطق عبر ترتيب الخوارزمية الكاملة لحساب نقاط فوز اللاعب وترقيته للمستوى التالي:',
        options: [
          '# 1. استقبال نقاط الجولة',
          'points = 100',
          '# 2. احتساب مكافأة الصقر',
          'bonus = points * 2',
          '# 3. إعلان الترقية للعالم التالي',
          'print("مبروك الفوز يا بطل! مجموع النقاط:", bonus)'
        ],
        correctAnswer: [
          '# 1. استقبال نقاط الجولة',
          'points = 100',
          '# 2. احتساب مكافأة الصقر',
          'bonus = points * 2',
          '# 3. إعلان الترقية للعالم التالي',
          'print("مبروك الفوز يا بطل! مجموع النقاط:", bonus)'
        ],
        explanationAr: '🦅 أسطوري! صقر كيميكس حورس يحييك على قهر زعيم عالم المنطق وفتح العالم الثاني!',
        hintAr: 'البداية باستقبال النقاط، ثم حساب المكافأة، وأخيراً طباعة رسالة الفوز.',
        xpReward: 100,
        coinReward: 50
      }
    },
    {
      id: 'world_python_basics',
      titleAr: 'عالم أساسيات بايثون والكود',
      titleEn: 'Python Programming Basics',
      descriptionAr: 'انتقل من النظريات إلى التطبيق الفعلي واكتب أول أكواد حقيقية بلغة بايثون العالمية.',
      icon: '🐍',
      order: 2,
      themeColor: '#fbbf24',
      accentGradient: 'linear-gradient(135deg, #fbbf24, #d97706)',
      requiredLevelToUnlock: 2,
      units: [
        {
          id: 'unit_py_print',
          worldId: 'world_python_basics',
          titleAr: 'الوحدة 1: شاشة العرض ودالة الطباعة',
          descriptionAr: 'التواصل مع المستخدم عبر دالة print() وعرض الأرقام والنصوص.',
          order: 1,
          lessons: [
            {
              id: 'lesson_py_1',
              unitId: 'unit_py_print',
              worldId: 'world_python_basics',
              titleAr: 'أمر الطباعة print() في بايثون',
              descriptionAr: 'إرسال الرسائل والنصوص إلى شاشة الطرفية.',
              order: 1,
              englishFocusTerm: 'Print Function',
              conceptIntroAr: 'الدالة (Function) هي أداة تؤدي عملاً محدداً. الدالة print() هي الأمر الأساسي الذي نستخدمه في بايثون لعرض النصوص والمخرجات على الشاشة (Console).',
              xpReward: 30,
              coinReward: 10,
              challenges: [
                {
                  id: 'c_py_1_1',
                  type: 'code_completion',
                  titleAr: 'طباعة نص ترحيبي',
                  questionAr: 'أكمل الكود لعرض العبارة الترحيبية على الشاشة:',
                  starterCode: '____("مرحباً بك في كيميكس")',
                  options: ['print', 'show', 'write', 'display'],
                  correctAnswer: 'print',
                  explanationAr: 'ممتاز! print هي الدالة القياسية المعتمدة في لغة بايثون للطباعة على الطرفية.',
                  hintAr: 'تبدأ بحرف p بالإنجليزية وتعني اطبع.',
                  englishTerm: { term: 'Function', phoneticAr: 'فانكشن', meaningAr: 'دالة برمجية تؤدي مهمة محددة' },
                  xpReward: 10,
                  coinReward: 5
                },
                {
                  id: 'c_py_1_2',
                  type: 'predict_output',
                  titleAr: 'حساب المعادلات داخل print',
                  questionAr: 'ما هو الناتج الذي ستعرضه الشاشة بعد تنفيذ هذا السطر البرمجي؟',
                  codeSnippet: 'print(10 + 5)',
                  options: ['15', '10 + 5', '105', 'خطأ في الكود'],
                  correctAnswer: '15',
                  explanationAr: 'رائع! بما أنه لا توجد علامات تنصيص، يقوم مفسر بايثون بحساب العملية الرياضية (10 + 5 = 15) أولاً ثم يطبع الناتج.',
                  hintAr: 'بدون علامات تنصيص، تعامل بايثون 10 + 5 كعملية جمع حسابية.',
                  englishTerm: { term: 'Expression', phoneticAr: 'إكسبريشن', meaningAr: 'تعبير برمجي أو عملية حسابية' },
                  xpReward: 10,
                  coinReward: 5
                },
                {
                  id: 'c_py_1_3',
                  type: 'find_bug',
                  titleAr: 'اكتشف الخطأ النحوي (Syntax Bug)',
                  questionAr: 'ما هو الخطأ في هذا السطر البرمجي؟',
                  codeSnippet: 'print("أنا أتعلم البرمجة\')',
                  options: [
                    'علامات التنصيص غير متطابقة (بدأ بـ " وانتهى بـ \')',
                    'اسم الدالة print مكتوب بخطأ',
                    'لا يمكن كتابة نصوص عربية داخل بايثون',
                    'الكود سليم تماماً'
                  ],
                  correctAnswer: 'علامات التنصيص غير متطابقة (بدأ بـ " وانتهى بـ \')',
                  explanationAr: 'صحيح! هذا يسمى SyntaxError؛ يجب دائماً مطابقة علامة بداية النص مع علامة نهايته.',
                  hintAr: 'انظر لأول علامة تنصيص وآخر علامة تنصيص.',
                  englishTerm: { term: 'Syntax Error', phoneticAr: 'سينتاكس إيرور', meaningAr: 'خطأ في قواعد كتابة اللغة البرمجية' },
                  xpReward: 15,
                  coinReward: 8
                },
                {
                  id: 'c_py_1_4',
                  type: 'interactive_code',
                  titleAr: 'محرر الأكواد التفاعلي: اكتب كودك الأول',
                  questionAr: 'اكتب في المحرر كود بايثون يطبع جملة: print("Kemix") ثم اضغط على زر تشغيل الكود وتأكد من النتيجة:',
                  starterCode: 'print("Kemix")',
                  correctAnswer: 'Kemix',
                  testCases: [
                    { descriptionAr: 'يجب أن يطبع الكلمة Kemix على الشاشة بدقة', expectedOutput: 'Kemix' }
                  ],
                  explanationAr: 'مذهل! لقد قمت للتو بكتابة وتنفيذ أول كود برمجي فعلي على منصة كيميكس!',
                  hintAr: 'اكتب print("Kemix") بالإنجليزية بدقة.',
                  englishTerm: { term: 'Code Execution', phoneticAr: 'كود إكسيكيوشن', meaningAr: 'تنفيذ وتشغيل الكود' },
                  xpReward: 20,
                  coinReward: 10
                }
              ]
            }
          ]
        }
      ],
      bossChallenge: {
        id: 'boss_py_basics',
        type: 'interactive_code',
        titleAr: '🐉 معركة الزعيم: برنامج بطاقة المبرمج',
        questionAr: 'قم بكتابة كود بايثون يطبع جملة: print("Falcon Horus") لتوثيق فوزك بالزعيم:',
        starterCode: 'print("Falcon Horus")',
        correctAnswer: 'Falcon Horus',
        testCases: [
          { descriptionAr: 'طباعة Falcon Horus', expectedOutput: 'Falcon Horus' }
        ],
        explanationAr: '👑 قاهر الزعماء! تم فتح عالم المتغيرات ورفع مستواك بنجاح!',
        hintAr: 'اكتب print("Falcon Horus")',
        xpReward: 100,
        coinReward: 50
      }
    },
    {
      id: 'world_variables',
      titleAr: 'عالم المتغيرات وأنواع البيانات',
      titleEn: 'Variables & Data Types',
      descriptionAr: 'اكتشف كيف تحتفظ البرامج بالمعلومات في الذاكرة: الأرقام والنصوص والقيم المنطقية.',
      icon: '📦',
      order: 3,
      themeColor: '#10b981',
      accentGradient: 'linear-gradient(135deg, #10b981, #059669)',
      requiredLevelToUnlock: 3,
      units: [
        {
          id: 'unit_vars_concept',
          worldId: 'world_variables',
          titleAr: 'الوحدة 1: صناديق الذاكرة',
          descriptionAr: 'تسمية المتغيرات وتخزين القيم وقراءتها.',
          order: 1,
          lessons: [
            {
              id: 'lesson_var_1',
              unitId: 'unit_vars_concept',
              worldId: 'world_variables',
              titleAr: 'المتغيرات (Variables) في بايثون',
              descriptionAr: 'تخزين الأسماء والدرجات وتعديلها.',
              order: 1,
              englishFocusTerm: 'Variable',
              conceptIntroAr: 'المتغير (Variable) هو مساحة محجوزة في ذاكرة الجهاز نعطيها اسماً ونضع بداخلها قيمة لاستخدامها في أي مكان بالبرنامج.',
              xpReward: 30,
              coinReward: 10,
              challenges: [
                {
                  id: 'c_var_1',
                  type: 'code_completion',
                  titleAr: 'إنشاء متغير وتعيين القيمة',
                  questionAr: 'أكمل الكود لحفظ نقاط اللاعب 50 داخل المتغير score:',
                  starterCode: 'score ____ 50',
                  options: ['=', '==', '->', ':'],
                  correctAnswer: '=',
                  explanationAr: 'أحسنت! علامة = تسمى معامل الإسناد (Assignment Operator) وتأخذ القيمة من اليمين وتضعها في المتغير على اليسار.',
                  hintAr: 'علامة المساواة الواحدة هي المستخدمة لتعيين المتغيرات.',
                  englishTerm: { term: 'Variable', phoneticAr: 'فاريابل', meaningAr: 'متغير / صندوق تخزين في الذاكرة' },
                  xpReward: 10,
                  coinReward: 5
                },
                {
                  id: 'c_var_2',
                  type: 'predict_output',
                  titleAr: 'تحديث قيمة المتغير',
                  questionAr: 'ما هي القيمة التي ستطبع بعد تشغيل هذا الكود؟',
                  codeSnippet: 'hp = 100\nhp = 80\nprint(hp)',
                  options: ['80', '100', '180', 'hp'],
                  correctAnswer: '80',
                  explanationAr: 'رائع! سُمي "متغيراً" لأن قيمته قابلة للتعديل؛ السطر الأخير استبدل الـ 100 بالـ 80.',
                  hintAr: 'القيمة الأحدث هي التي تستقر في المتغير.',
                  englishTerm: { term: 'Assignment', phoneticAr: 'أسينمينت', meaningAr: 'إسناد وتعيين القيمة' },
                  xpReward: 10,
                  coinReward: 5
                },
                {
                  id: 'c_var_3',
                  type: 'term_match',
                  titleAr: 'أنواع البيانات (Data Types)',
                  questionAr: 'صل كل نوع بيانات برمجية بمثاله الصحيح:',
                  termPairs: [
                    { en: 'int', ar: 'الأعداد الصحيحة مثل 42' },
                    { en: 'str', ar: 'النصوص مثل "كيميكس"' },
                    { en: 'bool', ar: 'القيم المنطقية True / False' }
                  ],
                  options: ['int: الأعداد الصحيحة مثل 42', 'str: النصوص مثل "كيميكس"', 'bool: القيم المنطقية True / False'],
                  correctAnswer: 'int: الأعداد الصحيحة مثل 42',
                  explanationAr: 'ممتاز! فهم أنواع البيانات (Data Types) هو الأساس لتفادي الأخطاء البرمجية.',
                  hintAr: 'int اختصار لـ Integer، و str اختصار لـ String.',
                  englishTerm: { term: 'Data Types', phoneticAr: 'داتا تايبس', meaningAr: 'أنواع البيانات البرمجية' },
                  xpReward: 15,
                  coinReward: 8
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'world_conditions',
      titleAr: 'عالم الشروط والعمليات المنطقية',
      titleEn: 'Conditions & Logic',
      descriptionAr: 'علّم برنامجك كيف يفكر ويتخذ القرارات الذكية باستخدام if و else.',
      icon: '⚖️',
      order: 4,
      themeColor: '#8b5cf6',
      accentGradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      requiredLevelToUnlock: 4,
      units: []
    },
    {
      id: 'world_loops',
      titleAr: 'عالم الحلقات والتكرار',
      titleEn: 'Loops & Iterations',
      descriptionAr: 'دع الحاسوب يكرر المهام الشاقة لملايين المرات بدقة مذهلة عبر for و while.',
      icon: '🔁',
      order: 5,
      themeColor: '#ec4899',
      accentGradient: 'linear-gradient(135deg, #ec4899, #be185d)',
      requiredLevelToUnlock: 5,
      units: []
    },
    {
      id: 'world_functions',
      titleAr: 'عالم الدوال وإعادة الاستخدام',
      titleEn: 'Functions & Modularity',
      descriptionAr: 'اكتب كودك مرة واحدة واستخدمه في أي مكان واصنع دوالك المخصصة.',
      icon: '⚡',
      order: 6,
      themeColor: '#f97316',
      accentGradient: 'linear-gradient(135deg, #f97316, #c2410c)',
      requiredLevelToUnlock: 6,
      units: []
    },
    {
      id: 'world_structures',
      titleAr: 'عالم القوائم وهياكل البيانات',
      titleEn: 'Data Structures',
      descriptionAr: 'تنظيم وإدارة مصفوفات وقوائم البيانات الضخمة بكفاءة واحترافية.',
      icon: '📚',
      order: 7,
      themeColor: '#06b6d4',
      accentGradient: 'linear-gradient(135deg, #06b6d4, #0e7490)',
      requiredLevelToUnlock: 7,
      units: []
    },
    {
      id: 'world_projects',
      titleAr: 'عالم المشروعات وصيد الأخطاء',
      titleEn: 'Projects & Debugging',
      descriptionAr: 'طبق كل ما تعلمته في بناء برامج وألعاب حقيقية وصقل مهاراتك المتقدمة.',
      icon: '🛠️',
      order: 8,
      themeColor: '#eab308',
      accentGradient: 'linear-gradient(135deg, #eab308, #a16207)',
      requiredLevelToUnlock: 8,
      units: []
    }
  ]
};

export const kemixAchievements: Achievement[] = [
  {
    id: 'first_code',
    titleAr: 'أول كود لكيميكس',
    descriptionAr: 'حل أول تحدٍ برمجي بنجاح وانطلق مع الصقر حورس.',
    icon: '⚡',
    category: 'xp',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'streak_3',
    titleAr: 'شعلة الالتزام والهمة',
    descriptionAr: 'حافظ على حماس التعلم لمدة 3 أيام متتالية.',
    icon: '🔥',
    category: 'streak',
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'perfect_lesson',
    titleAr: 'درس مثالي 100%',
    descriptionAr: 'أكمل درساً كاملاً دون أن تفقد أي قلب!',
    icon: '💯',
    category: 'perfect',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'speed_learner',
    titleAr: 'صقر سريع البديهة',
    descriptionAr: 'أكمل 3 دروس برمجية تفاعلية.',
    icon: '🚀',
    category: 'lessons',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'boss_slayer',
    titleAr: 'قاهر الزعماء الأسطوري',
    descriptionAr: 'اهزم زعيم العالم بنجاح وافتح آفاق جديدة.',
    icon: '👑',
    category: 'boss',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'code_runner',
    titleAr: 'مهندس الأكواد الحية',
    descriptionAr: 'قم بكتابة وتشغيل كود فعلي داخل محرر كيميكس.',
    icon: '💻',
    category: 'xp',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'coin_master',
    titleAr: 'ثروة كيميكس الذهبية',
    descriptionAr: 'اجمع 100 عملة ذهبية في خزانتك.',
    icon: '🪙',
    category: 'xp',
    unlocked: false,
    progress: 0,
    maxProgress: 100
  }
];

export const mockLeaderboard = [
  { id: 'u1', name: 'سارة مهندسة الذكاء', avatar: '👩‍💻', xp: 620, rank: 1 },
  { id: 'u2', name: 'أحمد كودر كيميكس', avatar: '🧑‍💻', xp: 510, rank: 2 },
  { id: 'u3', name: 'عمر الخوارزمي', avatar: '👨‍🔬', xp: 440, rank: 3 },
  { id: 'u4', name: 'نور مطورة الويب', avatar: '👩‍🚀', xp: 350, rank: 4 },
  { id: 'u5', name: 'أنت (بطل كيميكس)', avatar: '🦅', xp: 0, rank: 5, isCurrentUser: true },
  { id: 'u6', name: 'زياد مبرمج بايثون', avatar: '🦁', xp: 210, rank: 6 },
  { id: 'u7', name: 'مريم صانعة الحلول', avatar: '🦊', xp: 140, rank: 7 },
  { id: 'u8', name: 'حمزة ديف', avatar: '🐼', xp: 90, rank: 8 }
];
