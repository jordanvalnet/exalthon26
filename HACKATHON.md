# Guide du jour J — Mission Avengers : Agent + MCP GitHub

> Prérequis : configuration terminée (`README.md`) et assistant de code opérationnel.

---

## 🛡️ C'est une mission d'Avengers !

Ce hackathon n'est pas qu'un entraînement au QG : **la meilleure idée sera sélectionnée** en fin de mission. Chaque équipe aura 2-3 minutes pour présenter sa démo devant les autres Avengers — visez un agent qui fonctionne vraiment, pas juste un prototype de slides. Que l'équipe la plus héroïque l'emporte !

---

# Repo cible de la mission

Pour cette mission, vous êtes libres de choisir le repo de votre choix mais si vous n'avez pas d'idée, vous pouvez utiliser celui-là :

**[https://github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)**

Le repo que vous choisirez servira de terrain d'opération pour votre agent et les outils MCP GitHub (issues, PRs, commits, Actions, etc.). Pas besoin de le cloner car votre agent y accède directement via les outils `github:*` — considérez-les comme votre équipement S.H.I.E.L.D.

---

## Étape 1 — Choisir votre mission

Maintenant, c'est à vous de jouer : vous allez devoir trouver une idée de mission et la mettre en œuvre en utilisant un agent et le MCP GitHub.

### 🏆 Critères de sélection

En fin de mission, l'équipe la plus héroïque sera choisie selon :

- **Impact** — la menace neutralisée est-elle réelle et la solution utile ?
- **Originalité** — la stratégie sort-elle du lot ?
- **Exécution** — l'agent fonctionne-t-il vraiment, en live, sur le repo cible ?
- **Clarté de la démo** — l'équipe explique-t-elle son résultat efficacement, chrono en main ?

---

## Étape 2 — Configurer le dossier de mission

Ouvrez `AGENTS.md` et complétez la section **Objectif** en 1-2 phrases.

---

## Étape 3 — Entraîner votre agent

Décrivez le comportement voulu à votre assistant en langage naturel — les outils GitHub
(issues, PRs, recherche de code, Actions, etc.) sont déjà disponibles via MCP, pas besoin de coder un client API.

Si vous avez besoin d'équipement supplémentaire (wrapper, script, UI), choisissez le starter adapté :

| Stack | Dossier | Commande de démarrage |
|---|---|---|
| Python | `python-starter/` | `pip install -r requirements.txt && python main.py` |
| Node.js | `node-starter/` | `npm install && npm start` |
| React | `react-starter/` | `npm install && npm run dev` |
| Angular | `angular-starter/` | `npm install && npm start` |
| Java | `java-starter/` | `mvn compile exec:java` |
| Kotlin | `kotlin-starter/` | `./gradlew run` |
| C# | `csharp-starter/` | `dotnet run` |
| C++ | `cpp-starter/` | `cmake -B build && cmake --build build && ./build/main` |

---

## Étape 4 — Rapport de mission

Chaque équipe crée une nouvelle branche avec le nom de son équipe avec un fichier `LIVRABLE.md` contenant :
- La mission choisie et le cas d'usage concret.
- Une capture d'écran du résultat.
- Ce qui a bien fonctionné / ce qui a surpris.
- Un prototype démontrable : fournissez soit une **UI** (interface utilisateur web/minimale)
	soit une **CLI** (interface en ligne de commande) permettant de faire la démo du résultat.

Lors de la restitution, vous aurez 1 min pour convaincre le public que votre équipe mérite le bouclier.

Avengers, c'est parti ! 🚀