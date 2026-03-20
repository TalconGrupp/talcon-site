// =======================
// Talcon site script
// =======================

// Mobile menu
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (!mobileMenu || !burgerBtn) return;
  mobileMenu.setAttribute('hidden', '');
  burgerBtn.setAttribute('aria-expanded', 'false');
}

burgerBtn?.addEventListener('click', () => {
  if (!mobileMenu || !burgerBtn) return;
  const isHidden = mobileMenu.hasAttribute('hidden');
  if (isHidden) {
    mobileMenu.removeAttribute('hidden');
    burgerBtn.setAttribute('aria-expanded', 'true');
    return;
  }
  closeMobileMenu();
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeMobileMenu());
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMobileMenu();
  updateLangSelectLabels();
  updateTrustBadgesAlignment();
});

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// =======================
// i18n
// =======================
const LANG_KEY = 'talcon_lang';
const SUPPORTED = ['et', 'ru', 'en'];
const LANG_LOCALE = {
  et: 'et-EE',
  ru: 'ru-RU',
  en: 'en-US'
};

function guessLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;

  const langs = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language || 'et'];

  for (const lang of langs) {
    const short = String(lang).toLowerCase().slice(0, 2);
    if (SUPPORTED.includes(short)) return short;
  }

  return 'et';
}

let currentLang = guessLang();

function t(key, fallback) {
  return window.I18N?.[currentLang]?.[key]
    || window.I18N?.et?.[key]
    || fallback;
}

const langSelect = document.getElementById('langSelect');
const langSwitch = document.getElementById('langSwitch');
const trustBadgesPanel = document.querySelector('.trust-badges');
const MAILBOX_EMAIL = 'talcon.grupp@gmail.com';
const EMAILJS_SERVICE_ID = 'service_7aj5q7v';
const EMAILJS_TEMPLATE_ID = '4ykeest';
const EMAILJS_PUBLIC_KEY = 'OngiIrAn9d_2-sGmW';
const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send-form';

function updateLangSelectLabels() {
  if (!langSelect) return;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  langSelect.querySelectorAll('option').forEach((option) => {
    if (!(option instanceof HTMLOptionElement)) return;
    const shortLabel = option.dataset.short;
    const longLabel = option.dataset.long;
    if (!shortLabel || !longLabel) return;
    option.textContent = isMobile ? shortLabel : longLabel;
  });
}

function updateTrustBadgesAlignment() {
  const root = document.documentElement;
  if (!root) return;

  if (window.innerWidth <= 980 || !langSwitch || !trustBadgesPanel) {
    root.style.setProperty('--trust-desktop-shift', '0px');
    return;
  }

  // Reset before measuring so each pass compares natural positions.
  root.style.setProperty('--trust-desktop-shift', '0px');
  const langRight = langSwitch.getBoundingClientRect().right;
  const trustRight = trustBadgesPanel.getBoundingClientRect().right;
  const diff = langRight - trustRight;
  const shift = Math.max(-360, Math.min(360, diff));
  root.style.setProperty('--trust-desktop-shift', `${shift.toFixed(2)}px`);
}

function updateLangSwitchCurrent(lang) {
  if (!langSelect) return;
  langSelect.value = SUPPORTED.includes(lang) ? lang : 'et';
}

langSelect?.addEventListener('change', () => {
  setLanguage(langSelect.value);
});

