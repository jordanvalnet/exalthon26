<h1 align="center">Onboard</h1>

<p align="center"><strong>Un repo GitHub. Six publics. Six decks, rien d'inventé.</strong></p>

<p align="center">
  <code>bun onboard owner/repo profil</code>
</p>

Onboard parcourt n'importe quel dépôt GitHub par le serveur MCP GitHub, construit un cache documentaire vérifié et en
tire une présentation taillée pour la personne qui la lit : **dev, qa, cto, ceo, investisseur, enfant**. Chaque chiffre
est vérifié contre les faits collectés, rien n'est inventé, chaque deck est daté, et un guide répond ensuite aux questions à partir du cache.

<a href="docs/PRESENTATION.md"><img src="docs/img/presentation-banner.png" alt="Ouvrir la présentation illustrée : démos, pages des decks, comment ça marche" width="100%"></a>

## Six decks pour un même dépôt

Générés sur [mksglu/context-mode](https://github.com/mksglu/context-mode). Cliquez sur une couverture pour ouvrir le PDF.

<table>
  <tr>
    <td align="center"><a href="onboard/cache/mksglu__context-mode/deck-dev.pdf"><img src="docs/img/context-mode-dev-cover.png" width="280" alt="deck dev"></a><br>👩‍💻 dev</td>
    <td align="center"><a href="onboard/cache/mksglu__context-mode/deck-qa.pdf"><img src="docs/img/context-mode-qa-cover.png" width="280" alt="deck qa"></a><br>🧪 qa</td>
    <td align="center"><a href="onboard/cache/mksglu__context-mode/deck-cto.pdf"><img src="docs/img/context-mode-cto-cover.png" width="280" alt="deck cto"></a><br>🏗️ cto</td>
  </tr>
  <tr>
    <td align="center"><a href="onboard/cache/mksglu__context-mode/deck-ceo.pdf"><img src="docs/img/context-mode-ceo-cover.png" width="280" alt="deck ceo"></a><br>💼 ceo</td>
    <td align="center"><a href="onboard/cache/mksglu__context-mode/deck-investisseur.pdf"><img src="docs/img/context-mode-investisseur-cover.png" width="280" alt="deck investisseur"></a><br>📈 investisseur</td>
    <td align="center"><a href="onboard/cache/mksglu__context-mode/deck-enfant.pdf"><img src="docs/img/context-mode-enfant-cover.png" width="280" alt="deck enfant"></a><br>🧒 enfant</td>
  </tr>
</table>

## Onboard vu par Onboard

Le pipeline a tourné sur ce dépôt même, en ligne, par le serveur MCP GitHub, sans intervention :
`bun onboard jordanvalnet/exalthon26 <profil>` pour chacun des six profils. Choisissez le vôtre.

<table>
  <tr>
    <td align="center"><a href="onboard/cache/jordanvalnet__exalthon26/deck-dev.pdf"><img src="docs/img/exalthon26-dev-cover.png" width="280" alt="Onboard vu par un dev"></a><br>👩‍💻 <strong>dev</strong> · guide d'onboarding</td>
    <td align="center"><a href="onboard/cache/jordanvalnet__exalthon26/deck-qa.pdf"><img src="docs/img/exalthon26-qa-cover.png" width="280" alt="Onboard vu par un qa"></a><br>🧪 <strong>qa</strong> · rapport de qualification</td>
    <td align="center"><a href="onboard/cache/jordanvalnet__exalthon26/deck-cto.pdf"><img src="docs/img/exalthon26-cto-cover.png" width="280" alt="Onboard vu par un cto"></a><br>🏗️ <strong>cto</strong> · note de décision</td>
  </tr>
  <tr>
    <td align="center"><a href="onboard/cache/jordanvalnet__exalthon26/deck-ceo.pdf"><img src="docs/img/exalthon26-ceo-cover.png" width="280" alt="Onboard vu par un ceo"></a><br>💼 <strong>ceo</strong> · synthèse pour la direction</td>
    <td align="center"><a href="onboard/cache/jordanvalnet__exalthon26/deck-investisseur.pdf"><img src="docs/img/exalthon26-investisseur-cover.png" width="280" alt="Onboard vu par un investisseur"></a><br>📈 <strong>investisseur</strong> · mémo d'investissement</td>
    <td align="center"><a href="onboard/cache/jordanvalnet__exalthon26/deck-enfant.pdf"><img src="docs/img/exalthon26-enfant-cover.png" width="280" alt="Onboard vu par un enfant"></a><br>🧒 <strong>enfant</strong> · album illustré</td>
  </tr>
</table>

Le cache complet (faits, sources, narratifs, FAQ, glossaire) : [onboard/cache/jordanvalnet__exalthon26/](onboard/cache/jordanvalnet__exalthon26/).

## Démarrer

```bash
curl -fsSL https://bun.sh/install | bash        # Windows : powershell -c "irm bun.sh/install.ps1 | iex"
cp .env.example .env                            # GITHUB_PAT=<token GitHub, scope repo>
bun install && bun run check
bun onboard owner/repo dev                      # collecte, rédaction, rendu : quelques minutes
bun run pdf onboard/cache/<owner>__<repo> dev   # le PDF, via Chrome ou Edge en headless
```

`bun onboard` lance Claude Code en non interactif avec le skill `/onboard`. Dans une session Claude Code, les mêmes
étapes sont des skills : `/onboard owner/repo profil`, `/onboard-ask owner/repo profil "question"`, et une par étape
(`/onboard-collect`, `/onboard-write`, `/onboard-render`). Les prompts vivent dans [onboard/agents/](onboard/agents/) :
Copilot et Codex exécutent le même texte.

Le serveur MCP GitHub est déclaré dans `.mcp.json` et lit `GITHUB_PAT` dans l'environnement du shell :
`set -a; source .env; set +a` avant de lancer l'assistant, puis `/mcp` pour vérifier que `github` est connecté.

## Comment ça marche

```
owner/repo + profil
   │
   ▼
[1] collecter   5 sous-agents en parallèle, outils github:* ──► facts.json + sources/ ──► validate facts
[2] rédiger     lit le cache, jamais GitHub ──► narrative/<profil>.md, glossaire, FAQ ──► validate narrative
[3] rendre      code, une identité visuelle par profil ──► deck-<profil>.html + .pdf ──► validate deck
[4] guider      /onboard-ask : réponse citée, FAQ enrichie, GitHub relu si le cache ne suffit pas
```

Chaque étape ne lit que les sorties de la précédente et ne démarre que si la validation en code passe. Une donnée
absente reste absente et se dit. Le flux détaillé, avec schéma : [onboard/README.md](onboard/README.md) ;
le contrat des fichiers : [onboard/SCHEMA.md](onboard/SCHEMA.md) ; la chaîne d'agents : [onboard/WORKFLOW.md](onboard/WORKFLOW.md).

## Commandes

| Commande | Effet |
|---|---|
| `bun onboard owner/repo profil [--force]` | onboarding complet, deck dans `onboard/cache/<owner>__<repo>/` |
| `bun run pdf <cache> <profil>` | `deck-<profil>.pdf` à partir du HTML |
| `bun run render <cache> <profil>` | rejoue le rendu seul, à partir du cache |
| `bun run validate facts\|narrative\|deck <cache> <profil>` | validation dure d'une étape |
| `bun run merge <cache> <profil>` | assemble `parts/*.json` dans `facts.json` |
| `bun run screenshot <cache> <profil> [sortie.png]` | capture du deck |
| `bun run gh <outil> '<args JSON>'` | appel brut d'un outil du serveur MCP GitHub |
| `bun run check` | typecheck + tests, à lancer avant de pousser |
| `bun run chat read` | le chat d'équipe, une issue GitHub où les assistants se parlent ([chat/README.md](chat/README.md)) |

## Structure

```
onboard/agents/     le prompt de chaque étape : 0-onboard, 1-collect (+ 1a…1e), 2-write, 3-render, 4-ask
onboard/profiles/   un JSON par public : questions priorisées, ton, finale, design (sur-titre, tuiles, brief)
onboard/cache/      les caches produits, versionnés : facts.json, sources/, narrative/, faq.md, glossary.md, decks
src/render/         theme.ts une identité par profil · kpi.ts tuiles · charts.ts SVG · deck.ts assemblage · pdf.ts
src/validate.ts     validations dures ; src/merge.ts fusion des collectes ; src/facts.ts schéma zod du cache
src/github.ts       accès GitHub via le serveur MCP (token GITHUB_PAT), jamais REST
docs/               la présentation illustrée et ses images
pitch_fr.html       le pitch du hackathon, ← → pour naviguer
chat/               client du chat d'équipe, fichier unique (node ou bun)
AGENTS.md           contexte et consignes pour les agents
```

---

<p align="center">
  Équipe eXaltemps, hackathon « Agent + MCP GitHub » du 9 septembre 2026 · consignes du jury : <a href="HACKATHON.md">HACKATHON.md</a> · dépôts cibles : <a href="CIBLES.md">CIBLES.md</a>
</p>
