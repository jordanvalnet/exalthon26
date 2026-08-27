# Starter Angular — note

Ce dossier est un squelette minimal (composant seul), pas un projet Angular
CLI complet (pas de `angular.json`, pas de fichiers de build).

Pour un projet Angular complet et prêt à lancer, le plus rapide pendant
l'atelier est de générer la structure officielle puis d'y copier
`src/app/app.component.ts` :

```bash
npx @angular/cli new atelier-agent --standalone --style=css --routing=false
```

Ensuite, remplacez le contenu de `src/app/app.component.ts` généré par celui
fourni ici, et demandez à Claude Code de construire la logique métier autour.