// =======================
// Services configurator
// =======================
const SERVICE_CATALOG_I18N = {
  et: {
    registration: {
      kind: 'registration',
      defaultFormId: 'ou',
      title: 'Ettevõtte registreerimine',
      cardText: 'Abi sobiva ärivormi registreerimisel Eestis.',
      cardPriceText: 'alates 99€',
      cardPriceSuffix: 'ühekordne',
      cardFeatures: [
        'Ärivormi valik',
        'Dokumentide ettevalmistus',
        'Esitamise tugi',
        'Abi registreerimisel'
      ],
      description: 'Valige ärivorm ja näete kohe teenuse hinda ning riigilõivu. Lõplikult sõltub registreerimine valitud vormist ja registrikande viisist.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Füüsilisest isikust ettevõtja',
          hint: 'Sobib siis, kui tegutsete oma nime all ja vajate lihtsamat ettevõtlusvormi.',
          price: 99,
          stateFee: 20
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Osaühing',
          hint: 'Kõige tavalisem vorm väikesele ja keskmisele ettevõttele Eestis.',
          price: 149,
          stateFee: 200,
          stateFeeFast: 265
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Mittetulundusühing',
          hint: 'Sobib ühingutele, kogukondlikele projektidele ja mittetulunduslikule tegevusele.',
          price: 129,
          stateFee: 30
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Aktsiaselts',
          hint: 'Sobib suurema kapitali või keerukama juhtimisstruktuuriga ettevõttele.',
          price: 299,
          from: true,
          stateFee: 200,
          stateFeeFast: 265
        }
      ],
      baseBilling: 'one-time',
      includes: [
        'konsultatsioon',
        'dokumentide ettevalmistus',
        'esitamise tugi',
        'abi registreerimisel'
      ],
      extras: [
        { id: 'vat-registration', title: 'KMKR (VAT) registreerimine', price: 25, billing: 'one-time' },
        { id: 'bookkeeping-after-registration', title: 'Raamatupidamine pärast registreerimist', price: 99, billing: 'monthly' },
        { id: 'annual-report', title: 'Aastaaruanne', price: 150, billing: 'one-time' },
        { id: 'bank-support', title: 'Abi panga või makselahendusega', price: 50, billing: 'one-time' }
      ]
    },
    accounting: {
      kind: 'monthly',
      defaultFormId: 'ou',
      title: 'Raamatupidamise tugi',
      cardText: 'Täielik igakuine teenus: dokumendid, jooksev raamatupidamine, deklaratsioonid ja palgaarvestus.',
      cardPriceText: 'alates 119€',
      cardPriceSuffix: '/kuu',
      cardFeatures: [
        'Täielik igakuine arvestus',
        'Algdokumentide töötlemine',
        'Maksudeklaratsioonide esitamine',
        'Palgaarvestus'
      ],
      description: 'Sobib siis, kui vajate täielikku igakuist raamatupidamisteenust. Hind sõltub ärivormist, dokumendipaketist ja teenuse perioodist.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Füüsilisest isikust ettevõtja',
          hint: 'Lihtsama struktuuriga tegevus ja väiksem aruandluskoormus.',
          monthlyAdjustment: -20
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Osaühing',
          hint: 'Standardne valik enamiku Eesti väikeettevõtete jaoks.',
          monthlyAdjustment: 0
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Mittetulundusühing',
          hint: 'Sobib mittetulunduslikele organisatsioonidele ja ühingutele.',
          monthlyAdjustment: 10
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Aktsiaselts',
          hint: 'Keerukam juriidiline vorm, mis vajab tavaliselt põhjalikumat aruandlust.',
          monthlyAdjustment: 60
        }
      ],
      workloadPricing: {
        defaultDocuments: 20,
        packages: [
          { id: 'starter', title: 'Start', min: 1, max: 15, price: 119, rangeLabel: 'kuni 15 dokumenti kuus' },
          { id: 'standard', title: 'Standard', min: 16, max: 40, price: 159, rangeLabel: '16-40 dokumenti kuus' },
          { id: 'growth', title: 'Kasv', min: 41, max: 80, price: 239, rangeLabel: '41-80 dokumenti kuus' },
          { id: 'scale', title: 'Maht', min: 81, max: 140, price: 339, rangeLabel: '81-140 dokumenti kuus' },
          { id: 'custom', title: 'Individuaalne', min: 141, max: null, price: 459, rangeLabel: '141+ dokumenti kuus' }
        ]
      },
      baseBilling: 'monthly',
      includes: [
        'algdokumentide töötlemine',
        'igakuine raamatupidamine',
        'maksudeklaratsioonide esitamine',
        'palgaarvestus'
      ],
      extras: [
        { id: 'annual-report', title: 'Aastaaruanne', price: 150, billing: 'one-time' },
        { id: 'vat-registration', title: 'KMKR (VAT) registreerimine', price: 25, billing: 'one-time' },
        { id: 'statistics', title: 'Statistilised aruanded', price: 15, billing: 'monthly' },
        { id: 'extra-employee', title: 'Lisatöötaja', price: 10, billing: 'monthly', quantity: true, quantityLabel: 'inim.' }
      ]
    },
    taxes: {
      kind: 'monthly',
      defaultFormId: 'ou',
      title: 'Maksutugi ja aruandlus',
      cardText: 'Eraldi teenus deklaratsioonide, tähtaegade ja kohustusliku aruandluse jaoks.',
      cardPriceText: 'alates 149€',
      cardPriceSuffix: '/kuu',
      cardFeatures: [
        'Maksudeklaratsioonid',
        'Tähtaegade ja kohustuste kontroll',
        'Kohustuslik aruandlus',
        'Maksuküsimuste tugi'
      ],
      description: 'Sobib siis, kui jooksev raamatupidamine on korraldatud, kuid vajate eraldi maksudeklaratsioonide, tähtaegade ja aruandluse tuge. Hind sõltub ärivormist, dokumendipaketist ja teenuse perioodist.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Füüsilisest isikust ettevõtja',
          hint: 'Sobib lihtsama maksuarvestuse ja väiksema töömahuga ettevõtjale.',
          monthlyAdjustment: -10
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Osaühing',
          hint: 'Standardne vorm regulaarse maksuarvestuse ja deklaratsioonide jaoks.',
          monthlyAdjustment: 0
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Mittetulundusühing',
          hint: 'Vajab tihti täiendavat aruandlust ja eraldi nüansse maksuküsimustes.',
          monthlyAdjustment: 20
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Aktsiaselts',
          hint: 'Suurema mahuga ja keerukama aruandlusega ettevõtlusvorm.',
          monthlyAdjustment: 80
        }
      ],
      workloadPricing: {
        defaultDocuments: 25,
        packages: [
          { id: 'starter', title: 'Start', min: 1, max: 20, price: 149, rangeLabel: 'kuni 20 dokumenti kuus' },
          { id: 'standard', title: 'Standard', min: 21, max: 50, price: 249, rangeLabel: '21-50 dokumenti kuus' },
          { id: 'growth', title: 'Kasv', min: 51, max: 100, price: 349, rangeLabel: '51-100 dokumenti kuus' },
          { id: 'scale', title: 'Maht', min: 101, max: 160, price: 469, rangeLabel: '101-160 dokumenti kuus' },
          { id: 'custom', title: 'Individuaalne', min: 161, max: null, price: 589, rangeLabel: '161+ dokumenti kuus' }
        ]
      },
      baseBilling: 'monthly',
      includes: [
        'maksudeklaratsioonid',
        'tähtaegade ja kohustuste kontroll',
        'kohustuslik aruandlus',
        'maksuküsimuste tugi'
      ],
      extras: [
        { id: 'vat', title: 'VAT', price: 30, billing: 'monthly' },
        { id: 'tsd', title: 'TSD', price: 20, billing: 'monthly' },
        { id: 'statistics', title: 'Statistika', price: 15, billing: 'monthly' },
        { id: 'tax-office-answers', title: 'Vastused Maksu- ja Tolliametile', price: 50, billing: 'monthly' }
      ]
    }
  },
  ru: {
    registration: {
      kind: 'registration',
      defaultFormId: 'ou',
      title: 'Регистрация бизнеса',
      cardText: 'Помощь с регистрацией подходящей формы бизнеса в Эстонии.',
      cardPriceText: 'от 99€',
      cardPriceSuffix: 'разово',
      cardFeatures: [
        'Выбор формы предприятия',
        'Подготовка документов',
        'Сопровождение подачи',
        'Помощь с регистрацией'
      ],
      description: 'Выберите форму предприятия и сразу увидите стоимость услуги и государственную пошлину. Итог зависит от выбранной формы и способа подачи.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Физическое лицо-предприниматель',
          hint: 'Подходит, если вы ведёте деятельность от собственного имени и хотите простую форму бизнеса.',
          price: 99,
          stateFee: 20
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Общество с ограниченной ответственностью',
          hint: 'Самая распространённая форма для малого и среднего бизнеса в Эстонии.',
          price: 149,
          stateFee: 200,
          stateFeeFast: 265
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Некоммерческое объединение',
          hint: 'Подходит для объединений, проектов сообщества и некоммерческой деятельности.',
          price: 129,
          stateFee: 30
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Акционерное общество',
          hint: 'Подходит для более крупного бизнеса с капиталом и более сложной структурой управления.',
          price: 299,
          from: true,
          stateFee: 200,
          stateFeeFast: 265
        }
      ],
      baseBilling: 'one-time',
      includes: [
        'консультация',
        'подготовка документов',
        'сопровождение подачи',
        'помощь с регистрацией'
      ],
      extras: [
        { id: 'vat-registration', title: 'VAT регистрация', price: 25, billing: 'one-time' },
        { id: 'bookkeeping-after-registration', title: 'Бухгалтерия после регистрации', price: 99, billing: 'monthly' },
        { id: 'annual-report', title: 'Годовой отчёт', price: 150, billing: 'one-time' },
        { id: 'bank-support', title: 'Помощь с банком или платёжной системой', price: 50, billing: 'one-time' }
      ]
    },
    accounting: {
      kind: 'monthly',
      defaultFormId: 'ou',
      title: 'Бухгалтерское сопровождение',
      cardText: 'Полное ежемесячное ведение: документы, бухгалтерия, декларации и зарплата.',
      cardPriceText: 'от 119€',
      cardPriceSuffix: '/месяц',
      cardFeatures: [
        'Полный ежемесячный учёт',
        'Обработка первичных документов',
        'Налоговые декларации',
        'Расчёт зарплаты'
      ],
      description: 'Подходит, если нужен полный цикл ежемесячной бухгалтерии. Цена зависит от формы предприятия, выбранного пакета и периода обслуживания.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Физическое лицо-предприниматель',
          hint: 'Обычно подходит при более простой структуре бизнеса и меньшем объёме отчётности.',
          monthlyAdjustment: -20
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Общество с ограниченной ответственностью',
          hint: 'Базовый вариант для большинства компаний малого бизнеса.',
          monthlyAdjustment: 0
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Некоммерческое объединение',
          hint: 'Подходит для НКО и объединений, где часто требуется отдельная специфика отчётности.',
          monthlyAdjustment: 10
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Акционерное общество',
          hint: 'Более сложная форма предприятия, которая обычно требует более детального сопровождения.',
          monthlyAdjustment: 60
        }
      ],
      workloadPricing: {
        defaultDocuments: 20,
        packages: [
          { id: 'starter', title: 'Старт', min: 1, max: 15, price: 119, rangeLabel: 'до 15 документов в месяц' },
          { id: 'standard', title: 'Стандарт', min: 16, max: 40, price: 159, rangeLabel: '16-40 документов в месяц' },
          { id: 'growth', title: 'Рост', min: 41, max: 80, price: 239, rangeLabel: '41-80 документов в месяц' },
          { id: 'scale', title: 'Поток', min: 81, max: 140, price: 339, rangeLabel: '81-140 документов в месяц' },
          { id: 'custom', title: 'Индивидуально', min: 141, max: null, price: 459, rangeLabel: '141+ документов в месяц' }
        ]
      },
      baseBilling: 'monthly',
      includes: [
        'обработка первичных документов',
        'ежемесячная бухгалтерия',
        'подача налоговых деклараций',
        'расчёт зарплаты'
      ],
      extras: [
        { id: 'annual-report', title: 'Годовой отчёт', price: 150, billing: 'one-time' },
        { id: 'vat-registration', title: 'VAT регистрация', price: 25, billing: 'one-time' },
        { id: 'statistics', title: 'Статистические отчёты', price: 15, billing: 'monthly' },
        { id: 'extra-employee', title: 'Дополнительный сотрудник', price: 10, billing: 'monthly', quantity: true, quantityLabel: 'чел.' }
      ]
    },
    taxes: {
      kind: 'monthly',
      defaultFormId: 'ou',
      title: 'Налоговое сопровождение',
      cardText: 'Отдельный блок деклараций, сроков и обязательной отчётности для компании.',
      cardPriceText: 'от 149€',
      cardPriceSuffix: '/месяц',
      cardFeatures: [
        'Налоговые декларации',
        'Контроль сроков и обязательств',
        'Обязательная отчётность',
        'Налоговые вопросы и ответы'
      ],
      description: 'Подходит, если текущий учёт уже организован, но нужен отдельный налоговый блок: декларации, сроки, обязательная отчётность и ответы по налоговым вопросам. Цена зависит от формы предприятия, пакета и периода.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Физическое лицо-предприниматель',
          hint: 'Подходит для более простой налоговой структуры и меньшего объёма документов.',
          monthlyAdjustment: -10
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Общество с ограниченной ответственностью',
          hint: 'Стандартный вариант для большинства компаний с регулярной налоговой отчётностью.',
          monthlyAdjustment: 0
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Некоммерческое объединение',
          hint: 'Обычно требует более специфической отчётности и дополнительных нюансов по налогам.',
          monthlyAdjustment: 20
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Акционерное общество',
          hint: 'Подходит для более объёмной и сложной налоговой отчётности.',
          monthlyAdjustment: 80
        }
      ],
      workloadPricing: {
        defaultDocuments: 25,
        packages: [
          { id: 'starter', title: 'Старт', min: 1, max: 20, price: 149, rangeLabel: 'до 20 документов в месяц' },
          { id: 'standard', title: 'Стандарт', min: 21, max: 50, price: 249, rangeLabel: '21-50 документов в месяц' },
          { id: 'growth', title: 'Рост', min: 51, max: 100, price: 349, rangeLabel: '51-100 документов в месяц' },
          { id: 'scale', title: 'Поток', min: 101, max: 160, price: 469, rangeLabel: '101-160 документов в месяц' },
          { id: 'custom', title: 'Индивидуально', min: 161, max: null, price: 589, rangeLabel: '161+ документов в месяц' }
        ]
      },
      baseBilling: 'monthly',
      includes: [
        'налоговые декларации',
        'контроль сроков и обязательств',
        'обязательная отчётность',
        'ответы по налоговым вопросам'
      ],
      extras: [
        { id: 'vat', title: 'VAT', price: 30, billing: 'monthly' },
        { id: 'tsd', title: 'TSD', price: 20, billing: 'monthly' },
        { id: 'statistics', title: 'Статистика', price: 15, billing: 'monthly' },
        { id: 'tax-office-answers', title: 'Ответы налоговой', price: 50, billing: 'monthly' }
      ]
    }
  },
  en: {
    registration: {
      kind: 'registration',
      defaultFormId: 'ou',
      title: 'Business Registration',
      cardText: 'Help with registering the right business form in Estonia.',
      cardPriceText: 'from 99€',
      cardPriceSuffix: 'one-time',
      cardFeatures: [
        'Business form selection',
        'Document preparation',
        'Filing support',
        'Registration assistance'
      ],
      description: 'Choose the business form and immediately see the service fee and state fee. Final registration cost depends on the selected form and filing route.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Sole proprietor',
          hint: 'Suitable if you operate under your own name and want a simpler business structure.',
          price: 99,
          stateFee: 20
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Private limited company',
          hint: 'The most common legal form for small and medium-sized businesses in Estonia.',
          price: 149,
          stateFee: 200,
          stateFeeFast: 265
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Non-profit association',
          hint: 'Suitable for associations, community projects, and non-profit activity.',
          price: 129,
          stateFee: 30
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Public limited company',
          hint: 'Suitable for companies with larger capital needs or a more complex governance structure.',
          price: 299,
          from: true,
          stateFee: 200,
          stateFeeFast: 265
        }
      ],
      baseBilling: 'one-time',
      includes: [
        'consultation',
        'document preparation',
        'filing support',
        'registration assistance'
      ],
      extras: [
        { id: 'vat-registration', title: 'VAT registration', price: 25, billing: 'one-time' },
        { id: 'bookkeeping-after-registration', title: 'Bookkeeping after registration', price: 99, billing: 'monthly' },
        { id: 'annual-report', title: 'Annual report', price: 150, billing: 'one-time' },
        { id: 'bank-support', title: 'Bank or payment system support', price: 50, billing: 'one-time' }
      ]
    },
    accounting: {
      kind: 'monthly',
      defaultFormId: 'ou',
      title: 'Accounting Support',
      cardText: 'Complete monthly service: documents, daily bookkeeping, filings, and payroll.',
      cardPriceText: 'from 119€',
      cardPriceSuffix: '/month',
      cardFeatures: [
        'Full monthly bookkeeping',
        'Source document processing',
        'Tax declaration filing',
        'Payroll calculation'
      ],
      description: 'Best when you need full monthly bookkeeping support. Pricing depends on the business form, selected document package, and service period.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Sole proprietor',
          hint: 'Usually suitable for a simpler setup and lighter reporting workload.',
          monthlyAdjustment: -20
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Private limited company',
          hint: 'The standard choice for most small businesses in Estonia.',
          monthlyAdjustment: 0
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Non-profit association',
          hint: 'Suitable for non-profit organisations and associations with specific reporting needs.',
          monthlyAdjustment: 10
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Public limited company',
          hint: 'A more complex legal form that typically requires more detailed support.',
          monthlyAdjustment: 60
        }
      ],
      workloadPricing: {
        defaultDocuments: 20,
        packages: [
          { id: 'starter', title: 'Starter', min: 1, max: 15, price: 119, rangeLabel: 'up to 15 documents per month' },
          { id: 'standard', title: 'Standard', min: 16, max: 40, price: 159, rangeLabel: '16-40 documents per month' },
          { id: 'growth', title: 'Growth', min: 41, max: 80, price: 239, rangeLabel: '41-80 documents per month' },
          { id: 'scale', title: 'Scale', min: 81, max: 140, price: 339, rangeLabel: '81-140 documents per month' },
          { id: 'custom', title: 'Custom', min: 141, max: null, price: 459, rangeLabel: '141+ documents per month' }
        ]
      },
      baseBilling: 'monthly',
      includes: [
        'source document processing',
        'monthly bookkeeping',
        'tax declaration filing',
        'payroll calculation'
      ],
      extras: [
        { id: 'annual-report', title: 'Annual report', price: 150, billing: 'one-time' },
        { id: 'vat-registration', title: 'VAT registration', price: 25, billing: 'one-time' },
        { id: 'statistics', title: 'Statistical reports', price: 15, billing: 'monthly' },
        { id: 'extra-employee', title: 'Additional employee', price: 10, billing: 'monthly', quantity: true, quantityLabel: 'person' }
      ]
    },
    taxes: {
      kind: 'monthly',
      defaultFormId: 'ou',
      title: 'Tax Support',
      cardText: 'A separate service for declarations, deadlines, and mandatory reporting.',
      cardPriceText: 'from 149€',
      cardPriceSuffix: '/month',
      cardFeatures: [
        'Tax declarations',
        'Deadline and obligation control',
        'Mandatory reporting',
        'Tax question support'
      ],
      description: 'Best when bookkeeping is already organised but you need a separate tax layer for filings, deadlines, mandatory reporting, and tax questions. Pricing depends on the business form, package, and service period.',
      forms: [
        {
          id: 'fie',
          title: 'FIE',
          fullTitle: 'Sole proprietor',
          hint: 'Suitable for a simpler tax structure and a lower volume of documents.',
          monthlyAdjustment: -10
        },
        {
          id: 'ou',
          title: 'OÜ',
          fullTitle: 'Private limited company',
          hint: 'A standard legal form for companies with regular tax reporting.',
          monthlyAdjustment: 0
        },
        {
          id: 'mtu',
          title: 'MTÜ',
          fullTitle: 'Non-profit association',
          hint: 'Often needs more specific reporting and additional tax nuances.',
          monthlyAdjustment: 20
        },
        {
          id: 'as',
          title: 'AS',
          fullTitle: 'Public limited company',
          hint: 'Suitable for a larger and more complex tax-reporting workload.',
          monthlyAdjustment: 80
        }
      ],
      workloadPricing: {
        defaultDocuments: 25,
        packages: [
          { id: 'starter', title: 'Starter', min: 1, max: 20, price: 149, rangeLabel: 'up to 20 documents per month' },
          { id: 'standard', title: 'Standard', min: 21, max: 50, price: 249, rangeLabel: '21-50 documents per month' },
          { id: 'growth', title: 'Growth', min: 51, max: 100, price: 349, rangeLabel: '51-100 documents per month' },
          { id: 'scale', title: 'Scale', min: 101, max: 160, price: 469, rangeLabel: '101-160 documents per month' },
          { id: 'custom', title: 'Custom', min: 161, max: null, price: 589, rangeLabel: '161+ documents per month' }
        ]
      },
      baseBilling: 'monthly',
      includes: [
        'tax declarations',
        'deadline and obligation control',
        'mandatory reporting',
        'tax question support'
      ],
      extras: [
        { id: 'vat', title: 'VAT', price: 30, billing: 'monthly' },
        { id: 'tsd', title: 'TSD', price: 20, billing: 'monthly' },
        { id: 'statistics', title: 'Statistics', price: 15, billing: 'monthly' },
        { id: 'tax-office-answers', title: 'Replies to Tax Office', price: 50, billing: 'monthly' }
      ]
    }
  }
};

