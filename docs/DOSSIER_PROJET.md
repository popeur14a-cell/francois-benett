# Dossier de reprise et de maintenance — Galerie François Benett

Dernière mise à jour : 17 août 2026

## À lire en premier

Ce document permet à une nouvelle conversation Codex de reprendre le projet sans relire l'ancien historique.

Message de reprise conseillé :

> Ouvre le projet `C:\Users\popeu\Documents\francois-benett`, lis `AGENTS.md` puis `docs/DOSSIER_PROJET.md` entièrement. Vérifie ensuite `git status` avant toute modification. Ne publie rien tant que je ne te le demande pas explicitement.

## Projet

- Site officiel : https://www.benett-peintre.fr
- Dépôt GitHub : https://github.com/popeur14a-cell/francois-benett
- Hébergement : Vercel, projet `francois-benett`, équipe `benett`
- Technologie : React 19, Vite 8, React Router 7
- Langues : français et anglais
- Formulaire : fonction Vercel dans `api/contact.js`, envoi par Resend
- Mesure : Vercel Web Analytics et Speed Insights
- Catalogue actuel : 94 œuvres, 220 URL dans le sitemap et 222 routes statiques générées

## Présentation rapide à un tiers

Le site est une galerie numérique bilingue consacrée à François Benett. Il associe une présentation éditoriale sobre à un catalogue consultable par collection, couleur, sujet et format. Les œuvres disposent de fiches détaillées, d'une visionneuse, de favoris et de mises en situation respectant autant que possible leurs dimensions réelles. Le projet est hébergé sur Vercel, suivi avec Web Analytics et Speed Insights, et son formulaire utilise Resend.

## Commandes de travail

Sous Windows/PowerShell :

```text
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
npm.cmd run audit:assets
npm.cmd run check
```

Le serveur local utilise généralement `http://localhost:5173/`, mais Vite peut choisir 5174, 5175, etc. si le port est déjà occupé. Ce changement est normal.

## Structure importante

- `src/data/collectionsData.js` : catalogue, titres, formats, disponibilités et ordre des œuvres.
- `src/data/collectionMeta.js` : textes et informations des collections.
- `src/data/artworkSearchMetadata.js` et `src/data/artworkColorMetadata.js` : recherche par sujet, couleur, format et ambiance.
- `src/pages/CollectionDetail.jsx` : pages de collection.
- `src/pages/ArtworkDetail.jsx` : fiches d'œuvre, visionneuse, intérieur et œuvres associées.
- `src/pages/Home.jsx` : accueil et carrousel principal.
- `src/components/InteriorViewer.jsx` : mise en situation des tableaux.
- `src/index.css` : point d'entrée des styles. La grande feuille historique a déjà été découpée dans `src/styles/` (`foundation`, `experience`, `gallery`, `contact-and-legal`, `polish`).
- `public/images/<collection>/` : originaux rangés par collection.
- `public/images/responsive/<collection>/` : variantes WebP générées.
- `scripts/optimize-images.py` : optimisation des images.
- `scripts/generate-sitemap.mjs` : sitemap.
- `scripts/generate-static-meta.mjs` : métadonnées statiques pour les routes.
- `docs/artwork-reference.json` : référence détaillée des œuvres et de leur contenu visuel.
- `docs/interior-scenes.md` : références des décors intérieurs.

## Principes visuels validés

- Identité de galerie claire, minimaliste, raffinée et chaleureuse.
- Titres élégants, boutons fins et arrondis, palette cohérente vert sauge/noir/crème.
- Les œuvres ne doivent jamais être arrondies comme les boutons.
- Les portraits de l'artiste peuvent être arrondis.
- Le cœur des favoris est sans cercle et devient vert sauge lorsqu'il est actif.
- Sur mobile : flèches et loupe parfaitement centrées, navigation précédente/suivante alignée.
- Le diptyque « Le secret de Guémené-Penfao » doit pouvoir être vu ensemble ou panneau par panneau.
- Les dimensions réelles doivent guider l'échelle des œuvres dans les intérieurs.
- Une collection particulière ne propose pas « Demander des informations ».
- La navigation et le changement FR/EN doivent conserver autant que possible la page et la position utiles.

## Contenu récent important

