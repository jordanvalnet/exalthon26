---
repo: n8n-io/n8n
profile: investisseur
generated_at: 2026-09-10T14:32:00Z
---
# n8n : leader d'audience de l'automatisation, défendu par sa licence et son catalogue plus que par son code

## Quel problème et quel marché ?

n8n vend l'automatisation des tâches d'entreprise et, désormais, les agents IA : on relie des blocs sur un canevas visuel, on ajoute du code là où il faut, on héberge chez soi ou on prend le service en ligne de l'éditeur [facts:repo.description] [src:readme.md].

Le marché visé se lit dans les mots-clés du dépôt : iPaaS, low-code, no-code, auto-hébergement, MCP [facts:repo.topics].

L'argument de vente n'est pas le moteur, c'est l'existant : plus de 1 500 intégrations et plus de 9 000 modèles de flux déjà écrits, que tout entrant doit reconstruire [src:readme.md].

Le projet est public depuis le 22 juin 2019 et porté par une organisation, pas par un particulier [facts:repo.created_at] [facts:repo.owner_type].

> Sept ans d'avance sur un marché — automatisation d'entreprise plus agents IA — dont la barrière à l'entrée est le catalogue de connecteurs, pas la technologie [facts:repo.created_at] [src:readme.md].

## Quelle traction ?

<!-- chart: releases -->

203 922 marque-pages et 60 629 copies du dépôt : à cette échelle, la notoriété n'est plus la question, et la part de gens qui prennent le code plutôt que de simplement le noter est élevée [facts:repo.stars] [facts:repo.forks].

La machine de livraison suit le même régime : dix versions publiées entre le 7 et le 10 septembre 2026, jour du relevé [facts:releases].

Trois lignes sont maintenues en parallèle — `n8n@2.39.2`, `n8n@2.38.6` et `n8n@1.123.79` le même jour — ce qui est le signe d'une base installée qu'on ne peut plus bousculer [facts:releases].

Donnée non relevée : chiffre d'affaires, nombre de clients payants, levées de fonds — rien de tout cela ne figure dans le dépôt ; à demander à l'éditeur ou à vérifier sur https://n8n.io [facts:business.funding].

> La traction technique est démontrée et mesurable ; la traction commerciale ne l'est pas ici et reste entièrement à instruire [facts:repo.stars] [facts:business.funding].

## Quelle dynamique ?

<!-- chart: commits_per_week -->

246 puis 254 changements sur les deux dernières semaines relevées, et un dernier changement le jour même du relevé : le projet tourne à plein régime [facts:activity.commits_per_week] [facts:activity.last_commit].

Le flux de contributions est industriel : 756 propositions de modification ouvertes, 375 tickets ouverts et 300 fermés sur trente jours — on traite autant qu'on reçoit [facts:pulls.open] [facts:issues.open] [facts:issues.closed_30d].

La direction est lisible dans les travaux en cours : une comparaison « 3.x » déjà ouverte et la suppression assumée d'un nœud existant, donc des ruptures programmées pour les clients [facts:roadmap.open_prs.2.title] [facts:roadmap.open_prs.6.title].

Limite du relevé, à lire avec le graphique : seuls les 500 derniers changements ont été relevés, ce qui couvre deux semaines ; les dix semaines antérieures apparaissent à zéro faute de données, elles ne sont pas vides [facts:activity.commits_per_week].

> Rythme élevé et roadmap assumée, y compris ses ruptures ; la courbe ne montre que les deux dernières semaines, pas une décélération [facts:activity.commits_per_week] [facts:roadmap.open_prs].

## Quelle équipe et quelle gouvernance ?

<!-- chart: contributors -->

Le bus factor est de 16 : il faudrait perdre seize personnes pour perdre la moitié du travail récent — c'est le contraire d'une dépendance à un homme-clé [facts:activity.bus_factor].

Le premier contributeur ne pèse que 24 changements sur la période, et les dix premiers sont serrés entre 24 et 11 : la charge est répartie, y compris au sommet [facts:activity.contributors.0.commits] [facts:activity.contributors].

La gouvernance est celle d'un éditeur, pas d'une communauté : propriétaires de code déclarés, politique de sécurité publiée, et un accord de licence contributeur à signer qui garde la propriété intellectuelle chez l'éditeur [facts:business.codeowners] [facts:business.security_policy] [src:security.md] [src:tree.md].

Le fondateur et dirigeant, Jan Oberhauser, est identifié publiquement dans la présentation du projet [src:readme.md].

> Éditeur structuré, risque d'homme-clé faible et propriété intellectuelle consolidée par l'accord contributeur : la gouvernance ne s'oppose pas à une opération [facts:activity.bus_factor] [src:tree.md].

## Quelle concurrence ?

