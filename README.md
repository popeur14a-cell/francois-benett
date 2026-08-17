# Galerie François Benett — site officiel

Galerie numérique bilingue consacrée à l'œuvre de François Benett. Le site présente 94 œuvres réparties en collections, avec recherche visuelle, favoris, visionneuse, mises en situation et formulaire de contact.

- Production : https://www.benett-peintre.fr
- Technologie : React 19, Vite 8 et Vercel
- Langues : français et anglais
- Documentation de reprise : [Dossier du projet](./docs/DOSSIER_PROJET.md)

## Reprendre le projet

Lire d'abord [AGENTS.md](./AGENTS.md), puis le [dossier du projet](./docs/DOSSIER_PROJET.md). Ces deux fichiers contiennent les règles visuelles, l'état technique et les prochaines priorités.

## Développement local

```text
npm.cmd run dev
```

## Contrôle qualité

```text
npm.cmd run lint
npm.cmd run build
npm.cmd run audit:assets
npm.cmd run check
```

La commande `check` vérifie le code, construit les 222 routes statiques et contrôle les 507 fichiers d'image attendus.

## Architecture

- `src/pages/` : pages du site.
- `src/components/` : navigation, recherche, visionneuses et éléments partagés.
- `src/data/` : catalogue et métadonnées de recherche.
- `public/images/` : originaux, variantes WebP, décors et éléments de marque.
- `scripts/` : génération du sitemap, métadonnées statiques et audits.
- `docs/` : dossier de reprise, références des œuvres et décors.

La publication de production est déclenchée par l'envoi de la branche `main` vers GitHub.
