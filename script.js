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

    if (dictionary.site_title) {
        document.title = dictionary.site_title;
    }

    document.querySelectorAll(".language-btn").forEach((button) => {
        const isActive = button.dataset.lang === lang;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    localStorage.setItem("preferredLanguage", lang);
}

function handleFormSubmission(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log("Form submitted:", Object.fromEntries(formData));
    event.target.reset();
}

function initInteractivity() {
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

document.addEventListener("DOMContentLoaded", initInteractivity);