function getServiceCatalog() {
  return SERVICE_CATALOG_I18N[currentLang] || SERVICE_CATALOG_I18N.et;
}

const serviceCards = [...document.querySelectorAll('.price-card[data-service-id]')];
const serviceConfigurator = document.getElementById('service-configurator');
const configServiceTitle = document.getElementById('configServiceTitle');
const configServiceText = document.getElementById('configServiceText');
const businessTypeBlock = document.getElementById('businessTypeBlock');
const businessTypeOptions = document.getElementById('businessTypeOptions');
const businessTypeHint = document.getElementById('businessTypeHint');
const workloadBlock = document.getElementById('workloadBlock');
const workloadIntro = document.getElementById('workloadIntro');
const servicePackageTitle = document.getElementById('servicePackageTitle');
const servicePackageHint = document.getElementById('servicePackageHint');
const servicePackageList = document.getElementById('servicePackageList');
const servicePeriodWrap = document.querySelector('.service-period');
const servicePeriodSelect = document.getElementById('servicePeriodSelect');
const servicePeriodHint = document.getElementById('servicePeriodHint');
const registrationFeeBlock = document.getElementById('registrationFeeBlock');
const registrationFeeList = document.getElementById('registrationFeeList');
const registrationFeeNote = document.getElementById('registrationFeeNote');
const serviceIncludedList = document.getElementById('serviceIncludedList');
const serviceExtras = document.getElementById('serviceExtras');
const orderService = document.getElementById('orderService');
const orderBusinessRow = document.getElementById('orderBusinessRow');
const orderBusinessType = document.getElementById('orderBusinessType');
const orderPackageRow = document.getElementById('orderPackageRow');
const orderPackage = document.getElementById('orderPackage');
const orderBasePrice = document.getElementById('orderBasePrice');
const orderRegFeeRow = document.getElementById('orderRegFeeRow');
const orderRegFee = document.getElementById('orderRegFee');
const orderPeriod = document.getElementById('orderPeriod');
const orderMonthlyRow = document.getElementById('orderMonthlyRow');
const orderMonthlyTotal = document.getElementById('orderMonthlyTotal');
const orderExtrasList = document.getElementById('orderExtrasList');
const orderTotalPrice = document.getElementById('orderTotalPrice');
const openOrderFormBtn = document.getElementById('openOrderForm');
const serviceOrderForm = document.getElementById('serviceOrderForm');
const serviceOrderHint = document.getElementById('serviceOrderHint');
const associationCalculator = document.getElementById('associationCalculator');
const associationBaseFee = document.getElementById('associationBaseFee');
const associationUnitsFee = document.getElementById('associationUnitsFee');
const associationInvoicesFee = document.getElementById('associationInvoicesFee');
const associationDocumentsPackageFee = document.getElementById('associationDocumentsPackageFee');
const associationPayrollFee = document.getElementById('associationPayrollFee');
const associationReportsFee = document.getElementById('associationReportsFee');
const associationTotalFee = document.getElementById('associationTotalFee');
const associationQuoteBtn = document.getElementById('associationQuoteBtn');
const quoteContext = document.getElementById('quoteContext');
const quoteContextList = document.getElementById('quoteContextList');
const quoteContextEdit = document.getElementById('quoteContextEdit');

const serviceState = {
  serviceId: null,
  businessFormId: null,
  selectedExtras: new Set(),
  extraQuantities: {},
  periodMonths: null,
  selectedPackageId: null
};

function formatEuro(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0€';
  const normalized = Math.round(n * 100) / 100;
  const output = Number.isInteger(normalized) ? String(normalized) : String(normalized).replace('.', ',');
  return `${output}€`;
}

function formatAssociationEuro(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0€';
  const normalized = Math.round(n * 100) / 100;
  if (Number.isInteger(normalized)) {
    return `${String(normalized)}€`;
  }
  return `${normalized.toFixed(2).replace('.', ',')}€`;
}

function getNumberStepperLabel(direction) {
  if (direction === 'down') {
    return t('numberStepperDown', 'Decrease value');
  }
  return t('numberStepperUp', 'Increase value');
}

function syncNumberFieldState(input) {
  if (!(input instanceof HTMLInputElement)) return;
  const wrapper = input.closest('.number-field');
  if (!wrapper) return;
  const controls = wrapper.querySelectorAll('.number-field__btn');
  controls.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    button.disabled = input.disabled;
    button.setAttribute(
      'aria-label',
      button.classList.contains('number-field__btn--down')
        ? getNumberStepperLabel('down')
        : getNumberStepperLabel('up')
    );
  });
}

function dispatchNumberFieldEvents(input) {
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  syncNumberFieldState(input);
}

function getStepPrecision(stepValue) {
  const stepString = String(stepValue || '');
  const decimalPart = stepString.split('.')[1] || '';
  return decimalPart.length;
}

function stepNumberFieldValue(input, direction) {
  if (!(input instanceof HTMLInputElement) || input.disabled || input.readOnly) return;

  try {
    if (direction > 0) {
      input.stepUp();
    } else {
      input.stepDown();
    }
  } catch {
    const stepRaw = Number.parseFloat(String(input.step || '1'));
    const step = Number.isFinite(stepRaw) && stepRaw > 0 ? stepRaw : 1;
    const minRaw = Number.parseFloat(String(input.min || ''));
    const maxRaw = Number.parseFloat(String(input.max || ''));
    const currentRaw = Number.parseFloat(String(input.value || '').replace(',', '.'));
    const fallback = Number.isFinite(currentRaw)
      ? currentRaw
      : (Number.isFinite(minRaw) ? minRaw : 0);
    let next = fallback + direction * step;

    if (Number.isFinite(minRaw)) next = Math.max(minRaw, next);
    if (Number.isFinite(maxRaw)) next = Math.min(maxRaw, next);

    const precision = getStepPrecision(input.step);
    input.value = precision > 0 ? next.toFixed(precision) : String(Math.round(next));
  }

  dispatchNumberFieldEvents(input);
  input.focus({ preventScroll: true });
}

function enhanceNumberInput(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'number') return;
  if (input.closest('.number-field')) {
    syncNumberFieldState(input);
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'number-field';

  const controls = document.createElement('div');
  controls.className = 'number-field__controls';

  const upButton = document.createElement('button');
  upButton.type = 'button';
  upButton.className = 'number-field__btn number-field__btn--up';
  upButton.addEventListener('click', (event) => {
    event.preventDefault();
    stepNumberFieldValue(input, 1);
  });

  const downButton = document.createElement('button');
  downButton.type = 'button';
  downButton.className = 'number-field__btn number-field__btn--down';
  downButton.addEventListener('click', (event) => {
    event.preventDefault();
    stepNumberFieldValue(input, -1);
  });

  controls.append(upButton, downButton);

  input.parentNode?.insertBefore(wrapper, input);
  wrapper.append(input, controls);

  syncNumberFieldState(input);
}

function enhanceNumberInputs(root = document) {
  if (!root) return;
  root.querySelectorAll?.('input[type="number"]').forEach((input) => {
    enhanceNumberInput(input);
  });
}

function refreshNumberStepperLabels() {
  document.querySelectorAll('.number-field input[type="number"]').forEach((input) => {
    if (input instanceof HTMLInputElement) {
      syncNumberFieldState(input);
    }
  });
}

function isEmailValue(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function appendSubmissionMeta(formData, subject) {
  formData.append('service_id', EMAILJS_SERVICE_ID);
  formData.append('template_id', EMAILJS_TEMPLATE_ID);
  formData.append('user_id', EMAILJS_PUBLIC_KEY);
  formData.append('title', subject);
  formData.append('site', 'talcon.ee');
  formData.append('page_url', window.location.href);
  formData.append('language', currentLang);
  formData.append('submitted_at', new Date().toISOString());
}

async function sendSubmission(formData) {
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    body: formData
  });

  const responseText = await response.text().catch(() => '');
  if (!response.ok) {
    throw new Error(responseText || `Submission failed with status ${response.status}`);
  }

  return responseText;
}

function getSelectedService() {
  if (!serviceState.serviceId) return null;
  return getServiceCatalog()[serviceState.serviceId] || null;
}

function getSelectedForm(service) {
  if (!service?.forms) return null;
  return service.forms.find((form) => form.id === serviceState.businessFormId) || service.forms[0];
}

function hasRegistrationFee(service) {
  return Boolean(service?.forms?.some((form) => Number.isFinite(form.stateFee)));
}

function hasWorkloadPricing(service) {
  return Boolean(service?.workloadPricing?.packages?.length);
}

function getPackageByDocuments(service, documents) {
  if (!hasWorkloadPricing(service)) return null;
  const normalizedDocuments = Number.isFinite(Number(documents))
    ? Math.max(1, Number(documents))
    : (service.workloadPricing.defaultDocuments || 20);

  return service.workloadPricing.packages.find((pkg) => {
    const min = Number.isFinite(pkg.min) ? pkg.min : 1;
    const max = Number.isFinite(pkg.max) ? pkg.max : Number.POSITIVE_INFINITY;
    return normalizedDocuments >= min && normalizedDocuments <= max;
  }) || service.workloadPricing.packages[service.workloadPricing.packages.length - 1] || null;
}

