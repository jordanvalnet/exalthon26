// Identité du serveur, partagée par les entrées stdio/http, les ressources et les tests.
export const SERVER_INFO = { name: "hackathon", version: "0.1.0" } as const;

// Texte envoyé au client à l'initialisation : c'est le "mode d'emploi" que le modèle
// lit avant d'utiliser les outils. Court, orienté usage.
export const SERVER_INSTRUCTIONS = `Serveur MCP de l'équipe hackathon.
Commence par l'outil echo si tu veux vérifier que le serveur répond.
read_file lit un fichier sous la racine autorisée ; github_repo interroge l'API GitHub.`;
