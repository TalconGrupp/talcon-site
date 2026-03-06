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
const MAILBOX_ENDPOINT = 'https://formsubmit.co/ajax/talcon.grupp@gmail.com';

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
      title: 'Ettevõtte registreerimine',
      cardText: 'Abi erinevate ärivormide registreerimisel Eestis.',
      cardPriceText: 'alates 99€',
      cardPriceSuffix: 'ühekordne',
      cardFeatures: [
        'Konsultatsioon ja vormi valik',
        'Dokumentide ettevalmistus',
        'Esitamise tugi',
        'Abi registreerimisel'
      ],
      description: 'Aitame registreerida erinevaid ärivorme Eestis. Riigilõiv registrikande eest lisandub teenuse hinnale.',
      baseBilling: 'one-time',
      forms: [
        { id: 'fie', title: 'FIE', price: 99, stateFee: 20 },
        { id: 'ou', title: 'OÜ', price: 149, stateFee: 200, stateFeeFast: 265 },
        { id: 'mtu', title: 'MTÜ', price: 129, stateFee: 30 },
        { id: 'as', title: 'AS', price: 299, from: true, stateFee: 200, stateFeeFast: 265 }
      ],
      includes: [
        'konsultatsioon',
        'dokumentide ettevalmistus',
        'esitamise tugi',
        'abi registreerimisel'
      ],
      extras: [
        { id: 'vat-registration', title: 'KMKR (VAT) registreerimine', price: 80, billing: 'one-time' },
        { id: 'bookkeeping-after-registration', title: 'Raamatupidamine pärast registreerimist', price: 99, billing: 'monthly' },
        { id: 'annual-report', title: 'Aastaaruanne', price: 150, billing: 'one-time' },
        { id: 'bank-support', title: 'Abi panga või makselahendusega', price: 50, billing: 'one-time' }
      ]
    },
    accounting: {
      title: 'Raamatupidamise tugi',
      cardText: 'Igakuine raamatupidamine ja aruandlus ettevõtetele Eestis.',
      cardPriceText: '159€',
      cardPriceSuffix: '/kuu',
      cardFeatures: [
        'Igakuine raamatupidamine',
        'Maksudeklaratsioonide esitamine',
        'Palgaarvestus',
        'Käibedeklaratsioonid'
      ],
      description: 'Baashind: 159€/kuu.',
      basePrice: 159,
      baseBilling: 'monthly',
      includes: [
        'igakuine raamatupidamine',
        'maksudeklaratsioonide esitamine',
        'palgaarvestus',
        'käibedeklaratsioonid'
      ],
      extras: [
        { id: 'annual-report', title: 'Aastaaruanne', price: 150, billing: 'one-time' },
        { id: 'vat-registration', title: 'KMKR (VAT) registreerimine', price: 80, billing: 'one-time' },
        { id: 'statistics', title: 'Statistilised aruanded', price: 15, billing: 'monthly' },
        { id: 'extra-employee', title: 'Lisatöötaja', price: 10, billing: 'monthly', quantity: true, quantityLabel: 'inim.' }
      ]
    },
    taxes: {
      title: 'Maksud ja aruandlus',
      cardText: 'Maksuteenused koos tähtaegade kontrolli ja konsultatsiooniga.',
      cardPriceText: '249€',
      cardPriceSuffix: '/kuu',
      cardFeatures: [
        'Maksudeklaratsioonid',
        'Tähtaegade kontroll',
        'Baaskonsultatsioon',
        'Aruandluse tugi'
      ],
      description: 'Baashind: 249€/kuu.',
      basePrice: 249,
      baseBilling: 'monthly',
      includes: [
        'maksudeklaratsioonid',
        'tähtaegade kontroll',
        'baaskonsultatsioon'
      ],
      extras: [
        { id: 'vat', title: 'VAT', price: 80, billing: 'monthly' },
        { id: 'tsd', title: 'TSD', price: 20, billing: 'monthly' },
        { id: 'statistics', title: 'Statistika', price: 15, billing: 'monthly' },
        { id: 'tax-office-answers', title: 'Vastused Maksu- ja Tolliametile', price: 50, billing: 'monthly' }
      ]
    }
  },
  ru: {
    registration: {
      title: 'Регистрация бизнеса',
      cardText: 'Помощь с регистрацией разных форм бизнеса в Эстонии.',
      cardPriceText: 'от 99€',
      cardPriceSuffix: 'разово',
      cardFeatures: [
        'Консультация и выбор формы',
        'Подготовка документов',
        'Сопровождение подачи',
        'Помощь с регистрацией'
      ],
      description: 'Помощь с регистрацией разных форм бизнеса в Эстонии. Госпошлина за внесение в регистр добавляется к стоимости.',
      baseBilling: 'one-time',
      forms: [
        { id: 'fie', title: 'FIE', price: 99, stateFee: 20 },
        { id: 'ou', title: 'OÜ', price: 149, stateFee: 200, stateFeeFast: 265 },
        { id: 'mtu', title: 'MTÜ', price: 129, stateFee: 30 },
        { id: 'as', title: 'AS', price: 299, from: true, stateFee: 200, stateFeeFast: 265 }
      ],
      includes: [
        'консультация',
        'подготовка документов',
        'сопровождение подачи',
        'помощь с регистрацией'
      ],
      extras: [
        { id: 'vat-registration', title: 'VAT регистрация', price: 80, billing: 'one-time' },
        { id: 'bookkeeping-after-registration', title: 'Бухгалтерия после регистрации', price: 99, billing: 'monthly' },
        { id: 'annual-report', title: 'Годовой отчёт', price: 150, billing: 'one-time' },
        { id: 'bank-support', title: 'Помощь с банком или платёжной системой', price: 50, billing: 'one-time' }
      ]
    },
    accounting: {
      title: 'Бухгалтерское сопровождение',
      cardText: 'Ежемесячная бухгалтерия и отчётность для компаний в Эстонии.',
      cardPriceText: '159€',
      cardPriceSuffix: '/месяц',
      cardFeatures: [
        'Ежемесячная бухгалтерия',
        'Подача налоговых деклараций',
        'Расчёт зарплаты',
        'Декларации по НДС'
      ],
      description: 'Базовая цена: 159€/месяц.',
      basePrice: 159,
      baseBilling: 'monthly',
      includes: [
        'ежемесячная бухгалтерия',
        'подача налоговых деклараций',
        'расчёт зарплаты',
        'декларации по НДС'
      ],
      extras: [
        { id: 'annual-report', title: 'Годовой отчёт', price: 150, billing: 'one-time' },
        { id: 'vat-registration', title: 'VAT регистрация', price: 80, billing: 'one-time' },
        { id: 'statistics', title: 'Статистические отчёты', price: 15, billing: 'monthly' },
        { id: 'extra-employee', title: 'Дополнительный сотрудник', price: 10, billing: 'monthly', quantity: true, quantityLabel: 'чел.' }
      ]
    },
    taxes: {
      title: 'Налоги и отчётность',
      cardText: 'Налоговое сопровождение с контролем сроков и консультацией.',
      cardPriceText: '249€',
      cardPriceSuffix: '/месяц',
      cardFeatures: [
        'Налоговые декларации',
        'Контроль сроков',
        'Базовая консультация',
        'Поддержка по отчётности'
      ],
      description: 'Базовая цена: 249€/месяц.',
      basePrice: 249,
      baseBilling: 'monthly',
      includes: [
        'налоговые декларации',
        'контроль сроков',
        'базовая консультация'
      ],
      extras: [
        { id: 'vat', title: 'VAT', price: 80, billing: 'monthly' },
        { id: 'tsd', title: 'TSD', price: 20, billing: 'monthly' },
        { id: 'statistics', title: 'Статистика', price: 15, billing: 'monthly' },
        { id: 'tax-office-answers', title: 'Ответы налоговой', price: 50, billing: 'monthly' }
      ]
    }
  },
  en: {
    registration: {
      title: 'Business Registration',
      cardText: 'Help with registering different business forms in Estonia.',
      cardPriceText: 'from 99€',
      cardPriceSuffix: 'one-time',
      cardFeatures: [
        'Consultation and form selection',
        'Document preparation',
        'Filing support',
        'Registration assistance'
      ],
      description: 'Help with registering different business forms in Estonia. State fee for legal-entity register entry is added to the service cost.',
      baseBilling: 'one-time',
      forms: [
        { id: 'fie', title: 'FIE', price: 99, stateFee: 20 },
        { id: 'ou', title: 'OÜ', price: 149, stateFee: 200, stateFeeFast: 265 },
        { id: 'mtu', title: 'MTÜ', price: 129, stateFee: 30 },
        { id: 'as', title: 'AS', price: 299, from: true, stateFee: 200, stateFeeFast: 265 }
      ],
      includes: [
        'consultation',
        'document preparation',
        'filing support',
        'registration assistance'
      ],
      extras: [
        { id: 'vat-registration', title: 'VAT registration', price: 80, billing: 'one-time' },
        { id: 'bookkeeping-after-registration', title: 'Bookkeeping after registration', price: 99, billing: 'monthly' },
        { id: 'annual-report', title: 'Annual report', price: 150, billing: 'one-time' },
        { id: 'bank-support', title: 'Bank or payment system support', price: 50, billing: 'one-time' }
      ]
    },
    accounting: {
      title: 'Accounting Support',
      cardText: 'Monthly bookkeeping and reporting for companies in Estonia.',
      cardPriceText: '159€',
      cardPriceSuffix: '/month',
      cardFeatures: [
        'Monthly bookkeeping',
        'Tax declaration filing',
        'Payroll calculation',
        'VAT declarations'
      ],
      description: 'Base price: 159€/month.',
      basePrice: 159,
      baseBilling: 'monthly',
      includes: [
        'monthly bookkeeping',
        'tax declaration filing',
        'payroll calculation',
        'VAT declarations'
      ],
      extras: [
        { id: 'annual-report', title: 'Annual report', price: 150, billing: 'one-time' },
        { id: 'vat-registration', title: 'VAT registration', price: 80, billing: 'one-time' },
        { id: 'statistics', title: 'Statistical reports', price: 15, billing: 'monthly' },
        { id: 'extra-employee', title: 'Additional employee', price: 10, billing: 'monthly', quantity: true, quantityLabel: 'person' }
      ]
    },
    taxes: {
      title: 'Taxes and Reporting',
      cardText: 'Tax support with deadline control and consultation.',
      cardPriceText: '249€',
      cardPriceSuffix: '/month',
      cardFeatures: [
        'Tax declarations',
        'Deadline control',
        'Basic consultation',
        'Reporting support'
      ],
      description: 'Base price: 249€/month.',
      basePrice: 249,
      baseBilling: 'monthly',
      includes: [
        'tax declarations',
        'deadline control',
        'basic consultation'
      ],
      extras: [
        { id: 'vat', title: 'VAT', price: 80, billing: 'monthly' },
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

const serviceState = {
  serviceId: null,
  businessFormId: null,
  selectedExtras: new Set(),
  extraQuantities: {},
  periodMonths: null
};

function formatEuro(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0€';
  const normalized = Math.round(n * 100) / 100;
  const output = Number.isInteger(normalized) ? String(normalized) : String(normalized).replace('.', ',');
  return `${output}€`;
}

function isEmailValue(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function appendSubmissionMeta(formData, subject, replyTo = '') {
  formData.append('_subject', subject);
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');
  formData.append('site', 'talcon.ee');
  formData.append('page_url', window.location.href);
  formData.append('language', currentLang);
  formData.append('submitted_at', new Date().toISOString());
  if (replyTo) formData.append('_replyto', replyTo);
}

async function sendSubmission(formData) {
  const response = await fetch(MAILBOX_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const isSuccess = payload?.success === true || payload?.success === 'true';
  if (!response.ok || !isSuccess) {
    throw new Error(payload?.message || `Submission failed with status ${response.status}`);
  }

  return payload;
}

function getSelectedService() {
  if (!serviceState.serviceId) return null;
  return getServiceCatalog()[serviceState.serviceId] || null;
}

function getSelectedForm(service) {
  if (!service?.forms) return null;
  return service.forms.find((form) => form.id === serviceState.businessFormId) || service.forms[0];
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

  if (serviceState.serviceId !== 'registration' || !service?.forms?.length) {
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
  if (serviceState.serviceId !== 'registration' || !service?.forms?.length) return null;
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
  if (!businessTypeBlock || !businessTypeOptions) return;

  if (!service.forms || service.forms.length === 0) {
    businessTypeBlock.setAttribute('hidden', '');
    businessTypeOptions.innerHTML = '';
    return;
  }

  businessTypeBlock.removeAttribute('hidden');

  if (!serviceState.businessFormId || !service.forms.some((item) => item.id === serviceState.businessFormId)) {
    serviceState.businessFormId = service.forms[0].id;
  }

  businessTypeOptions.innerHTML = '';

  service.forms.forEach((form) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `service-type-btn${form.id === serviceState.businessFormId ? ' is-active' : ''}`;
    const fromLabel = form.from ? `${t('fromLabel', 'from')} ` : '';
    button.textContent = `${form.title} - ${fromLabel}${formatEuro(form.price)}`;
    button.addEventListener('click', () => {
      serviceState.businessFormId = form.id;
      renderServiceOrder();
      renderBusinessTypes(service);
    });
    businessTypeOptions.append(button);
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
      });

      qtyWrap.append(qtyLabel, qtyInput);
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
    if (orderBusinessType) orderBusinessType.textContent = selectedForm?.title || '-';
  } else {
    orderBusinessRow?.setAttribute('hidden', '');
    if (orderBusinessType) orderBusinessType.textContent = '-';
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
    serviceState.businessFormId = service.forms?.[0]?.id || null;
    serviceState.periodMonths = null;
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
    const formData = new FormData();
    appendSubmissionMeta(
      formData,
      `Talcon.ee | ${service.title} | ${company}`,
      email
    );

    formData.append('request_type', 'service_order');
    formData.append('name', person);
    formData.append('email', email);
    formData.append('service', service.title);
    formData.append('business_form', selectedForm?.title || '-');
    formData.append('period_months', Number.isFinite(periodMonths) ? String(periodMonths) : '-');
    formData.append('company_name', company);
    formData.append('contact_name', person);
    formData.append('contact_email', email);
    formData.append('contact_phone', phoneInput?.value.trim() || '-');
    formData.append('comment', commentInput?.value.trim() || '-');
    formData.append('order_summary', getOrderSummaryText(service));

    await sendSubmission(formData);
    setOrderHint(t('orderSent', 'Request sent. We will contact you soon.'));
    serviceOrderForm.reset();
    serviceState.periodMonths = null;
    serviceState.selectedExtras = new Set();
    serviceState.extraQuantities = {};
    renderServiceConfigurator();
  } catch (error) {
    console.error(error);
    const activationNeeded = /activation/i.test(String(error?.message || ''));
    const message = activationNeeded
      ? t('mailActivationNeeded', 'For first-time sending, open the FormSubmit activation link from your email inbox.')
      : t('orderError', 'Request sending failed. Please try again.');
    setOrderHint(message, true);
  } finally {
    submitBtn?.removeAttribute('disabled');
    submitBtn?.removeAttribute('aria-busy');
  }
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

function clearFieldError(field) {
  field?.classList.remove('is-error');
}

function markFieldError(field) {
  field?.classList.add('is-error');
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

  if (!hasMessage && !hasFile) {
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
    appendSubmissionMeta(
      payload,
      `Talcon.ee | Quick contact | ${nameValue}`,
      emailValue
    );
    payload.append('request_type', 'quick_contact');
    payload.append('name', nameValue);
    payload.append('email', emailValue);
    payload.append('name_or_company', nameValue);
    payload.append('contact_email', emailValue);
    payload.append('message', messageField?.value.trim() || '-');

    if (fileInput?.files && fileInput.files.length > 0) {
      payload.append('attachment', fileInput.files[0]);
    }

    await sendSubmission(payload);

    setHint(t('formSent', 'Sent! We will contact you soon.'));
    form.reset();
    hasInvalidAttachment = false;
    clearFileError();
    updateFileHint();
  } catch (err) {
    console.error(err);
    const activationNeeded = /activation/i.test(String(err?.message || ''));
    const message = activationNeeded
      ? t('mailActivationNeeded', 'For first-time sending, open the FormSubmit activation link from your email inbox.')
      : t('formError', 'Something went wrong. Please try again.');
    setHint(message, true, false);
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

  updateFileHint();
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
updateFileHint();
renderServiceCards();