function getDefaultPackageId(service = getSelectedService()) {
  return getPackageByDocuments(service, service?.workloadPricing?.defaultDocuments || 20)?.id
    || service?.workloadPricing?.packages?.[0]?.id
    || null;
}

function getSelectedPackage(service = getSelectedService()) {
  if (!hasWorkloadPricing(service)) return null;
  const selectedPackage = service.workloadPricing.packages.find((pkg) => pkg.id === serviceState.selectedPackageId);
  if (selectedPackage) return selectedPackage;

  const fallbackPackage = service.workloadPricing.packages.find((pkg) => pkg.id === getDefaultPackageId(service))
    || service.workloadPricing.packages[0]
    || null;

  if (fallbackPackage) {
    serviceState.selectedPackageId = fallbackPackage.id;
  }

  return fallbackPackage;
}

function getPeriodMonths() {
  const value = Number.parseInt(String(serviceState.periodMonths || ''), 10);
  if (!Number.isFinite(value) || value < 1) return null;
  if (value > 12) return 12;
  return value;
}

function isPeriodRequired(service = getSelectedService()) {
  if (!service) return false;
  if (service.baseBilling === 'monthly') return true;
  return service.extras.some(
    (extra) => extra.billing === 'monthly' && serviceState.selectedExtras.has(extra.id)
  );
}

function hasValidPeriod(service = getSelectedService()) {
  if (!service) return false;
  if (!isPeriodRequired(service)) return true;
  return Number.isFinite(getPeriodMonths());
}

