// =======================
// Talcon site script
// =======================

// Mobile menu (если есть в HTML)
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

burgerBtn?.addEventListener('click', () => {
  if (!mobileMenu) return;
  const isHidden = mobileMenu.hasAttribute('hidden');
  if (isHidden) mobileMenu.removeAttribute('hidden');
  else mobileMenu.setAttribute('hidden', '');
});

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// =======================
// i18n
// =======================
const LANG_KEY = 'talcon_lang';
const SUPPORTED = ['et', 'ru', 'en'];

function guessLang() {
  // Prefer saved
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;

  // Prefer browser language(s)
  const langs = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language || 'en'];

  for (const l of langs) {
    const short = String(l).toLowerCase().slice(0, 2);
    if (SUPPORTED.includes(short)) return short;
  }

  // Estonia-friendly default
  return 'et';
}

let currentLang = guessLang();

function applyTranslations(lang) {
  const I18N = window.I18N || {};
  const dict = I18N[lang] || I18N.en || {};

  document.documentElement.lang = lang;

  // text nodes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = dict[key];
    if (typeof val === 'string') el.textContent = val;
  });

  // attributes: placeholder / aria-label / title
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

  // active lang button
  document.querySelectorAll('.lang__btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.lang === lang);
  });

  localStorage.setItem(LANG_KEY, lang);
}

document.querySelectorAll('.lang__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    if (!lang || !SUPPORTED.includes(lang)) return;
    currentLang = lang;
    applyTranslations(currentLang);
  });
});

applyTranslations(currentLang);

// =======================
// Contact form (demo UX)
// =======================
const form = document.getElementById('contactForm');
const hint = document.getElementById('formHint');

function t(key, fallback) {
  return window.I18N?.[currentLang]?.[key]
    || window.I18N?.en?.[key]
    || fallback;
}

let hintTimer = null;

function setHint(message) {
  if (!hint) return;
  hint.textContent = message;
  // auto-clear after a bit (premium feel)
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    if (hint) hint.textContent = '';
  }, 5000);
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn?.setAttribute('disabled', 'disabled');
  submitBtn?.setAttribute('aria-busy', 'true');

  setHint(t('formSending', 'Sending…'));

  try {
    // Demo: imitate success
    await new Promise((r) => setTimeout(r, 650));

    setHint(t('formSent', 'Sent! We will contact you soon.'));
    form.reset();
  } catch (err) {
    console.error(err);
    setHint(t('formError', 'Something went wrong. Please try again.'));
  } finally {
    submitBtn?.removeAttribute('disabled');
    submitBtn?.removeAttribute('aria-busy');
  }
});