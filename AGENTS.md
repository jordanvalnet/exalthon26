# Contexte projet — Atelier Agent MCP

Ce projet est un point de départ pour l'atelier de l'eXaltemps.

## Objectif

A remplir le jour de l'atelier

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