function getMonthLabel(months) {
  if (!Number.isFinite(months) || months < 1) return t('orderPeriodNotSelected', 'Not selected');

  if (currentLang === 'ru') {
    const mod10 = months % 10;
    const mod100 = months % 100;
    if (mod10 === 1 && mod100 !== 11) return `${months} месяц`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${months} месяца`;
    return `${months} месяцев`;
  }

  if (currentLang === 'en') {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  return `${months} ${months === 1 ? 'kuu' : 'kuud'}`;
}

function getBasePriceSummary(service) {
  if (hasWorkloadPricing(service)) {
    const selectedPackage = getSelectedPackage(service);
    const form = getSelectedForm(service);
    const adjustment = Number(form?.monthlyAdjustment || 0);
    const monthly = Math.max(0, Number(selectedPackage?.price || 0) + adjustment);
    return {
      oneTime: 0,
      monthly,
      label: `${formatEuro(monthly)}${t('perMonthService', '/month')}`,
      packageTitle: selectedPackage?.title || '-',
      packageRangeLabel: selectedPackage?.rangeLabel || '',
      formAdjustment: adjustment
    };
  }

  if (service.forms) {
    const form = getSelectedForm(service);
    const label = form?.from
      ? `${t('fromLabel', 'from')} ${formatEuro(form.price)}`
      : formatEuro(form.price);
    return {
      oneTime: form?.price || 0,
      monthly: 0,
      label: label || '0€'
    };
  }

  const isMonthly = service.baseBilling === 'monthly';
  const basePrice = service.basePrice || 0;

  return {
    oneTime: isMonthly ? 0 : basePrice,
    monthly: isMonthly ? basePrice : 0,
    label: isMonthly ? `${formatEuro(basePrice)}${t('perMonthService', '/month')}` : formatEuro(basePrice)
  };
}

function getExtraPrice(extra) {
  const qty = extra.quantity ? Math.max(1, Number(serviceState.extraQuantities[extra.id] || 1)) : 1;
  const billing = extra.billing === 'monthly' ? 'monthly' : 'one-time';
  return {
    qty,
    amount: extra.price * qty,
    billing
  };
}

function splitCardPriceText(rawText) {
  const text = String(rawText || '').trim();
  if (!text) return { prefix: '', amount: '' };

  const match = text.match(/^(.*?)(\d[\d\s.,]*\s*€)$/u);
  if (!match) {
    return { prefix: '', amount: text };
  }

  return {
    prefix: (match[1] || '').trim(),
    amount: (match[2] || '').trim()
  };
}

function formatStateFeeLabel(form) {
  if (!form || !Number.isFinite(form.stateFee)) return '-';
  const base = formatEuro(form.stateFee);
  if (Number.isFinite(form.stateFeeFast)) {
    return `${base} (${t('regFeeFastLabel', 'expedited')}: ${formatEuro(form.stateFeeFast)})`;
  }
  return base;
}

function formatMonthlyAdjustment(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount === 0) return '0€';
  const sign = amount > 0 ? '+' : '-';
  return `${sign}${formatEuro(Math.abs(amount))}`;
}

function getNeutralPackageAdjustmentLabel() {
  if (currentLang === 'ru') return 'без надбавки к пакету';
  if (currentLang === 'en') return 'base package price';
  return 'paketi baashind';
}

function renderPeriodHint(service) {
  if (!servicePeriodHint) return;
  const required = isPeriodRequired(service);
  servicePeriodHint.textContent = required
    ? t('configPeriodHintRequired', 'Period is required for monthly services.')
    : t('configPeriodHintOptional', 'Optional for company registration if no monthly services are selected.');
  servicePeriodHint.classList.toggle('is-optional', !required);
  if (!required) clearPeriodError();
}

function renderRegistrationFeeBlock(service) {
  if (!registrationFeeBlock || !registrationFeeList || !registrationFeeNote) return;

  if (!hasRegistrationFee(service)) {
    registrationFeeBlock.setAttribute('hidden', '');
    registrationFeeList.innerHTML = '';
    return;
  }

  registrationFeeBlock.removeAttribute('hidden');
  registrationFeeList.innerHTML = '';

  const selectedForm = getSelectedForm(service);

  service.forms.forEach((form) => {
    const item = document.createElement('li');
    const title = document.createElement('span');
    title.textContent = form.title;
    const fee = document.createElement('strong');
    fee.textContent = formatStateFeeLabel(form);
    item.append(title, fee);
    if (form.id === selectedForm?.id) item.classList.add('is-selected');
    registrationFeeList.append(item);
  });

  registrationFeeNote.textContent = t(
    'configRegFeeNote',
    'State fee is paid separately in the state register and is added to service cost.'
  );
}

function getSelectedRegistrationFee(service) {
  if (!hasRegistrationFee(service)) return null;
  const form = getSelectedForm(service);
  if (!form || !Number.isFinite(form.stateFee)) return null;
  return {
    amount: form.stateFee,
    fastAmount: Number.isFinite(form.stateFeeFast) ? form.stateFeeFast : null
  };
}

function renderServiceCards() {
  const catalog = getServiceCatalog();

  serviceCards.forEach((card) => {
    const serviceId = card.dataset.serviceId;
    const service = catalog[serviceId];
    if (!service) return;

    const title = card.querySelector('h3');
    const subtitle = card.querySelector('p');
    const link = card.querySelector('.price-card__link');
    const btn = card.querySelector('.btn--card');
    const priceValue = card.querySelector('.price span');
    const priceSuffix = card.querySelector('.price small');
    const list = card.querySelector('ul');

    if (title) title.textContent = service.title;
    if (subtitle) subtitle.textContent = service.cardText;
    if (link) link.textContent = t('serviceView', 'View');
    if (btn) btn.textContent = t('serviceView', 'View');
    if (priceValue) {
      const priceParts = splitCardPriceText(service.cardPriceText);
      priceValue.innerHTML = '';

      if (priceParts.prefix) {
        const prefixEl = document.createElement('span');
        prefixEl.className = 'price__prefix';
        prefixEl.textContent = priceParts.prefix;
        priceValue.append(prefixEl);
      }

      const amountEl = document.createElement('span');
      amountEl.className = 'price__amount';
      amountEl.textContent = priceParts.amount || String(service.cardPriceText || '');
      priceValue.append(amountEl);
    }
    if (priceSuffix) priceSuffix.textContent = service.cardPriceSuffix;

    if (list) {
      list.innerHTML = '';
      service.cardFeatures.forEach((feature) => {
        const li = document.createElement('li');
        li.textContent = feature;
        list.append(li);
      });
    }
  });
}

function renderBusinessTypes(service) {
  if (!businessTypeBlock || !businessTypeOptions || !businessTypeHint) return;

  if (!service.forms || service.forms.length === 0) {
    businessTypeBlock.setAttribute('hidden', '');
    businessTypeOptions.innerHTML = '';
    businessTypeHint.textContent = '';
    return;
  }

  businessTypeBlock.removeAttribute('hidden');

  if (!serviceState.businessFormId || !service.forms.some((item) => item.id === serviceState.businessFormId)) {
    serviceState.businessFormId = service.defaultFormId || service.forms[0].id;
  }

  businessTypeOptions.innerHTML = '';

  service.forms.forEach((form) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `service-type-btn${form.id === serviceState.businessFormId ? ' is-active' : ''}`;

    const title = document.createElement('strong');
    title.className = 'service-type-btn__title';
    title.textContent = form.title;

    const subtitle = document.createElement('span');
    subtitle.className = 'service-type-btn__subtitle';
    subtitle.textContent = form.fullTitle || form.title;

    const note = document.createElement('small');
    note.className = 'service-type-btn__note';

    if (hasWorkloadPricing(service)) {
      const adjustment = Number(form.monthlyAdjustment || 0);
      note.textContent = adjustment === 0
        ? getNeutralPackageAdjustmentLabel()
        : `${formatMonthlyAdjustment(adjustment)} ${t('perMonthService', '/month')}`;
    } else {
      const fromLabel = form.from ? `${t('fromLabel', 'from')} ` : '';
      note.textContent = `${fromLabel}${formatEuro(form.price)}`;
    }

    button.append(title, subtitle, note);
    button.addEventListener('click', () => {
      serviceState.businessFormId = form.id;
      renderServiceConfigurator();
    });
    businessTypeOptions.append(button);
  });

  const selectedForm = getSelectedForm(service);
  businessTypeHint.textContent = selectedForm?.hint || '';
}

function renderWorkloadPricing(service) {
  if (
    !workloadBlock
    || !workloadIntro
    || !servicePackageTitle
    || !servicePackageHint
    || !servicePackageList
  ) {
    return;
  }

  if (!hasWorkloadPricing(service)) {
    workloadBlock.setAttribute('hidden', '');
    servicePackageList.innerHTML = '';
    servicePackageTitle.textContent = '-';
    servicePackageHint.textContent = '';
    return;
  }

  workloadBlock.removeAttribute('hidden');

  const selectedPackage = getSelectedPackage(service);
  const selectedForm = getSelectedForm(service);
  const adjustment = Number(selectedForm?.monthlyAdjustment || 0);
  const selectedPrice = Math.max(0, Number(selectedPackage?.price || 0) + adjustment);

  workloadIntro.textContent = t(
    'configWorkloadText',
    'Choose a package based on your expected monthly document volume.'
  );
  servicePackageTitle.textContent = `${selectedPackage?.title || '-'} · ${formatEuro(selectedPrice)}${t('perMonthService', '/month')}`;

  if (adjustment === 0) {
    servicePackageHint.textContent = `${selectedPackage?.rangeLabel || ''}.`;
  } else {
    servicePackageHint.textContent = `${selectedPackage?.rangeLabel || ''}. ${selectedForm?.title || ''}: ${formatMonthlyAdjustment(adjustment)}${t('perMonthService', '/month')}.`;
  }

  servicePackageList.innerHTML = '';
  service.workloadPricing.packages.forEach((pkg) => {
    const item = document.createElement('li');
    item.className = `service-package-item${pkg.id === selectedPackage?.id ? ' is-active' : ''}`;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-pressed', pkg.id === selectedPackage?.id ? 'true' : 'false');

    const info = document.createElement('div');
    info.className = 'service-package-item__info';

    const title = document.createElement('strong');
    title.textContent = pkg.title;

    const range = document.createElement('span');
    range.textContent = pkg.rangeLabel;

    const price = document.createElement('strong');
    price.className = 'service-package-item__price';
    price.textContent = `${formatEuro(Math.max(0, Number(pkg.price || 0) + adjustment))}${t('perMonthService', '/month')}`;

    info.append(title, range);
    item.append(info, price);
    item.addEventListener('click', () => {
      if (serviceState.selectedPackageId === pkg.id) return;
      serviceState.selectedPackageId = pkg.id;
      renderServiceConfigurator();
    });
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (serviceState.selectedPackageId === pkg.id) return;
      serviceState.selectedPackageId = pkg.id;
      renderServiceConfigurator();
    });
    servicePackageList.append(item);
  });
}

function renderIncludedServices(service) {
  if (!serviceIncludedList) return;
  serviceIncludedList.innerHTML = '';
  service.includes.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    serviceIncludedList.append(li);
  });
}

function renderExtraServices(service) {
  if (!serviceExtras) return;
  serviceExtras.innerHTML = '';

  service.extras.forEach((extra) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'service-extra';

    const row = document.createElement('label');
    row.className = 'service-extra__main';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = serviceState.selectedExtras.has(extra.id);

    const label = document.createElement('span');
    label.className = 'service-extra__label';
    label.textContent = extra.title;

    const price = document.createElement('strong');
    price.className = 'service-extra__price';
    const priceSuffix = extra.billing === 'monthly' ? t('perMonthService', '/month') : '';
    price.textContent = `+${formatEuro(extra.price)}${priceSuffix}`;

    row.append(checkbox, label, price);
    wrapper.append(row);

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        serviceState.selectedExtras.add(extra.id);
      } else {
        serviceState.selectedExtras.delete(extra.id);
      }
      renderServiceOrder();
    });

    if (extra.quantity) {
      const qtyWrap = document.createElement('div');
      qtyWrap.className = 'service-extra__qty';

      const qtyLabel = document.createElement('span');
      qtyLabel.textContent = t('serviceQuantity', 'Quantity');

      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = '1';
      qtyInput.max = '100';
      qtyInput.step = '1';
      qtyInput.value = String(serviceState.extraQuantities[extra.id] || 1);
      qtyInput.disabled = !checkbox.checked;

      qtyInput.addEventListener('input', () => {
        const value = Number.parseInt(qtyInput.value, 10);
        const valid = Number.isFinite(value) && value > 0 ? value : 1;
        serviceState.extraQuantities[extra.id] = valid;
        qtyInput.value = String(valid);
        renderServiceOrder();
      });

      checkbox.addEventListener('change', () => {
        qtyInput.disabled = !checkbox.checked;
        syncNumberFieldState(qtyInput);
      });

      qtyWrap.append(qtyLabel, qtyInput);
      enhanceNumberInput(qtyInput);
      wrapper.append(qtyWrap);
    }

    serviceExtras.append(wrapper);
  });
}

function renderServiceOrder() {
  const service = getSelectedService();
  if (!service) return;

  renderPeriodHint(service);
  renderRegistrationFeeBlock(service);

  const base = getBasePriceSummary(service);
  const periodMonths = getPeriodMonths();
  const periodRequired = isPeriodRequired(service);
  const hasPeriod = Number.isFinite(periodMonths);
  const selectedPackage = getSelectedPackage(service);

  if (orderService) orderService.textContent = service.title;
  if (orderBasePrice) orderBasePrice.textContent = base.label;
  if (orderPeriod) {
    orderPeriod.textContent = (periodRequired || hasPeriod)
      ? getMonthLabel(periodMonths)
      : t('orderPeriodNotRequired', 'Not required');
  }

  if (service.forms) {
    const selectedForm = getSelectedForm(service);
    orderBusinessRow?.removeAttribute('hidden');
    if (orderBusinessType) {
      orderBusinessType.textContent = selectedForm
        ? `${selectedForm.title} · ${selectedForm.fullTitle || selectedForm.title}`
        : '-';
    }
  } else {
    orderBusinessRow?.setAttribute('hidden', '');
    if (orderBusinessType) orderBusinessType.textContent = '-';
  }

  if (hasWorkloadPricing(service) && selectedPackage) {
    orderPackageRow?.removeAttribute('hidden');
    if (orderPackage) orderPackage.textContent = `${selectedPackage.title} · ${selectedPackage.rangeLabel}`;
  } else {
    orderPackageRow?.setAttribute('hidden', '');
    if (orderPackage) orderPackage.textContent = '-';
  }

  if (!orderExtrasList || !orderTotalPrice) return;

  const activeExtras = service.extras.filter((extra) => serviceState.selectedExtras.has(extra.id));
  orderExtrasList.innerHTML = '';

  let oneTimeAmount = base.oneTime;
  let monthlyAmount = base.monthly;

  const registrationFee = getSelectedRegistrationFee(service);
  if (registrationFee && orderRegFeeRow && orderRegFee) {
    orderRegFeeRow.removeAttribute('hidden');
    orderRegFee.textContent = formatStateFeeLabel({
      stateFee: registrationFee.amount,
      stateFeeFast: registrationFee.fastAmount
    });
    oneTimeAmount += registrationFee.amount;
  } else if (orderRegFeeRow && orderRegFee) {
    orderRegFeeRow.setAttribute('hidden', '');
    orderRegFee.textContent = '-';
  }

  if (activeExtras.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = t('orderNoExtras', 'No extra services');
    orderExtrasList.append(empty);
  } else {
    activeExtras.forEach((extra) => {
      const priceInfo = getExtraPrice(extra);
      const item = document.createElement('li');
      const qtyPart = extra.quantity
        ? ` (${priceInfo.qty} ${extra.quantityLabel || t('serviceQuantityUnit', 'pcs')})`
        : '';

      if (priceInfo.billing === 'monthly') {
        if (Number.isFinite(periodMonths)) {
          const periodTotal = priceInfo.amount * periodMonths;
          item.textContent = `${extra.title}${qtyPart} - +${formatEuro(priceInfo.amount)}${t('perMonthService', '/month')} × ${periodMonths} = ${formatEuro(periodTotal)}`;
        } else {
          item.textContent = `${extra.title}${qtyPart} - +${formatEuro(priceInfo.amount)}${t('perMonthService', '/month')} (${t('orderSelectPeriodShort', 'Select period')})`;
        }
      } else {
        item.textContent = `${extra.title}${qtyPart} - +${formatEuro(priceInfo.amount)}`;
      }

      orderExtrasList.append(item);

      if (priceInfo.billing === 'monthly') {
        monthlyAmount += priceInfo.amount;
      } else {
        oneTimeAmount += priceInfo.amount;
      }
    });
  }

  const hasMonthlyCharges = monthlyAmount > 0;
  const monthlyTotalForPeriod = hasMonthlyCharges && hasPeriod ? monthlyAmount * periodMonths : 0;
  const finalTotal = oneTimeAmount + monthlyTotalForPeriod;

  if (orderMonthlyRow && orderMonthlyTotal) {
    if (hasMonthlyCharges) {
      orderMonthlyRow.removeAttribute('hidden');
      if (hasPeriod) {
        orderMonthlyTotal.textContent = `${formatEuro(monthlyAmount)} × ${periodMonths} = ${formatEuro(monthlyTotalForPeriod)}`;
      } else {
        orderMonthlyTotal.textContent = t('orderSelectPeriodShort', 'Select period');
      }
    } else {
      orderMonthlyRow.setAttribute('hidden', '');
      orderMonthlyTotal.textContent = '0€';
    }
  }

  if (hasMonthlyCharges && !hasPeriod) {
    orderTotalPrice.textContent = t('orderSelectPeriodShort', 'Select period');
  } else {
    orderTotalPrice.textContent = formatEuro(finalTotal);
  }
}

function getOrderSummaryText(service) {
  const lines = [];
  const extras = orderExtrasList
    ? [...orderExtrasList.querySelectorAll('li')].map((item) => item.textContent?.trim()).filter(Boolean)
    : [];

  lines.push(`${t('orderServiceLabel', 'Service')}: ${orderService?.textContent?.trim() || service?.title || '-'}`);

  if (orderBusinessRow && !orderBusinessRow.hasAttribute('hidden')) {
    lines.push(`${t('orderBusinessLabel', 'Business form')}: ${orderBusinessType?.textContent?.trim() || '-'}`);
  }

  if (orderPackageRow && !orderPackageRow.hasAttribute('hidden')) {
    lines.push(`${t('orderPackageLabel', 'Package')}: ${orderPackage?.textContent?.trim() || '-'}`);
  }

  lines.push(`${t('orderBaseLabel', 'Base price')}: ${orderBasePrice?.textContent?.trim() || '-'}`);

  if (orderRegFeeRow && !orderRegFeeRow.hasAttribute('hidden')) {
    lines.push(`${t('orderRegFeeLabel', 'State fee')}: ${orderRegFee?.textContent?.trim() || '-'}`);
  }

  lines.push(`${t('orderPeriodLabel', 'Period')}: ${orderPeriod?.textContent?.trim() || '-'}`);

  if (orderMonthlyRow && !orderMonthlyRow.hasAttribute('hidden')) {
    lines.push(`${t('orderMonthlyLabel', 'Service for period')}: ${orderMonthlyTotal?.textContent?.trim() || '-'}`);
  }

  lines.push(`${t('orderExtrasLabel', 'Additional services')}:`);
  if (extras.length > 0) {
    extras.forEach((extra) => lines.push(`- ${extra}`));
  } else {
    lines.push(`- ${t('orderNoExtras', 'No extra services')}`);
  }

  lines.push(`${t('orderTotalLabel', 'Total amount')}: ${orderTotalPrice?.textContent?.trim() || '-'}`);
  return lines.join('\n');
}

function renderServiceConfigurator() {
  const service = getSelectedService();
  if (!service) return;

  if (servicePeriodSelect) {
    const periodMonths = getPeriodMonths();
    servicePeriodSelect.value = Number.isFinite(periodMonths) ? String(periodMonths) : '';
  }

  if (configServiceTitle) configServiceTitle.textContent = service.title;
  if (configServiceText) configServiceText.textContent = service.description;

  renderBusinessTypes(service);
  renderWorkloadPricing(service);
  renderIncludedServices(service);
  renderExtraServices(service);
  renderServiceOrder();
}

function selectService(serviceId, shouldScroll = false) {
  const service = getServiceCatalog()[serviceId];
  if (!service) return;

  const isNewService = serviceState.serviceId !== serviceId;
  serviceState.serviceId = serviceId;

  if (isNewService) {
    serviceState.selectedExtras = new Set();
    serviceState.extraQuantities = {};
    serviceState.businessFormId = service.defaultFormId || service.forms?.[0]?.id || null;
    serviceState.periodMonths = null;
    serviceState.selectedPackageId = getDefaultPackageId(service);
  }

  if (serviceConfigurator?.hasAttribute('hidden')) {
    serviceConfigurator.removeAttribute('hidden');
  }

  clearPeriodError();

  serviceCards.forEach((card) => {
    card.classList.toggle('is-selected', card.dataset.serviceId === serviceId);
  });

  renderServiceConfigurator();

  if (shouldScroll) {
    serviceConfigurator?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setOrderHint(message, isError = false) {
  if (!serviceOrderHint) return;
  serviceOrderHint.textContent = message;
  serviceOrderHint.classList.toggle('is-error', Boolean(isError));
}

function clearPeriodError() {
  servicePeriodSelect?.classList.remove('is-error');
  servicePeriodWrap?.classList.remove('is-error');
}

function markPeriodError() {
  servicePeriodSelect?.classList.add('is-error');
  servicePeriodWrap?.classList.add('is-error');
}

function clearOrderFieldError(field) {
  field?.classList.remove('is-error');
}

function setOrderFieldError(field) {
  field?.classList.add('is-error');
}

serviceCards.forEach((card) => {
  const serviceId = card.dataset.serviceId;
  if (!serviceId) return;

  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) event.preventDefault();
    selectService(serviceId, true);
  });

  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    selectService(serviceId, true);
  });
});

servicePeriodSelect?.addEventListener('change', () => {
  const value = Number.parseInt(servicePeriodSelect.value, 10);
  serviceState.periodMonths = Number.isFinite(value) && value >= 1 && value <= 12 ? value : null;
  if (hasValidPeriod()) clearPeriodError();
  renderServiceOrder();
});

openOrderFormBtn?.addEventListener('click', () => {
  const service = getSelectedService();

  if (!service) {
    setOrderHint(t('orderSelectServiceFirst', 'Please choose a service first.'), true);
    return;
  }

  if (!hasValidPeriod(service)) {
    markPeriodError();
    setOrderHint(t('orderSelectPeriodError', 'Please select a period from 1 to 12 months.'), true);
    servicePeriodSelect?.focus();
    return;
  }

  serviceOrderForm?.removeAttribute('hidden');
  clearPeriodError();
  setOrderHint('');
  serviceOrderForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const serviceOrderFields = serviceOrderForm
  ? [...serviceOrderForm.querySelectorAll('input, textarea')]
  : [];

serviceOrderFields.forEach((field) => {
  field.addEventListener('input', () => clearOrderFieldError(field));
});

serviceOrderForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!serviceOrderForm) return;

  const service = getSelectedService();
  if (!service) {
    setOrderHint(t('orderSelectServiceFirst', 'Please choose a service first.'), true);
    return;
  }

  if (!hasValidPeriod(service)) {
    markPeriodError();
    setOrderHint(t('orderSelectPeriodError', 'Please select a period from 1 to 12 months.'), true);
    servicePeriodSelect?.focus();
    return;
  }

  const companyInput = serviceOrderForm.querySelector('input[name="order_company"]');
  const personInput = serviceOrderForm.querySelector('input[name="order_name"]');
  const emailInput = serviceOrderForm.querySelector('input[name="order_email"]');
  const phoneInput = serviceOrderForm.querySelector('input[name="order_phone"]');
  const commentInput = serviceOrderForm.querySelector('textarea[name="order_comment"]');

  clearOrderFieldError(companyInput);
  clearOrderFieldError(personInput);
  clearOrderFieldError(emailInput);
  setOrderHint('');

  const company = companyInput?.value.trim() || '';
  const person = personInput?.value.trim() || '';
  const email = emailInput?.value.trim() || '';

  if (!company) {
    setOrderFieldError(companyInput);
    setOrderHint(t('orderCompanyRequired', 'Company name is required.'), true);
    companyInput?.focus();
    return;
  }

  if (!person) {
    setOrderFieldError(personInput);
    setOrderHint(t('orderPersonRequired', 'Name is required.'), true);
    personInput?.focus();
    return;
  }

  if (!email) {
    setOrderFieldError(emailInput);
    setOrderHint(t('orderEmailRequired', 'Email is required.'), true);
    emailInput?.focus();
    return;
  }

  if (!isEmailValue(email)) {
    setOrderFieldError(emailInput);
    setOrderHint(t('orderEmailInvalid', 'Please enter a valid email address.'), true);
    emailInput?.focus();
    return;
  }

  const submitBtn = serviceOrderForm.querySelector('button[type="submit"]');
  submitBtn?.setAttribute('disabled', 'disabled');
  submitBtn?.setAttribute('aria-busy', 'true');
  setOrderHint(t('orderSending', 'Sending request...'));

  try {
    const selectedForm = getSelectedForm(service);
    const periodMonths = getPeriodMonths();
    const selectedPackage = getSelectedPackage(service);
    const comment = commentInput?.value.trim() || '-';
    const orderSummary = getOrderSummaryText(service);
    const phone = phoneInput?.value.trim() || '-';
    const orderMessage = buildServiceOrderMessage({
      company,
      person,
      email,
      phone,
      comment,
      orderSummary
    });
    const formData = new FormData();
    appendSubmissionMeta(formData, `Talcon.ee | ${service.title} | ${company}`);

    formData.append('request_type', 'service_order');
    formData.append('name', person);
    formData.append('email', email);
    formData.append('service', service.title);
    formData.append('business_form', selectedForm?.title || '-');
    formData.append('business_form_full', selectedForm?.fullTitle || selectedForm?.title || '-');
    formData.append('service_package', selectedPackage?.title || '-');
    formData.append('service_package_range', selectedPackage?.rangeLabel || '-');
    formData.append('period_months', Number.isFinite(periodMonths) ? String(periodMonths) : '-');
    formData.append('company_name', company);
    formData.append('name_or_company', company);
    formData.append('contact_name', person);
    formData.append('contact_email', email);
    formData.append('contact_phone', phone);
    formData.append('comment', comment);
    formData.append('message', orderMessage);
    formData.append('order_summary', orderSummary);

    await sendSubmission(formData);
    setOrderHint(t('orderSent', 'Request sent. We will contact you soon.'));
    serviceOrderForm.reset();
    serviceState.periodMonths = null;
    serviceState.selectedExtras = new Set();
    serviceState.extraQuantities = {};
    serviceState.selectedPackageId = getDefaultPackageId(service);
    renderServiceConfigurator();
  } catch (error) {
    console.error(error);
    setOrderHint(t('orderError', 'Request sending failed. Please try again.'), true);
  } finally {
    submitBtn?.removeAttribute('disabled');
    submitBtn?.removeAttribute('aria-busy');
  }
});

// =======================
// Apartment association calculator
// =======================
const ASSOCIATION_BASE_FEE = 30;
const ASSOCIATION_MIN_UNITS = 8;
const ASSOCIATION_MIN_INVOICES = 5;
const ASSOCIATION_MIN_DOCUMENTS = 5;
const ASSOCIATION_UNIT_FEE = 2;
const ASSOCIATION_INVOICE_FEE = 1;
const ASSOCIATION_DOCUMENT_FEE = 1;
const ASSOCIATION_ANNUAL_REPORT_RESERVE_RATE = 0.1;

const ASSOCIATION_EMPLOYEE_PACKAGES = [
  { id: 'none', labelKey: 'associationEmployeesNone', fallbackLabel: 'No employees', price: 0 },
  { id: 'one_to_two', labelKey: 'associationEmployeesOneToTwo', fallbackLabel: '1-2 employees', price: 20 }
];

function normalizeInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function getAssociationField(name) {
  return associationCalculator?.elements?.namedItem(name) || null;
}

function getAssociationSelectValue(name, allowedValues, fallback) {
  const field = getAssociationField(name);
  if (!(field instanceof HTMLSelectElement)) return fallback;
  const normalized = allowedValues.includes(field.value) ? field.value : fallback;
  if (field.value !== normalized) {
    field.value = normalized;
  }
  return normalized;
}

function getAssociationNumberValue(name, min, max, fallback) {
  const field = getAssociationField(name);
  if (!(field instanceof HTMLInputElement)) return fallback;
  const normalized = normalizeInteger(field.value, min, max, fallback);
  if (field.value !== String(normalized)) {
    field.value = String(normalized);
  }
  return normalized;
}

function getAssociationEmployeePackage(packageId) {
  return ASSOCIATION_EMPLOYEE_PACKAGES.find((item) => item.id === packageId) || ASSOCIATION_EMPLOYEE_PACKAGES[0];
}

function getAssociationEmployeePackageValue(name, fallbackId = 'none') {
  return getAssociationSelectValue(
    name,
    ASSOCIATION_EMPLOYEE_PACKAGES.map((item) => item.id),
    fallbackId
  );
}

function getAssociationEmployeePackageLabel(packageId) {
  const employeePackage = getAssociationEmployeePackage(packageId);
  return t(employeePackage.labelKey, employeePackage.fallbackLabel);
}

function calculateAssociationEstimate() {
  if (!associationCalculator) return null;
  const units = getAssociationNumberValue('association_units', ASSOCIATION_MIN_UNITS, 500, ASSOCIATION_MIN_UNITS);
  const invoices = getAssociationNumberValue('association_invoices', ASSOCIATION_MIN_INVOICES, 500, ASSOCIATION_MIN_INVOICES);
  const documents = getAssociationNumberValue('association_documents', ASSOCIATION_MIN_DOCUMENTS, 500, ASSOCIATION_MIN_DOCUMENTS);
  const employeePackageId = getAssociationEmployeePackageValue('association_employees', 'none');
  const employeePackage = getAssociationEmployeePackage(employeePackageId);

  const base = ASSOCIATION_BASE_FEE;
  const unitsFeeAmount = units * ASSOCIATION_UNIT_FEE;
  const invoicesFeeAmount = invoices * ASSOCIATION_INVOICE_FEE;
  const documentsFeeAmount = documents * ASSOCIATION_DOCUMENT_FEE;
  const payrollFeeAmount = employeePackage.price;
  const monthlyServiceAmount = base + unitsFeeAmount + invoicesFeeAmount + documentsFeeAmount + payrollFeeAmount;
  const reportsFeeAmount = monthlyServiceAmount * ASSOCIATION_ANNUAL_REPORT_RESERVE_RATE;
  const total = monthlyServiceAmount + reportsFeeAmount;

  return {
    units,
    invoices,
    documents,
    employeePackageId,
    employeeLabel: getAssociationEmployeePackageLabel(employeePackageId),
    base,
    unitsFeeAmount,
    invoicesFeeAmount,
    documentsFeeAmount,
    payrollFeeAmount,
    monthlyServiceAmount,
    reportsFeeAmount,
    total
  };
}

function getAssociationQuoteSummaryRows(data) {
  if (!data) return [];
  return [
    [t('associationUnitsLabel', 'Apartments'), String(data.units)],
    [t('associationInvoicesLabel', 'Purchase and sales invoices'), String(data.invoices)],
    [t('associationDocumentsLabel', 'Documents per month'), String(data.documents)],
    [t('associationEmployeesLabel', 'Employees'), data.employeeLabel],
    [t('associationReportsFeeLabel', 'Annual report reserve'), formatAssociationEuro(data.reportsFeeAmount)],
    [t('associationTotalFeeLabel', 'Approximate monthly fee'), formatAssociationEuro(data.total)]
  ];
}

function getAssociationQuoteEmailSummary(data) {
  if (!data) return '';

  return [
    `${t('associationBaseFeeLabel', 'Monthly service base')}: ${formatAssociationEuro(data.base)}`,
    `${t('associationUnitsFeeLabel', 'Apartments')}: ${data.units} × ${formatAssociationEuro(ASSOCIATION_UNIT_FEE)} = ${formatAssociationEuro(data.unitsFeeAmount)}`,
    `${t('associationInvoicesFeeLabel', 'Purchase and sales invoices')}: ${data.invoices} × ${formatAssociationEuro(ASSOCIATION_INVOICE_FEE)} = ${formatAssociationEuro(data.invoicesFeeAmount)}`,
    `${t('associationDocumentsPackageFeeLabel', 'Documents')}: ${data.documents} × ${formatAssociationEuro(ASSOCIATION_DOCUMENT_FEE)} = ${formatAssociationEuro(data.documentsFeeAmount)}`,
    `${t('associationPayrollFeeLabel', 'Employees')}: ${data.employeeLabel} = ${formatAssociationEuro(data.payrollFeeAmount)}`,
    `${t('associationReportsFeeLabel', 'Annual report reserve')}: ${formatAssociationEuro(data.monthlyServiceAmount)} × 10% = ${formatAssociationEuro(data.reportsFeeAmount)}`,
    `${t('associationTotalFeeLabel', 'Approximate monthly fee')}: ${formatAssociationEuro(data.total)}`
  ].join('\n');
}

function renderAssociationQuoteContext() {
  if (!quoteContext || !quoteContextList) return;

  if (!pendingAssociationQuote) {
    quoteContext.setAttribute('hidden', '');
    quoteContextList.innerHTML = '';
    return;
  }

  quoteContext.removeAttribute('hidden');
  quoteContextList.innerHTML = '';

  getAssociationQuoteSummaryRows(pendingAssociationQuote).forEach(([label, value]) => {
    const item = document.createElement('li');
    const title = document.createElement('span');
    const amount = document.createElement('strong');
    title.textContent = label;
    amount.textContent = value;
    item.append(title, amount);
    quoteContextList.append(item);
  });
}

function renderAssociationEstimate() {
  const data = calculateAssociationEstimate();
  if (!data) return;

  if (associationBaseFee) associationBaseFee.textContent = formatAssociationEuro(data.base);
  if (associationUnitsFee) associationUnitsFee.textContent = formatAssociationEuro(data.unitsFeeAmount);
  if (associationInvoicesFee) associationInvoicesFee.textContent = formatAssociationEuro(data.invoicesFeeAmount);
  if (associationDocumentsPackageFee) associationDocumentsPackageFee.textContent = formatAssociationEuro(data.documentsFeeAmount);
  if (associationPayrollFee) associationPayrollFee.textContent = formatAssociationEuro(data.payrollFeeAmount);
  if (associationReportsFee) associationReportsFee.textContent = formatAssociationEuro(data.reportsFeeAmount);
  if (associationTotalFee) associationTotalFee.textContent = formatAssociationEuro(data.total);

  if (pendingAssociationQuote) {
    pendingAssociationQuote = data;
    renderAssociationQuoteContext();
  }
}

associationCalculator?.addEventListener('input', () => {
  renderAssociationEstimate();
});

associationCalculator?.addEventListener('change', () => {
  renderAssociationEstimate();
});

// =======================
// Payroll calculator
// =======================
const payrollOpenBtn = document.querySelector('[data-open-payroll]');
const payrollModal = document.getElementById('payrollModal');
const closePayrollModalBtn = document.getElementById('closePayrollModal');
const payrollForm = document.getElementById('payrollForm');
const payrollHint = document.getElementById('payrollHint');
const payrollResult = document.getElementById('payrollResult');
const payrollResultList = document.getElementById('payrollResultList');

const PAYROLL_RATES = {
  taxFreeAmount: 700,
  incomeTax: 0.22,
  employeeUnemployment: 0.016,
  employerUnemployment: 0.008,
  socialTax: 0.33
};

let payrollCloseTimer = null;
let payrollLastResult = null;
let pendingAssociationQuote = null;

function formatPayrollEuro(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${new Intl.NumberFormat(LANG_LOCALE[currentLang] || 'et-EE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(safeValue)} €`;
}

function setPayrollHint(message, isError = false) {
  if (!payrollHint) return;
  payrollHint.textContent = message;
  payrollHint.classList.toggle('is-error', Boolean(isError));
}

function clearPayrollResult() {
  payrollResult?.setAttribute('hidden', '');
  if (payrollResultList) payrollResultList.innerHTML = '';
  payrollLastResult = null;
}

function clearPayrollAmountError() {
  const amountInput = payrollForm?.querySelector('input[name="payroll_amount"]');
  amountInput?.classList.remove('is-error');
}

function markPayrollAmountError() {
  const amountInput = payrollForm?.querySelector('input[name="payroll_amount"]');
  amountInput?.classList.add('is-error');
}

function resetPayrollCalculator() {
  payrollForm?.reset();
  clearPayrollAmountError();
  setPayrollHint('');
  clearPayrollResult();
}

function openPayrollCalculator() {
  if (!payrollModal) return;
  if (!payrollModal.hasAttribute('hidden')) return;

  if (payrollCloseTimer) {
    clearTimeout(payrollCloseTimer);
    payrollCloseTimer = null;
  }

  payrollModal.removeAttribute('hidden');
  requestAnimationFrame(() => payrollModal.classList.add('is-open'));
}

function closePayrollCalculator() {
  if (!payrollModal) return;
  if (payrollModal.hasAttribute('hidden')) return;

  payrollModal.classList.remove('is-open');

  if (payrollCloseTimer) clearTimeout(payrollCloseTimer);
  payrollCloseTimer = setTimeout(() => {
    payrollModal.setAttribute('hidden', '');
    resetPayrollCalculator();
    payrollCloseTimer = null;
  }, 220);
}

function calculateFromGross(gross, pensionRate, hasUnemployment, useTaxFree) {
  const employeeUnemploymentRate = hasUnemployment ? PAYROLL_RATES.employeeUnemployment : 0;
  const employeeUnemployment = gross * employeeUnemploymentRate;
  const pension = gross * pensionRate;
  const taxableBaseBeforeTaxFree = Math.max(0, gross - employeeUnemployment - pension);
  const appliedTaxFree = useTaxFree
    ? Math.min(PAYROLL_RATES.taxFreeAmount, taxableBaseBeforeTaxFree)
    : 0;
  const taxableIncome = Math.max(0, taxableBaseBeforeTaxFree - appliedTaxFree);
  const incomeTax = taxableIncome * PAYROLL_RATES.incomeTax;
  const net = Math.max(0, gross - employeeUnemployment - pension - incomeTax);
  const employerCost = gross
    + gross * PAYROLL_RATES.socialTax
    + (hasUnemployment ? gross * PAYROLL_RATES.employerUnemployment : 0);

  return {
    gross,
    net,
    incomeTax,
    employeeUnemployment,
    pension,
    appliedTaxFree,
    employerCost
  };
}

function calculateFromNet(net, pensionRate, hasUnemployment, useTaxFree) {
  const employeeUnemploymentRate = hasUnemployment ? PAYROLL_RATES.employeeUnemployment : 0;
  const deductionRate = employeeUnemploymentRate + pensionRate;
  const netBeforeIncomeTaxFactor = 1 - deductionRate;
  if (netBeforeIncomeTaxFactor <= 0) return null;

  let gross = 0;

  if (useTaxFree) {
    const thresholdGross = PAYROLL_RATES.taxFreeAmount / netBeforeIncomeTaxFactor;

    if (net <= PAYROLL_RATES.taxFreeAmount) {
      gross = net / netBeforeIncomeTaxFactor;
    } else {
      gross = (net - PAYROLL_RATES.incomeTax * PAYROLL_RATES.taxFreeAmount)
        / ((1 - PAYROLL_RATES.incomeTax) * netBeforeIncomeTaxFactor);
    }

    if (gross < thresholdGross && net > PAYROLL_RATES.taxFreeAmount) {
      gross = thresholdGross;
    }
  } else {
    const netFactor = netBeforeIncomeTaxFactor * (1 - PAYROLL_RATES.incomeTax);
    if (netFactor <= 0) return null;
    gross = net / netFactor;
  }

  if (!Number.isFinite(gross) || gross <= 0) return null;

  const fromGross = calculateFromGross(gross, pensionRate, hasUnemployment, useTaxFree);
  return {
    ...fromGross,
    requestedNet: net
  };
}

function renderPayrollRows(mode, data, useTaxFree) {
  if (!payrollResult || !payrollResultList) return;
  payrollResultList.innerHTML = '';

  const rows = mode === 'grossToNet'
    ? [
      [t('payrollRowGross', 'Gross salary'), data.gross],
      [t('payrollRowNet', 'Net salary'), data.net],
      [t('payrollRowIncomeTax', 'Income tax'), data.incomeTax],
      [t('payrollRowEmployeeUnemployment', 'Employee unemployment insurance'), data.employeeUnemployment],
      [t('payrollRowPension', 'Funded pension'), data.pension],
      [t('payrollRowEmployerCost', 'Employer total cost'), data.employerCost]
    ]
    : [
      [t('payrollRowNet', 'Net salary'), data.requestedNet],
      [t('payrollRowEstimatedGross', 'Estimated gross'), data.gross],
      [t('payrollRowIncomeTax', 'Income tax'), data.incomeTax],
      [t('payrollRowEmployeeUnemployment', 'Employee unemployment insurance'), data.employeeUnemployment],
      [t('payrollRowPension', 'Funded pension'), data.pension],
      [t('payrollRowEmployerCost', 'Employer total cost'), data.employerCost]
    ];

  if (useTaxFree) {
    rows.splice(3, 0, [t('payrollRowTaxFreeApplied', 'Applied tax-free income'), data.appliedTaxFree]);
  }

  rows.forEach(([label, value]) => {
    const row = document.createElement('li');
    const key = document.createElement('span');
    key.textContent = label;
    const amount = document.createElement('strong');
    amount.textContent = formatPayrollEuro(value);
    row.append(key, amount);
    payrollResultList.append(row);
  });

  payrollResult.removeAttribute('hidden');
  payrollLastResult = { mode, data, useTaxFree };
  payrollResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

payrollOpenBtn?.addEventListener('click', (event) => {
  event.preventDefault();
  openPayrollCalculator();
});

closePayrollModalBtn?.addEventListener('click', () => {
  closePayrollCalculator();
});

payrollModal?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.hasAttribute('data-payroll-close')) {
    closePayrollCalculator();
  }
});

