// `bun run render <cache> <profil>` : facts.json + narrative/<profil>.md → deck-<profil>.html. Morceau M4 de onboard/PLAN.md.
// Attendu : un seul fichier HTML, SVG inline, une <section> par page, @media print. Validation : `bun run validate deck`.
const [dir, profile] = process.argv.slice(2);
if (!dir || !profile) {
  console.error("Usage : bun run render <dossier du cache> <profil>");
  process.exit(2);
}
console.error(`render : à implémenter (onboard/PLAN.md, M4). Entrées : ${dir}/facts.json, ${dir}/narrative/${profile}.md`);
process.exit(1);
