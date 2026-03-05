// Mobile menu (если есть)
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
burgerBtn?.addEventListener('click', () => {
  const isHidden = mobileMenu?.hasAttribute('hidden');
  if (!mobileMenu) return;
  if (isHidden) mobileMenu.removeAttribute('hidden');
  else mobileMenu.setAttribute('hidden', '');
});

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// i18n
const LANG_KEY = 'talcon_lang';
let currentLang = localStorage.getItem(LANG_KEY) || (navigator.language || 'en').slice(0, 2);
if (!['et', 'ru', 'en'].includes(currentLang)) currentLang = 'en';

function applyTranslations(lang) {
  const dict = window.I18N?.[lang] || window.I18N?.en || {};
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = dict[key];
    if (typeof val === 'string') el.textContent = val;
  });

  // Highlight active lang button
  document.querySelectorAll('.lang__btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.lang === lang);
  });

  localStorage.setItem(LANG_KEY, lang);
}

document.querySelectorAll('.lang__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    applyTranslations(currentLang);
  });
});

applyTranslations(currentLang);

// Contact form (demo)
const form = document.getElementById('contactForm');
const hint = document.getElementById('formHint');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (hint) hint.textContent = window.I18N?.[currentLang]?.formSending || 'Sending…';

  // Demo: imitate success
  await new Promise((r) => setTimeout(r, 500));

  if (hint) hint.textContent = window.I18N?.[currentLang]?.formSent || 'Sent! We will contact you soon.';
  form.reset();
});