# Kit de démarrage

## 1. Choisir votre assistant de code

Un seul suffit — choisissez celui que vous avez déjà ou préférez :

| Outil | Installation / accès |
|---|---|
| **Claude Code** | `npm install -g @anthropic-ai/claude-code` — [docs](https://docs.claude.com/en/docs/claude-code) |
| **GitHub Copilot** | Extension VS Code (ou GitHub Codespaces) — nécessite un abonnement Copilot actif |
| **GitHub Copilot agent mode / Codex CLI** | `npm install -g @github/copilot-cli` ou accès via [GitHub Copilot agent mode](https://docs.github.com/en/copilot) |

Commun à tous :

- Un compte GitHub avec accès aux dépôts que vous voulez utiliser pendant l'atelier.
- Runtimes/SDKs à installer selon le starter choisi : Node.js (JavaScript/TypeScript), Python, Java (Maven), Kotlin (Gradle), .NET / C#, et outils pour C++ (CMake), ainsi que les dépendances front (React/Vite, Angular).

## 2. Créer un token GitHub (PAT)

1. Sur GitHub : **Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. Créez un token.
3. Scopes recommandés : `repo`
4. Copiez le token, vous ne pourrez plus le revoir ensuite.

## 3. Cloner le repo fourni et configurer le token

Ici, on va cloner le repo transmis et créer le fichier .env pour y mettre le token

```bash
git clone <url-du-repo> hackathon-mcp
cd hackathon-mcp
cp .env.example .env
# éditez .env et collez votre token dans GITHUB_PAT

export GITHUB_PAT=$(grep GITHUB_PAT .env | cut -d '=' -f2)
```

> Le fichier `.mcp.json` est déjà versionné avec la config du serveur MCP GitHub.
> Il lit le token depuis la variable d'environnement `GITHUB_PAT` — le token lui-même n'est jamais commité.

## 4. Vérifier la connexion MCP

#### Option A — Claude Code

```bash
claude
```

Dans la session, tapez `/mcp` et vérifiez que `github` apparaît avec un statut connecté,
et que les outils `github:*` (ex. `github:search_issues`, `github:get_pull_request`) sont disponibles.

#### Option B — GitHub Copilot (VS Code)

1. Ouvrez VS Code dans le dossier du kit.
2. Vérifiez que l'extension **GitHub Copilot** est installée et connectée (`Ctrl+Shift+P` → *Copilot: Sign In*).
3. Ouvrez **Copilot Chat** (`Ctrl+Shift+I`), activez **agent mode** (bouton *⚙ Agent*) et vérifiez que `github` apparaît dans la liste des MCP servers.

#### Option C — Codex CLI

```bash
gh auth login
codex
```

Le fichier `.mcp.json` est automatiquement détecté. Vérifiez la disponibilité des outils `github:*`.

## 5. Alternative réseau : serveur local (Docker)

Si le réseau bloque l'endpoint distant :

```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT -- \
  docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

## Contenu du kit

```
hackathon-mcp/
├── README.md                 # ce fichier — configuration pré-atelier
├── .mcp.json                 # config du serveur MCP GitHub (scope projet)
├── .env.example              # modèle pour le token GitHub
├── .gitignore
├── python-starter/           # base minimale Python
├── node-starter/             # base minimale Node.js (ES modules)
├── react-starter/            # base minimale React + Vite
├── angular-starter/          # base minimale Angular
├── java-starter/             # base minimale Java (Maven)
├── kotlin-starter/           # base minimale Kotlin (Gradle)
├── csharp-starter/           # base minimale C# (.NET)
└── cpp-starter/              # base minimale C++
```

## Dépannage rapide

| Symptôme | Outil | Piste |
|---|---|---|
| Serveur `github` en statut "connecting" bloqué | Claude Code | Vérifiez que `GITHUB_PAT` est bien exporté dans le shell avant `claude` |
| Outils GitHub absents de la conversation | Claude Code | Relancez `/mcp` puis redémarrez la session |
| Erreur d'authentification | Tous | Le token a peut-être expiré ou n'a pas les bons scopes — régénérez-le |
| Réseau bloque l'endpoint distant | Tous | Basculez sur l'option Docker locale (étape 5) |
| Agent mode absent dans Copilot Chat | Copilot | Mettez à jour l'extension VS Code et vérifiez votre abonnement |
| Outils `github:*` non listés dans Copilot agent | Copilot | Vérifiez que `.mcp.json` est présent à la racine du workspace VS Code |
| `codex: command not found` | Codex CLI | `npm install -g @github/copilot-cli` puis `gh auth login` |

## **À venir.**

> Un fichier `HACKATHON.md` contenant toutes les instructions du hackathon vous sera fourni le jour J.



## Chat d'équipe (IA ↔ IA)

Les assistants de l'équipe se parlent via l'issue GitHub #1 du repo. Rejoindre en 2 minutes : `chat/README.md`.
```bash
node chat/chat.mjs read            # ou bun chat/chat.mjs read
node chat/chat.mjs send "salut"
```
