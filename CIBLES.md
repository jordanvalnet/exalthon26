# Repos cibles

Terrains d'opération pour l'agent + MCP GitHub. Critères : thème IA, projet récent et tendance,
taille raisonnable, et surtout **du trafic** (issues/PR/Actions) pour que la démo soit vivante.
Chiffres relevés le 2026-09-09.

## Cible de test (imposée)

| Repo | ⭐ | Issues ouvertes | Pourquoi |
|---|---|---|---|
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | 204k | 1170 | Automation + IA, énorme flux d'issues/PR : cas réel de tri, labels, doublons |
| [n8n-io/skills](https://github.com/n8n-io/skills) | 484 | 14 | Petit repo n8n, récent (avr. 2026) : bac à sable si n8n est trop gros |
| [n8n-io/n8n-docs](https://github.com/n8n-io/n8n-docs) | 1.8k | 46 | Docs : PR faciles à générer et à relire en live |

## Cibles IA récentes et tendances

| Repo | ⭐ | Issues | Pourquoi c'est une bonne cible |
|---|---|---|---|
| [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) | 17k | 122 | Scanner de sécurité pour skills d'agents. Sujet chaud, org crédible, périmètre net |
| [browser-use/browser-harness](https://github.com/browser-use/browser-harness) | 17k | 332 | Harness navigateur, très actif : beaucoup de bugs reproductibles à trier |
| [mksglu/context-mode](https://github.com/mksglu/context-mode) | 22k | 224 | Optimisation de fenêtre de contexte (MCP + hooks). TypeScript, lisible |
| [t8y2/dbx](https://github.com/t8y2/dbx) | 19k | 1314 | Backlog énorme et bilingue : idéal pour démontrer un agent de triage/dédoublonnage |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | 48k | 774 | Framework d'agent perso ultra-léger, Python, communauté très active |
| [astrid-runtime/astrid](https://github.com/astrid-runtime/astrid) | 10k | 216 | OS capability-secure pour agents, Rust. Base de code propre, issues techniques |
| [tinyhumansai/openhuman](https://github.com/tinyhumansai/openhuman) | 40k | 320 | IA perso local-first (Rust/Tauri), forte visibilité |
| [EvoMap/evolver](https://github.com/EvoMap/evolver) | 9k | 23 | Petit et calme : bon si on veut un repo qu'on peut lire en entier |

## Comment choisir

- **Démo de triage / rapport** → dbx, n8n, browser-harness (gros volume).
- **Démo de contribution (PR, tests, docs)** → n8n-docs, n8n-io/skills, astrid.
- **Démo « analyse de sécurité / qualité »** → SkillSpector, context-mode.
- **Démo onboarding (Onboard)** → context-mode, astrid, evolver : lisibles, taille moyenne, README, releases, CI, plusieurs contributeurs. Pas n8n : trop gros pour un run live.
