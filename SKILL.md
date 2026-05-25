---
name: mobi-design
description: Use this skill to generate well-branded interfaces and assets for Mobi (Mobilcity), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Brand**: Mobi / Mobilcity. Spanish-first, mobile/connectivity sector. Friendly mascot-led personality.
- **Tokens**: import `colors_and_type.css` for all color, type, spacing, radius, shadow, motion variables.
- **Fonts**: Afacad Flux (TTFs in `fonts/`), JetBrains Mono for code.
- **Core colors**: `--brand-primary` #125491, `--brand-electric` #389ecf, `--brand-text` #2674a5, `--brand-bg` #b5c7de, `--brand-orange` #cb6131.
- **Assets**: `assets/logo-mobilcity-icon.png` (M mark), `assets/mascot-mobi-2026.png` (Mobi the robot).
- **Icons**: Lucide via CDN — `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>` then `lucide.createIcons()`.
- **UI kit**: `ui_kits/mobile-app/` — copy components and screens for fast app prototyping.

## House rules

- Address the user as **tú** (informal Spanish).
- One **orange CTA** per screen. Orange is for the most important action only.
- Only one allowed gradient: `linear-gradient(135deg, #125491, #389ecf)`. No purples, no rainbows.
- Cards use **blue-tinted shadows** (`rgba(18,84,145,...)`), never neutral grey.
- Pill buttons (`border-radius: 999px`) and 18px-radius cards.
- Sentence case for headings and buttons. ALL-CAPS only for tiny eyebrows (`NUEVO`).
- Mascot is for empty/celebratory/marketing moments — never in product chrome.
