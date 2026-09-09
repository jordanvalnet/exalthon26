# FAQ

## Q : Combien ça coûte et peut-on l'intégrer dans un produit que nous vendons ? (ceo, 2026-09-09)
Rien à l'achat : la licence Elastic 2.0 accorde un droit d'usage gratuit et mondial pour un usage interne [facts:repo.license] [src:license.md].
En revanche, elle interdit de fournir le logiciel à des tiers comme service hébergé ou géré, et de contourner sa clé de licence [src:license.md].
Un produit vendu qui embarque Context Mode comme service demande donc un avis juridique, voire un accord avec l'auteur, Mert Koseoglu [src:license.md].
Le seul financement déclaré est un lien de dons GitHub Sponsors ; le cache ne contient pas de grille tarifaire pour le tableau de bord hébergé « Insight », à vérifier sur le site [facts:business.funding] [src:funding.md] [src:readme.md] [gh:https://context-mode.com/insight].

## Q : Que se passe-t-il si le mainteneur arrête demain ? (ceo, 2026-09-09)
Le projet s'arrête : une seule personne, mksglu, signe 60 modifications sur 12 semaines, le suivant 6, et le bus factor vaut 1 [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.bus_factor].
Le code ne disparaît pas pour autant : il est public et copié 1 555 fois, donc récupérable, mais aucun responsable n'est désigné pour prendre la relève [facts:repo.forks] [facts:business.codeowners].
Le collecteur classe ce risque comme élevé [facts:risks.2.level] [facts:risks.2.note].
Conséquence pratique : l'adopter pour gagner du temps, oui ; en faire une brique critique d'un produit, non, tant que l'équipe ne s'élargit pas [facts:activity.bus_factor].

## Q : Les 98 % d'économie annoncés sont-ils fiables ? (ceo, 2026-09-09)
C'est le chiffre des auteurs : 315 Ko de données brutes ramenés à 5,4 Ko dans un cas mesuré par eux [src:readme.md] [facts:repo.description].
Le cache ne contient pas de mesure indépendante ; le projet publie un document de résultats de benchmark que le collecteur n'a pas lu, à vérifier [facts:tree.13.role] [gh:https://github.com/mksglu/context-mode/blob/main/BENCHMARK.md].
Un ticket ouvert signale que les statistiques d'économie affichées par l'outil se contredisent d'un écran à l'autre, et un autre que la reprise de session injecte bien plus de données qu'annoncé [facts:issues.hot.3.title] [facts:issues.hot.9.title].
Conclusion : prendre 98 % comme un ordre de grandeur marketing, et mesurer sur un pilote la facture d'IA avant et après [src:readme.md].
