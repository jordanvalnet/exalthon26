---
repo: langchain-ai/langgraph
profile: enfant
generated_at: 2026-09-10T13:55:00Z
---
# LangGraph : le plan de route qui empêche les robots-assistants de se perdre

## C'est quoi, ce projet ?
Tu as déjà vu un assistant sur un ordinateur, qui répond à une question ou écrit un texte ? Il est très fort, mais il oublie tout dès qu'on ferme la fenêtre.

LangGraph, c'est le plan de route qu'on lui donne. Un plan avec des étapes, comme un jeu de l'oie : case 1, tu lis la question ; case 2, tu cherches ; case 3, tu réponds [src:readme.md].

Et à chaque case, un marque-page est posé. Si l'ordinateur s'éteint au milieu, l'assistant repart de la bonne case, pas du début [src:readme.md].

Les gens qui l'ont fabriqué résument tout ça en trois mots : « construire des agents résistants » [facts:repo.description].
> LangGraph, c'est un jeu de l'oie pour robots : des cases à suivre et un marque-page à chaque case, pour ne jamais recommencer à zéro [src:readme.md].

## Qui s'en sert et pour quoi faire ?
Des adultes qui programment, dans des entreprises dont les sites servent à des millions de gens : Klarna, Replit, Elastic [src:readme.md].

Sur GitHub — le grand site où tout le monde range ses programmes — 41 384 personnes ont mis une étoile à LangGraph, comme un « j'aime » [facts:repo.stars]. Et 6 990 équipes en ont pris une copie pour la bricoler chez elles [facts:repo.forks].

Ils s'en servent pour des assistants qui travaillent longtemps : plusieurs minutes, parfois plusieurs heures, sans qu'un humain reste devant l'écran [src:readme.md].

Le plus malin : à n'importe quel moment, une personne peut appuyer sur pause, regarder ce que l'assistant a dans la tête, corriger, puis dire « continue » [src:readme.md].
> 41 384 étoiles et de grandes entreprises : LangGraph sert à faire travailler des assistants longtemps, sans jamais les laisser tout seuls [facts:repo.stars] [src:readme.md].

## Combien de personnes le fabriquent ?
<!-- chart: contributors -->
Sur les trois derniers mois, une dizaine de personnes ont mis la main dedans [facts:activity.contributors]. Celle qui en a fait le plus se surnomme `eliornl` : 11 changements à elle seule [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits].

C'est une petite bande, pas une foule. À quatre, ils font déjà la moitié du travail [facts:activity.bus_factor].

Imagine un club de foot : il y a des milliers de supporters dans les tribunes — les 41 384 étoiles — et seulement quelques joueurs sur le terrain [facts:repo.stars].
> Des milliers de supporters, une dizaine de joueurs : à quatre, ils font la moitié du travail [facts:activity.bus_factor] [facts:activity.contributors].

## Comment on fabrique un logiciel à plusieurs ?
On range, sinon c'est la pagaille. À l'entrée du projet il y a 11 tiroirs [facts:tree]. Le plus gros s'appelle `libs` : il contient les 9 morceaux du programme, comme les 9 wagons d'un train [facts:tree.10.role] [src:tree.md].

Chaque fois que quelqu'un change quelque chose, ça s'appelle un commit : une page ajoutée au cahier du projet. En douze semaines, il y a eu 112 pages [facts:activity.commits_per_week]. La dernière a été collée le 9 septembre 2026 [facts:activity.last_commit].

Et personne ne colle sa page tout seul : dans le tiroir `.github` vivent 17 petits robots vérificateurs. Ils relisent chaque changement et refusent celui qui casse quelque chose [facts:tree.0.role] [src:tree.md].
> On range tout en tiroirs, et 17 robots relisent chaque page avant qu'elle soit collée dans le cahier [facts:tree.0.role] [src:tree.md].

## Une chose étonnante sur ce projet ?
Tout ça est gratuit. Le programme porte une étiquette qui s'appelle MIT : n'importe qui peut le prendre, s'en servir, le modifier, et même le mettre dans un produit qu'il vend — sans payer un centime [facts:repo.license].

C'est comme si un grand cuisinier publiait sa recette secrète en disant : servez-vous, faites-en des gâteaux, vendez-les si ça vous chante.

Autre surprise : le projet est né le 9 août 2023 [facts:repo.created_at]. En trois ans, il a récolté 41 384 étoiles [facts:repo.stars] — de quoi remplir un grand stade, rien qu'avec des gens qui aiment un programme.
> Un programme que de grandes entreprises font tourner, offert gratuitement à tout le monde, et déjà étoilé 41 384 fois en trois ans [facts:repo.license] [facts:repo.stars].

## Et toi, tu ferais quoi avec ?
- Un assistant qui reprend ton exposé demain exactement là où tu l'as laissé, comme un marque-page dans ton livre [src:readme.md].
- Un assistant qui te demande « tu es sûr ? » avant de faire quelque chose d'important, au lieu de foncer tout seul [src:readme.md].
- Un assistant qui se souvient de tes goûts d'une fois sur l'autre, comme un copain qui sait déjà que tu détestes les olives [src:readme.md].
Et si un jour tu veux regarder à l'intérieur, tout est là, gratuitement : https://github.com/langchain-ai/langgraph [facts:repo.url]