Donnée non relevée : la liste des projets comparables et leurs chiffres n'a pas été prise lors de ce relevé ; à instruire à partir de https://github.com/topics/ai et des catégories iPaaS du marché [gh:https://github.com/topics/ai].

Ce qui est relevé, c'est le positionnement revendiqué : le projet se range lui-même dans l'iPaaS, le low-code et l'auto-hébergement, et se déclare à la fois client et serveur MCP — donc au centre du raccordement des agents IA aux outils d'entreprise [facts:repo.topics].

L'argument anti-concurrence est explicite : liberté de modèle — OpenAI, Anthropic, Google ou modèles ouverts — et changement de fournisseur sans refonte, ce qui déplace l'enfermement du modèle vers la plateforme [src:readme.md].

La défendabilité réelle tient donc à trois actifs non copiables rapidement : le catalogue d'intégrations, la base installée et la marque ; le moteur, lui, est visible par tous [src:readme.md] [facts:repo.forks].

> Le dossier concurrentiel est à monter hors du dépôt ; la barrière observable est le catalogue et la base installée, pas la propriété du code [facts:repo.topics] [src:readme.md].

## Licence, financement, risques ?

<!-- chart: risks -->

La licence est le point dur du dossier : « Sustainable Use License », non standard, qui limite l'usage au périmètre interne ou non commercial et n'autorise la redistribution qu'à titre gratuit [facts:repo.license] [facts:risks.0.note] [src:license.md].

Elle protège l'éditeur — aucun hébergeur ne peut revendre le produit tel quel — mais elle est aussi ce qui écarte le projet des usages « open source » standards, et elle réserve les fichiers d'édition entreprise à une licence payante distincte [src:license.md] [src:readme.md].

Aucun fichier de financement ne figure dans le dépôt : le modèle économique affiché est la licence entreprise et le service en ligne, pas le don [facts:business.funding] [src:readme.md].

Côté sécurité, la politique existe et renvoie vers un programme de divulgation de vulnérabilités ; en revanche les vulnérabilités publiées n'ont pas été relevées ici, à vérifier sur https://github.com/n8n-io/n8n/security/advisories [facts:business.security_policy] [src:security.md] [gh:https://github.com/n8n-io/n8n/security/advisories].

Trois risques ont été relevés, un seul de niveau moyen — la licence ; l'industrialisation (intégration continue, dépendances) ne présente rien d'alarmant [facts:risks] [facts:risks.2.note].

> Le risque principal n'est ni technique ni humain : il est juridique, et il est aussi la principale protection du modèle économique [facts:risks.0.note] [src:license.md].

## Pourquoi oui, pourquoi non ?

| Pourquoi oui | Pourquoi non |
|---|---|
| Position d'audience dominante : 203 922 marque-pages, 60 629 copies [facts:repo.stars] [facts:repo.forks] | Aucun chiffre financier vérifiable dans le dépôt : traction commerciale non démontrée ici [facts:business.funding] |
| Exécution soutenue : dix versions en quatre jours, trois lignes maintenues en parallèle [facts:releases] | Dette de compatibilité : trois lignes à maintenir, ruptures « 3.x » déjà engagées [facts:roadmap.open_prs.2.title] |
| Risque d'homme-clé faible : bus factor de 16, charge répartie [facts:activity.bus_factor] | Licence non standard : diligence juridique obligatoire avant tout usage ou revente [facts:risks.0.note] [src:license.md] |
| Modèle économique clair : licence entreprise et service en ligne, pas de dépendance aux dons [src:readme.md] [facts:business.funding] | Charge de support visible : 375 tickets ouverts, 756 modifications en attente [facts:issues.open] [facts:pulls.open] |
| Placé au centre des agents IA : client et serveur MCP revendiqués [facts:repo.topics] | Concurrence non instruite lors de ce relevé, à documenter avant décision [gh:https://github.com/topics/ai] |

> Le dossier se joue sur deux vérifications hors dépôt : les comptes de l'éditeur et l'avis d'un juriste sur la licence [facts:business.funding] [src:license.md].

## Thèse en 3 lignes

1. Actif de premier plan sur un marché porteur : 203 922 marque-pages, 60 629 copies, une organisation qui livre dix versions en quatre jours et ne dépend d'aucun homme-clé — bus factor de 16 [facts:repo.stars] [facts:repo.forks] [facts:releases] [facts:activity.bus_factor].
2. La défendabilité est commerciale et juridique — catalogue de plus de 1 500 intégrations, base installée, licence qui interdit la revente par un tiers — et non technique, le code étant lisible par tous [src:readme.md] [facts:risks.0.note].
3. Verdict : avis favorable sous deux conditions suspensives — obtenir les chiffres financiers, absents du dépôt, et faire valider la « Sustainable Use License » par un juriste avant tout engagement [facts:business.funding] [src:license.md].
