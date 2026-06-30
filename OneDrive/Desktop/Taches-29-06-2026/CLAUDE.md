# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Application todo statique en vanilla JS / HTML / CSS. Aucun outil de build, aucune dépendance npm. Ouvrir `index.html` directement dans le navigateur suffit.

## Architecture

```
index.html      ← structure + classes Tailwind
css/style.css   ← composants custom et surcharges typographiques
js/app.js       ← toute la logique (état, DOM, persistence)
taches.md       ← liste de tâches + pseudo-code de référence
```

**Flux de données :** `tasks[]` (module-level) → `save()` → `localStorage` → `load()` au démarrage. Toute modification passe par `save()` puis `render()`.

## Conventions CSS

**`1rem = 10px`** : `html { font-size: 62.5% }` est posé dans style.css. Toutes les valeurs rem du projet suivent cette échelle (ex: `1.6rem = 16px`).

**Conflit Tailwind CDN / style.css :** Tailwind est chargé via le Play CDN (`<script src="https://cdn.tailwindcss.com">`), qui injecte ses styles dynamiquement via JS *après* le chargement de style.css. Conséquence :

- Les **classes de composants** (`.task-item`, `.filter-btn`, etc.) vivent dans style.css sans conflit car Tailwind ne les génère pas.
- Les **propriétés typographiques** sur des éléments HTML natifs (`h1`, `body`, etc.) doivent être déclarées via des classes Tailwind directement dans le HTML (ex: `text-[5.5rem]`) plutôt que depuis style.css — sinon l'injection dynamique de Tailwind les écrase.
- Ne pas utiliser `!important` pour résoudre ces conflits.

## localStorage

Clé : `taches-29-06-2026`. Les tâches sont persistées en JSON `[{ id, text, done }]`. Si la clé est absente ou corrompue, `DEFAULT_TASKS` est utilisé.