- « La Découverte » : collection Venise, 156 × 116 cm, disponible sur demande.
- « Miroir » : collection Venise, 41 × 33 cm.
- « Adagio » : collection Clowns, 80 × 80 cm.
- « La Marionnettiste » : disponible sur demande.
- « Passionata » : anciennement « Attente 2 », 80 × 80 cm.
- « Tango in the night 2 » : 130 × 97 cm.
- « Les Joueurs » : 80 × 80 cm, version noir et blanc.
- « Jeu de cartes » a été retiré comme doublon de « Les Joueurs ».

## SEO et Google Search Console

- `robots.txt`, `sitemap.xml`, URL canoniques, versions FR/EN et données structurées sont en place.
- Le sitemap contient environ 220 URL et a été accepté par Google.
- Dernier état observé avant le 17 août 2026 : 21 pages indexées et environ 200 pages détectées mais pas encore indexées.
- Le test en direct d'une œuvre récente était vert : Google pouvait accéder à la page et l'indexer. Le principal délai venait donc de l'exploration de Google, pas d'un blocage technique.
- Ne pas demander manuellement l'indexation de toutes les œuvres. Prioriser l'accueil, Collections, Parcours, les grandes collections et quelques œuvres majeures ; laisser ensuite le sitemap faire son travail.

L'indexation sert à permettre à une page d'apparaître dans les résultats Google. Une page publiée mais non indexée reste accessible par son adresse, mais Google ne la propose généralement pas dans ses résultats.

## Vercel et sécurité

- Le déploiement de production suit la branche `main` du dépôt GitHub.
- Un envoi sur `main` peut déclencher automatiquement une nouvelle publication.
- Variables attendues dans Vercel, sans stocker leurs valeurs ici : `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.
- Le domaine d'envoi Resend a été vérifié.
- Ne jamais afficher, copier dans le dépôt ou communiquer les valeurs des variables sensibles.

## Audit qualité du 17 août 2026

- `npm audit --omit=dev` : aucune vulnérabilité connue.
- `npm run check` : lint, construction, métadonnées et audit des ressources réussis.
- 94 œuvres, 507 fichiers d'image attendus, aucun fichier manquant, inutilisé ou dupliqué à l'identique.
- 220 URL uniques dans le sitemap, chacune avec ses variantes `fr`, `en` et `x-default`.
- 222 routes statiques disposent de métadonnées dédiées.
- Le JavaScript initial compressé pèse environ 81 Ko et la feuille de styles environ 16 Ko ; le découpage par page est actif.
- Les liens internes anglais pointent désormais directement vers `/en/...`, sans redirection intermédiaire.
- Les dates `lastmod` artificielles ont été retirées du sitemap : Google préfère leur absence à une date inexacte renouvelée à chaque construction.
- Le contrôle Chrome reste bloqué tant que le plugin Browser/Chrome n'a pas été réinstallé depuis l'interface Codex. Après reconnexion, demander l'indexation de quatre pages prioritaires : accueil, Collections, Parcours et collection Venise, en remplaçant toute page déjà indexée par une autre collection importante.

## Dernier état connu

- Production publiée le 17 août 2026 depuis la branche `main`, avec le dossier de reprise, les redirections historiques et les optimisations de qualité.
- Déploiement Vercel vérifié `READY`, sans erreur d'exécution observée après publication.
- Le dépôt était propre au début de la session du 17 août 2026.
- Les derniers contrôles connus de lint et de build étaient réussis.
- Le site fonctionnait en production ; aucun incident de sécurité connu.
- Cette session a créé la mémoire durable et publié les corrections. L'accès automatique à Search Console reste bloqué par la liaison de l'extension Chrome ; aucune demande d'indexation n'a donc encore été envoyée.
- Une erreur SEO a été trouvée : les anciennes URL en majuscules sans `.html` aboutissaient en 404 après le nettoyage automatique de Vercel. Des redirections intermédiaires ont été ajoutées dans `vercel.json`; elles doivent être publiées avant de demander les quatre indexations prioritaires.

## Priorités futures raisonnables

1. Suivre l'évolution de l'indexation après quelques jours, sans multiplier les demandes manuelles.
2. Utiliser Speed Insights avec suffisamment de visites réelles avant d'optimiser davantage.
3. Continuer à simplifier les styles déjà répartis dans `src/styles/` en supprimant seulement les règles réellement redondantes, après contrôle visuel.
4. Continuer à produire les variantes WebP pour chaque nouvelle œuvre.
5. Mettre à jour ce document après chaque ajout majeur, publication ou changement d'infrastructure.
