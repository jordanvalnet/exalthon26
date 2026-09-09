# Contexte projet — Atelier Agent MCP

Ce projet est un point de départ pour l'atelier de l'eXaltemps.

## Objectif

Communication instantanée entre les 6 devs de l'équipe via leurs IA : chaque assistant (Claude Code, Copilot, Codex)
lit et écrit sur un canal commun hébergé par GitHub (une issue = le canal, un commentaire = un message).
Client : `chat/chat.mjs`, zéro dépendance, tout OS.

## Chat d'équipe (IA ↔ IA) : lis ceci en premier
Les 6 assistants de l'équipe se parlent via l'issue <https://github.com/jordanvalnet/exalthon26/issues/1> :
un commentaire = un message, l'auteur est le compte GitHub du token. Client : `chat/chat.mjs` (node ou bun, zéro dépendance).
- Lire : `node chat/chat.mjs read`. Envoyer : `node chat/chat.mjs send "🤖 …"`. Qui est là : `node chat/chat.mjs who`.
- Un message écrit par une IA commence par `🤖`. `@login` pour interpeller quelqu'un. Court, factuel, en français.
- « Écoute le chat » : lance `node chat/chat.mjs wait` **en tâche de fond** ; il se termine au premier message d'un
  autre et tu es réveillé. Traite le message (réponds via `send` si on t'interpelle), puis relance `wait`.
- Sans terminal : outils `github:*` (`issue_read` method `get_comments`, `add_issue_comment`) sur cette issue.
- Ne jamais fermer l'issue. Doc : `chat/README.md`.


## Repos cibles

Liste des repos cibles (dont le repo de test <https://github.com/n8n-io>) : `CIBLES.md`.

## Structure

```
.mcp.json              # config du serveur MCP GitHub (scope projet)
│
├── python-starter/      # Starter pack Python
│   ├── requirements.txt #   dépendances pip — ajoutez les vôtres au fur et à mesure
│   └── main.py          #   point d'entrée — complétez ici la logique métier
│
├── node-starter/        # Starter pack Node.js (ES modules)
│   ├── package.json     #   dépendances et scripts npm (npm start)
│   └── src/
│       └── index.js     #   point d'entrée — complétez ici la logique métier
│
├── react-starter/       # Starter pack React + Vite
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/             #   point d'entrée React
│
├── angular-starter/     # Starter pack Angular
│   ├── package.json
│   └── src/             #   point d'entrée Angular
│
├── java-starter/        # Starter pack Java (Maven)
│   ├── pom.xml
│   └── src/             #   point d'entrée Java
│
├── kotlin-starter/      # Starter pack Kotlin (Gradle)
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   └── src/             #   point d'entrée Kotlin
│
├── csharp-starter/      # Starter pack C# (.NET)
│   ├── atelier-agent-mcp-github.csproj
│   └── Program.cs       #   point d'entrée C#
│
└── cpp-starter/         # Starter pack C++
    ├── CMakeLists.txt
    └── main.cpp         #   point d'entrée C++
```


### Pour démarrer rapidement

- **Python** : `cd python-starter && pip install -r requirements.txt && python main.py`
- **Node** : `cd node-starter && npm install && npm start`
- **React** : `cd react-starter && npm install && npm run dev`
- **Angular** : `cd angular-starter && npm install && npm start`
- **Java** : `cd java-starter && mvn compile exec:java`
- **Kotlin** : `cd kotlin-starter && ./gradlew run`
- **C#** : `cd csharp-starter && dotnet run`
- **C++** : `cd cpp-starter && cmake -B build && cmake --build build && ./build/main`
