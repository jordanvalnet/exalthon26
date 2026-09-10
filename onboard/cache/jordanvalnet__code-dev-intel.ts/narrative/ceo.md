---
repo: jordanvalnet/code-dev-intel.ts
profile: ceo
generated_at: 2026-09-10T13:54:11Z
---
# code-dev-intel : un sommaire du code qui fait consommer jusqu'à 34 % de moins aux IA de développement, porté aujourd'hui par une seule personne

## Que fait ce projet, en une phrase, et pour qui ?
Le projet installe chez vous un service qui répond aux questions des assistants IA sur votre code : où se trouve telle fonction, qui l'utilise, qu'est-ce qui casse si on la change [facts:repo.description].
Sans lui, l'assistant relit le dossier complet à chaque question, comme un nouvel arrivant qui feuillette tous les classeurs pour retrouver une clause ; avec lui, il consulte un sommaire et va droit à la page [src:readme.md].
Pour qui : les équipes qui font travailler des assistants IA sur une base de code d'entreprise de taille moyenne ou grande [src:readme.md].
Argument différenciant : tout reste sur vos machines, rien n'est envoyé à un service d'indexation extérieur [src:readme.md].
> Un sommaire du code, installé chez vous, pour que les assistants IA arrêtent de tout relire à chaque question [facts:repo.description] [src:readme.md].

