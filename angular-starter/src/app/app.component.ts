// Point de depart Angular.
//
// Ce composant sert de base pour construire une UI autour du serveur MCP GitHub.
// Ajoutez vos dependances dans package.json et implementez ici.

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <div style="font-family: sans-serif; padding: 2rem;">
      <h1>Starter pret</h1>
      <p>Implementez votre interface utilisateur ici.</p>
    </div>
  `,
})
export class AppComponent {}
