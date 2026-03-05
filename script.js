const DEFAULT_LANGUAGE = "ru";

function applyLanguage(lang) {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANGUAGE];

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    const key = node.dataset.i18nAlt;
    if (dictionary[key]) {
      node.setAttribute("alt", dictionary[key]);
    }
  });

  document.title = dictionary.site_title || document.title;

  document.querySelectorAll(".language-btn").forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  localStorage.setItem("preferredLanguage", lang);
}

function handleFormSubmission(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  console.log("Form submitted", Object.fromEntries(formData));

  const lang = document.documentElement.lang || DEFAULT_LANGUAGE;
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANGUAGE];
  const status = document.getElementById("form-status");
  if (status) {
    status.textContent = dictionary.form_success;
  }

  event.target.reset();
}

function init() {
  const savedLanguage = localStorage.getItem("preferredLanguage");
  const language = savedLanguage && TRANSLATIONS[savedLanguage] ? savedLanguage : DEFAULT_LANGUAGE;

  document.querySelectorAll(".language-btn").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", handleFormSubmission);
  }

  applyLanguage(language);
}

document.addEventListener("DOMContentLoaded", init);