## Est-ce que ça marche et qui s'en sert ?
La démonstration est solide : sur une base de code de production, 11 agents sur 11 ont choisi l'outil d'eux-mêmes, sans consigne, et ont consommé 13 à 34 % de ressources en moins sur les tâches difficiles — 27 % en moyenne [src:readme.md] [gh:https://github.com/jordanvalnet/code-dev-intel.ts/blob/main/docs/benchmarks/2026-06-07-agent-token-economy.md].
Le marché, lui, n'a pas encore répondu : 0 étoile, 0 copie, 1 seule demande ouverte et aucune discussion autour [facts:repo.stars] [facts:repo.forks] [facts:issues.open] [facts:issues.hot.0.comments].
Une seule version a été mise à la disposition du public, la 0.1.6 du 26 mars 2026, alors que le journal interne du projet en est déjà à la 0.5.0 du 4 septembre [facts:releases.0.tag] [facts:releases.0.date] [src:changelog.md].
Autrement dit : le produit a cinq mois d'avance sur ce que le public peut installer [gh:https://github.com/jordanvalnet/code-dev-intel.ts/releases].
> Ça marche en démonstration — 11 agents sur 11, jusqu'à 34 % de consommation en moins — mais aucun utilisateur extérieur à ce jour [src:readme.md] [facts:repo.stars].

## Le projet est-il vivant ?
<!-- chart: commits_per_week -->
Oui, mais par à-coups : sur les douze dernières semaines, onze des modifications relevées tiennent dans la seule semaine du 1er septembre, les onze semaines précédentes sont vides [facts:activity.commits_per_week].
La dernière modification date du 6 septembre 2026, il y a quatre jours [facts:activity.last_commit].
Ce qui est sorti cette semaine-là n'est pas cosmétique : la vérification automatique du produit tourne désormais sur les trois systèmes du marché, un travail de mise en qualité qui précède une diffusion [facts:pulls.merged_30d.0.title] [src:changelog.md].
Rien n'attend en file : aucune proposition de changement en suspens [facts:pulls.open].
Image : un atelier qui n'ouvre pas toutes les semaines, mais qui sort un vrai lot quand il ouvre.
> Onze modifications concentrées sur une seule semaine, onze semaines vides avant : un projet qui avance par sessions, pas en continu [facts:activity.commits_per_week] [facts:activity.last_commit].

## Qui est derrière ?
<!-- chart: contributors -->
Une personne, et une seule : le compte jordanvalnet, auteur des 12 modifications relevées sur douze semaines [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits].
Le projet vit sur un compte personnel, pas sur celui d'une entreprise ni d'une fondation [facts:repo.owner_type].
Aucun financement déclaré, aucun responsable désigné, aucune politique de sécurité publiée [facts:business.funding] [facts:business.codeowners] [facts:business.security_policy].
Les contributions extérieures sont documentées et bienvenues, mais personne n'est encore venu [src:contributing.md] [facts:activity.contributors].
Traduit en risque d'entreprise : si cette personne s'arrête, il n'y a pas de relais [facts:activity.bus_factor].
> Une seule paire de mains : un contributeur, un compte personnel, aucun financement déclaré [facts:activity.bus_factor] [facts:repo.owner_type] [facts:business.funding].

## Quels sont les trois risques ?
<!-- chart: risks -->
1. **Dépendance à une personne — élevé.** Un seul contributeur porte tout le travail relevé sur douze semaines : indisponibilité, et le projet s'arrête [facts:risks.2.level] [facts:risks.2.note].
2. **Licence contraignante — élevé.** Sous AGPL-3.0, intégrer l'outil à un produit que vous vendez ou que vous exposez sur Internet oblige à publier votre propre code ; en usage interne, aucune conséquence [facts:risks.0.level] [facts:risks.0.note] [src:license.md].
3. **Sécurité — moyen.** Aucun canal déclaré pour signaler une faille : un chercheur qui en trouverait une ne saurait pas à qui écrire [facts:risks.1.level] [facts:risks.1.note].

Rassurant en face : la chaîne de fabrication automatique et les composants extérieurs utilisés sont l'une et les autres au vert [facts:risks.3.level] [facts:risks.4.level].
> Le risque numéro un n'est pas technique mais humain, et la licence interdit d'en faire un produit vendu sans ouvrir son propre code [facts:risks.2.note] [facts:risks.0.note].

## Qu'en fait-on ?
La feuille de route publique tient en une ligne : une seule demande ouverte, « Anti-Amnesia & Workflow Hardening », sans commentaire ni thème dégagé [facts:roadmap.requests.0.title] [facts:roadmap.themes] [gh:https://github.com/jordanvalnet/code-dev-intel.ts/issues/1].
Donnée non relevée : les jalons de planification, illisibles avec les moyens d'accès utilisés ici, à vérifier sur la page des jalons du projet [gh:https://github.com/jordanvalnet/code-dev-intel.ts/milestones].
Trois décisions raisonnables, dans cet ordre : essayer l'outil un mois sur une équipe volontaire et comparer la facture d'IA avant et après [src:readme.md] ; ne rien construire de vendable dessus avant un avis juridique sur la licence [facts:risks.0.note] ; exiger une version publiée à jour, la dernière datant de mars quand le travail interne est de septembre [facts:releases.0.date] [src:changelog.md].
> À essayer en interne et à mesurer sur la facture d'IA, à ne pas intégrer à un produit vendu sans avis juridique [facts:risks.0.note] [src:readme.md].

## Ce que je retiens
- Le problème est réel et le gain chiffré : 13 à 34 % de consommation en moins sur les tâches difficiles, et 11 agents sur 11 qui adoptent l'outil sans qu'on le leur demande [src:readme.md].
- L'adoption extérieure est nulle à ce jour : 0 étoile, 0 copie, 1 demande ouverte, près de six mois après la création du projet [facts:repo.stars] [facts:repo.forks] [facts:issues.open] [facts:repo.created_at].
- Tout repose sur une personne, sur un compte personnel, sans financement déclaré ni relais désigné [facts:activity.bus_factor] [facts:repo.owner_type] [facts:business.funding].
- La licence AGPL-3.0 autorise l'usage interne et bloque l'intégration dans un produit vendu sans ouverture de votre code [facts:repo.license] [src:license.md].
- Décision : essai interne d'un mois avec mesure de la consommation d'IA, avis juridique sur la licence, version publiée à jour comme condition avant tout usage plus large [facts:releases.0.date] [facts:risks.0.note].
