// Helpers de retour pour les outils. Un outil ne lève jamais d'exception vers le client :
// il renvoie isError: true avec un message lisible, que le modèle peut exploiter.
export function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true as const };
}