payrollForm?.querySelector('input[name="payroll_amount"]')?.addEventListener('input', () => {
  clearPayrollAmountError();
  setPayrollHint('');
});

payrollForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!payrollForm) return;

  clearPayrollAmountError();
  setPayrollHint('');

  const mode = payrollForm.querySelector('input[name="payroll_mode"]:checked')?.value || 'grossToNet';
  const amountInput = payrollForm.querySelector('input[name="payroll_amount"]');
  const amountValue = Number.parseFloat(String(amountInput?.value || '').replace(',', '.'));
  const pensionRateValue = Number.parseFloat(String(
    payrollForm.querySelector('select[name="payroll_pension_rate"]')?.value || '0'
  ));
  const pensionRate = Number.isFinite(pensionRateValue) ? pensionRateValue / 100 : 0;
  const hasUnemployment = Boolean(payrollForm.querySelector('input[name="payroll_unemployment"]')?.checked);
  const useTaxFree = Boolean(payrollForm.querySelector('input[name="payroll_taxfree"]')?.checked);

  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    markPayrollAmountError();
    clearPayrollResult();
    setPayrollHint(t('payrollHintAmountInvalid', 'Please enter a valid amount.'), true);
    amountInput?.focus();
    return;
  }

  const result = mode === 'grossToNet'
    ? calculateFromGross(amountValue, pensionRate, hasUnemployment, useTaxFree)
    : calculateFromNet(amountValue, pensionRate, hasUnemployment, useTaxFree);

  if (!result) {
    clearPayrollResult();
    setPayrollHint(t('payrollHintImpossible', 'Calculation is not possible with the selected inputs.'), true);
    return;
  }

  renderPayrollRows(mode, result, useTaxFree);
});

