# Talcon Accounting Website

Многоязычный лендинг бухгалтерских услуг (эстонский, русский, английский).

## Публикация
Сайт автоматически публикуется через **GitHub Pages** workflow `.github/workflows/publish.yml` при пуше в `main` или `master`.

- Продакшен-домен: `https://talcon.ee`
- CNAME хранится в файле `CNAME`.

## Локальный запуск
```bash
python3 -m http.server 4173
```
Откройте `http://127.0.0.1:4173`.

## Структура
- `index.html` — разметка лендинга.
- `style.css` — стили.
- `translations.js` — словари ET/RU/EN.
- `script.js` — переключение языка и интерактивность.
