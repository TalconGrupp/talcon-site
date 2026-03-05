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

## Hero image
To use your custom hero image from the design brief:
- place file as `assets/hero.webp` (preferred) or `assets/hero.jpg`
- keep a 3:2 ratio for best result (for example 1800x1200)
- the site automatically falls back to `assets/hero-abstract.svg` if no raster hero is provided


## Client hero image from repository root
If your uploaded file is named exactly `hero-client.jpg.png` in the repository root, the header now uses it automatically as the first-priority hero image.
Fallback order:
1. `hero-client.jpg.png`
2. `assets/hero.webp`
3. `assets/hero.jpg`
4. `assets/hero-abstract.svg`