// =======================
// Contact form (demo UX)
// =======================
const form = document.getElementById('contactForm');
const hint = document.getElementById('formHint');
const fileInput = document.getElementById('formFile');
const fileChooseBtn = document.getElementById('formFileChoose');
const fileHint = document.getElementById('fileHint');
const filePicker = form?.querySelector('.file-field__picker');
const nameInput = form?.querySelector('input[name="client_name"]');
const emailInput = form?.querySelector('input[name="contact_email"]');
const ALLOWED_ATTACHMENT_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'pdf', 'xls']);
const ALLOWED_ATTACHMENT_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/xls',
  'application/x-excel'
]);

let hasInvalidAttachment = false;

let hintTimer = null;

function activateAssociationQuoteRequest() {
  const data = calculateAssociationEstimate();
  if (!data) return;

  pendingAssociationQuote = data;
  renderAssociationQuoteContext();
  setHint(
    t(
      'associationQuoteContactHint',
      'The apartment association calculator data will be attached to the email automatically. Name/company and email are enough.'
    ),
    false,
    false
  );
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  nameInput?.focus();
}

function clearAssociationQuoteRequest() {
  pendingAssociationQuote = null;
  renderAssociationQuoteContext();
}

function setHint(message, isError = false, autoClear = true) {
  if (!hint) return;
  hint.textContent = message;
  hint.classList.toggle('is-error', Boolean(isError));

  if (hintTimer) clearTimeout(hintTimer);

  if (!autoClear) return;
  hintTimer = setTimeout(() => {
    if (!hint) return;
    hint.textContent = '';
    hint.classList.remove('is-error');
  }, 5000);
}

function updateFileHint() {
  if (!fileHint) return;
  if (fileInput?.files && fileInput.files.length > 0) {
    fileHint.textContent = fileInput.files[0].name;
    return;
  }
  fileHint.textContent = t('formNoFile', 'No file selected');
}

function markFileError() {
  filePicker?.classList.add('is-error');
}

function clearFileError() {
  filePicker?.classList.remove('is-error');
}

function getExtension(filename) {
  const name = String(filename || '').trim().toLowerCase();
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex < 0 || dotIndex === name.length - 1) return '';
  return name.slice(dotIndex + 1);
}

function isAllowedAttachment(file) {
  if (!file) return true;
  const ext = getExtension(file.name);
  if (ext && ALLOWED_ATTACHMENT_EXTENSIONS.has(ext)) return true;
  const mimeType = String(file.type || '').toLowerCase();
  if (mimeType && ALLOWED_ATTACHMENT_MIME_TYPES.has(mimeType)) return true;
  return false;
}

function validateAttachmentSelection() {
  const selectedFile = fileInput?.files?.[0];
  if (!selectedFile) {
    hasInvalidAttachment = false;
    clearFileError();
    updateFileHint();
    return true;
  }

  if (!isAllowedAttachment(selectedFile)) {
    hasInvalidAttachment = true;
    markFileError();
    if (fileInput) fileInput.value = '';
    updateFileHint();
    return false;
  }

  hasInvalidAttachment = false;
  clearFileError();
  updateFileHint();
  return true;
}

fileInput?.addEventListener('change', () => {
  validateAttachmentSelection();
});

fileChooseBtn?.addEventListener('click', () => {
  fileInput?.click();
});

associationQuoteBtn?.addEventListener('click', () => {
  activateAssociationQuoteRequest();
});

quoteContextEdit?.addEventListener('click', () => {
  associationCalculator?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function clearFieldError(field) {
  field?.classList.remove('is-error');
}

function markFieldError(field) {
  field?.classList.add('is-error');
}

function buildServiceOrderMessage({ company, person, email, phone, comment, orderSummary }) {
  const parts = [
    `Company: ${company}`,
    `Contact person: ${person}`,
    `Email: ${email}`
  ];

  if (phone && phone !== '-') {
    parts.push(`Phone: ${phone}`);
  }

  if (comment && comment !== '-') {
    parts.push(`Comment: ${comment}`);
  }

  if (orderSummary) {
    parts.push(orderSummary);
  }

  return parts.join('\n\n').trim();
}

function buildQuickContactMessage(messageValue, hasFile, associationQuote) {
  const parts = [];
  const normalizedMessage = String(messageValue || '').trim();

  if (normalizedMessage) {
    parts.push(normalizedMessage);
  }

  if (associationQuote) {
    parts.push(getAssociationQuoteEmailSummary(associationQuote));
  }

  if (hasFile) {
    parts.push('Attachment included by client.');
  }

  return parts.join('\n\n').trim() || '-';
}

nameInput?.addEventListener('input', () => clearFieldError(nameInput));
emailInput?.addEventListener('input', () => clearFieldError(emailInput));

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  clearFieldError(nameInput);
  clearFieldError(emailInput);

  const nameValue = nameInput?.value.trim() || '';
  const emailValue = emailInput?.value.trim() || '';

  if (hasInvalidAttachment || !validateAttachmentSelection()) {
    markFileError();
    setHint('', false, false);
    fileChooseBtn?.focus();
    return;
  }

  if (!nameValue) {
    markFieldError(nameInput);
    setHint(t('formNeedName', 'The name or company field is required.'), true, false);
    nameInput?.focus();
    return;
  }

  if (!emailValue) {
    markFieldError(emailInput);
    setHint(t('formNeedEmail', 'Email is required.'), true, false);
    emailInput?.focus();
    return;
  }

  if (!isEmailValue(emailValue)) {
    markFieldError(emailInput);
    setHint(t('formEmailInvalid', 'Please enter a valid email address.'), true, false);
    emailInput?.focus();
    return;
  }

  const messageField = form.querySelector('textarea[name="message"]');
  const hasMessage = Boolean(messageField?.value.trim());
  const hasFile = Boolean(fileInput?.files && fileInput.files.length > 0);
  const hasAttachedQuote = Boolean(pendingAssociationQuote);

  if (!hasMessage && !hasFile && !hasAttachedQuote) {
    setHint(t('formNeedMsgOrFile', 'Please add a message or attach a file.'), true, false);
    messageField?.focus();
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn?.setAttribute('disabled', 'disabled');
  submitBtn?.setAttribute('aria-busy', 'true');

  setHint(t('formSending', 'Sending…'), false, false);

  try {
    const payload = new FormData();
    const isAssociationQuote = Boolean(pendingAssociationQuote);
    const associationQuote = pendingAssociationQuote;
    appendSubmissionMeta(
      payload,
      isAssociationQuote
        ? `Talcon.ee | Apartment association quote | ${nameValue}`
        : `Talcon.ee | Quick contact | ${nameValue}`
    );
    payload.append('request_type', isAssociationQuote ? 'association_quote' : 'quick_contact');
    payload.append('name', nameValue);
    payload.append('email', emailValue);
    payload.append('name_or_company', nameValue);
    payload.append('contact_email', emailValue);
    const messageBody = buildQuickContactMessage(
      messageField?.value.trim() || '',
      Boolean(fileInput?.files && fileInput.files.length > 0),
      associationQuote
    );
    payload.append('message', messageBody);

    if (associationQuote) {
      payload.append('quote_source', 'apartment_association_calculator');
      payload.append('association_units', String(associationQuote.units));
      payload.append('association_invoices', String(associationQuote.invoices));
      payload.append('association_documents', String(associationQuote.documents));
      payload.append('association_employee_package', associationQuote.employeePackageId);
      payload.append('association_employee_label', associationQuote.employeeLabel);
      payload.append('association_base_fee', formatAssociationEuro(associationQuote.base));
      payload.append('association_units_fee', formatAssociationEuro(associationQuote.unitsFeeAmount));
      payload.append('association_invoices_fee', formatAssociationEuro(associationQuote.invoicesFeeAmount));
      payload.append('association_documents_fee', formatAssociationEuro(associationQuote.documentsFeeAmount));
      payload.append('association_payroll_fee', formatAssociationEuro(associationQuote.payrollFeeAmount));
      payload.append('association_annual_report_fee', formatAssociationEuro(associationQuote.reportsFeeAmount));
      payload.append('association_monthly_service_fee', formatAssociationEuro(associationQuote.monthlyServiceAmount));
      payload.append('association_estimated_total', formatAssociationEuro(associationQuote.total));
      payload.append('association_quote_summary', getAssociationQuoteEmailSummary(associationQuote));
    }

    if (fileInput?.files && fileInput.files.length > 0) {
      payload.append('attachment', fileInput.files[0]);
    }

    await sendSubmission(payload);
    setHint(t('formSent', 'Sent! We will contact you soon.'));
    form.reset();
    hasInvalidAttachment = false;
    clearFileError();
    clearAssociationQuoteRequest();
    updateFileHint();
  } catch (err) {
    console.error(err);
    setHint(t('formError', 'Something went wrong. Please try again.'), true, false);
  } finally {
    submitBtn?.removeAttribute('disabled');
    submitBtn?.removeAttribute('aria-busy');
  }
});

// =======================
// Language application
// =======================
function applyTranslations(lang) {
  const I18N = window.I18N || {};
  const dict = I18N[lang] || I18N.et || {};

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = dict[key];
    if (typeof val === 'string') el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = dict[key];
    if (typeof val === 'string') el.setAttribute('placeholder', val);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    const val = dict[key];
    if (typeof val === 'string') el.setAttribute('aria-label', val);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const val = dict[key];
    if (typeof val === 'string') el.setAttribute('title', val);
  });

  updateLangSwitchCurrent(lang);
  updateLangSelectLabels();
  requestAnimationFrame(updateTrustBadgesAlignment);

  renderServiceCards();
  if (serviceState.serviceId) {
    renderServiceConfigurator();
  } else {
    if (orderPeriod) orderPeriod.textContent = t('orderPeriodNotSelected', 'Not selected');
    if (orderExtrasList && orderExtrasList.children.length === 1) {
      const first = orderExtrasList.querySelector('li');
      if (first) first.textContent = t('orderNoExtras', 'No extra services');
    }
  }

  if (payrollLastResult) {
    renderPayrollRows(payrollLastResult.mode, payrollLastResult.data, payrollLastResult.useTaxFree);
  }

  renderAssociationEstimate();
  updateFileHint();
  refreshNumberStepperLabels();
  localStorage.setItem(LANG_KEY, lang);
}

function setLanguage(lang) {
  if (!lang || !SUPPORTED.includes(lang)) return;
  currentLang = lang;
  applyTranslations(currentLang);
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closePayrollCalculator();
});

applyTranslations(currentLang);
updateLangSelectLabels();
updateTrustBadgesAlignment();
updateFileHint();
renderServiceCards();
renderAssociationEstimate();
enhanceNumberInputs();

window.addEventListener('load', () => {
  updateTrustBadgesAlignment();
  setTimeout(updateTrustBadgesAlignment, 250);
  setTimeout(updateTrustBadgesAlignment, 900);
  setTimeout(updateTrustBadgesAlignment, 1600);
});

if (document.fonts?.ready) {
  document.fonts.ready.then(() => {
    updateTrustBadgesAlignment();
  }).catch(() => {
    // ignore font-loading errors
  });
}
