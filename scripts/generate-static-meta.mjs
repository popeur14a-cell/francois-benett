import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectionsData } from "../src/data/collectionsData.js";
import { collectionMeta, SITE_URL } from "../src/data/collectionMeta.js";
import {
  getAbsoluteUrl,
  getAllArtworks,
  getArtworkEntries,
  getArtworkImageList,
} from "../src/utils/artworks.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const template = await readFile(join(dist, "index.html"), "utf8");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const jsonLd = (value) =>
  JSON.stringify(value).replaceAll("<", "\\u003c");

const localizedPath = (path, language) =>
  language === "en" ? `/en${path === "/" ? "" : path}` : path;

const renderLinkList = (items, language) => {
  if (!items?.length) return "";

  return `<nav aria-label="${language === "en" ? "Explore the gallery" : "Explorer la galerie"}">
      <ul>
${items
  .map(
    ({ path, label }) =>
      `        <li><a href="${escapeHtml(localizedPath(path, language))}">${escapeHtml(label)}</a></li>`
  )
  .join("\n")}
      </ul>
    </nav>`;
};

const staticPages = [
  {
    path: "/",
    title: "François Benett — Artiste peintre contemporain",
    enTitle: "François Benett — Contemporary painter",
    description:
      "Découvrez l’univers de François Benett, peintre contemporain français, ses collections et ses œuvres originales disponibles.",
    enDescription:
      "Discover the world of French contemporary painter François Benett, his collections and available original artworks.",
    image: "/images/hero/benett-cover-1920.webp",
  },
  {
    path: "/collections",
    title: "Collections — François Benett",
    enTitle: "Collections — François Benett",
    description:
      "Explorez les collections de François Benett : Venise, Paris, Bretagne, Espagne, Maroc, Tango et scènes de vie.",
    enDescription:
      "Explore François Benett’s collections: Venice, Paris, Brittany, Spain, Morocco, tango and intimate scenes.",
  },
  {
    path: "/parcours",
    title: "Parcours de François Benett — Artiste peintre",
    enTitle: "François Benett’s journey — Contemporary painter",
    description:
      "Découvrez le parcours, la démarche artistique et les principales expositions de François Benett, peintre contemporain.",
    enDescription:
      "Discover contemporary painter François Benett’s journey, artistic approach and major exhibitions.",
    image: "/images/portraits/portrait.jpg",
  },
  {
    path: "/contact",
    title: "Contacter François Benett — Artiste peintre",
    enTitle: "Contact François Benett — Contemporary painter",
    description:
      "Contactez François Benett pour une œuvre originale, une exposition ou un projet artistique.",
    enDescription:
      "Contact François Benett about an original artwork, an exhibition or an artistic project.",
    image: "/images/portraits/portrait-2.jpg",
  },
  {
    path: "/mentions-legales",
    title: "Mentions légales | Galerie François Benett",
    enTitle: "Legal notice | François Benett Gallery",
    description: "Informations légales du site officiel de François Benett.",
    enDescription: "Legal information for the official François Benett website.",
  },
  {
    path: "/confidentialite",
    title: "Politique de confidentialité | Galerie François Benett",
    enTitle: "Privacy policy | François Benett Gallery",
    description:
      "Informations sur la protection et l’utilisation des données personnelles sur le site de François Benett.",
    enDescription:
      "Information about personal data protection and use on the François Benett website.",
  },
  {
    path: "/favoris",
    title: "Mes œuvres favorites | Galerie François Benett",
    enTitle: "My favourite artworks | François Benett Gallery",
    description: "Retrouvez les œuvres de François Benett ajoutées à vos favoris.",
    enDescription: "Find the François Benett artworks saved to your favourites.",
    robots: "noindex, follow",
  },
];

const collectionPages = Object.entries(collectionsData).map(([slug, collection]) => ({
  path: `/collections/${slug}`,
  title: `${collection.nom} — Collection de François Benett`,
  enTitle: `${collectionMeta[slug]?.en || collection.nom} — François Benett collection`,
  description:
    collectionMeta[slug]?.fr ||
    `Découvrez les œuvres de la collection ${collection.nom} de François Benett.`,
  enDescription:
    collectionMeta[slug]?.enText ||
    `Discover the works in François Benett’s ${collectionMeta[slug]?.en || collection.nom} collection.`,
  image: collection.couverture,
  type: "collection",
  collectionId: slug,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Collection ${collection.nom} — François Benett`,
        url: `${SITE_URL}/collections/${slug}`,
        description: collectionMeta[slug]?.fr,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: collection.oeuvres.length,
          itemListElement: getArtworkEntries(slug).map((artwork, position) => ({
            "@type": "ListItem",
            position: position + 1,
            name: artwork.titre,
            url: `${SITE_URL}${artwork.path}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE_URL}/collections` },
          { "@type": "ListItem", position: 3, name: collection.nom, item: `${SITE_URL}/collections/${slug}` },
        ],
      },
    ],
  },
}));

const artworkPages = getAllArtworks().map((artwork) => {
  const collectionName = artwork.collectionName;
  const availability = artwork.collectionParticuliere
    ? "collection particulière"
    : "disponible sur demande";
  const dimensions = artwork.dimensions ? `, format ${artwork.dimensions}` : "";
  const description = `${artwork.titre}, œuvre originale de François Benett${dimensions}, collection ${collectionName}, ${availability}.`;
  const enDescription = `${artwork.titre}, original artwork by François Benett${artwork.dimensions ? `, ${artwork.dimensions}` : ""}, ${artwork.collectionNameEn} collection, ${artwork.collectionParticuliere ? "private collection" : "available upon request"}.`;
  const images = getArtworkImageList(artwork).map(getAbsoluteUrl);

  return {
    path: artwork.path,
    title: `${artwork.titre} — François Benett`,
    enTitle: `${artwork.titre} — François Benett`,
    description,
    enDescription,
    image: getArtworkImageList(artwork)[0],
    type: "article",
    artwork,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "VisualArtwork",
          name: artwork.titre,
          description,
          artform: "Peinture",
          creator: {
            "@type": "Person",
            name: "François Benett",
            url: SITE_URL,
          },
          copyrightHolder: {
            "@type": "Person",
            name: "François Benett",
          },
          image: images,
          url: `${SITE_URL}${artwork.path}`,
          mainEntityOfPage: `${SITE_URL}${artwork.path}`,
          ...(artwork.dimensions ? { size: artwork.dimensions } : {}),
          ...(artwork.technique ? { artMedium: artwork.technique } : {}),
          isPartOf: {
            "@type": "CollectionPage",
            name: collectionName,
            url: `${SITE_URL}/collections/${artwork.collectionId}`,
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE_URL}/collections` },
            { "@type": "ListItem", position: 3, name: collectionName, item: `${SITE_URL}/collections/${artwork.collectionId}` },
            { "@type": "ListItem", position: 4, name: artwork.titre, item: `${SITE_URL}${artwork.path}` },
          ],
        },
      ],
    },
  };
});

const siteData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Galerie François Benett",
      url: SITE_URL,
      inLanguage: ["fr-FR", "en-GB"],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "François Benett",
      url: `${SITE_URL}/parcours`,
      jobTitle: "Artiste peintre contemporain",
      sameAs: [
        "https://www.instagram.com/benett_gallery/",
        "https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295",
      ],
    },
  ],
};

function renderSeoFallback(page) {
  const language = page.language || "fr";
  const en = language === "en";
  const basePath = page.path.replace(/^\/en(?=\/|$)/, "") || "/";
  let links = [];

  if (basePath === "/") {
    links = [
      { path: "/collections", label: en ? "Explore the collections" : "Explorer les collections" },
      { path: "/parcours", label: en ? "About François Benett" : "Parcours de François Benett" },
      { path: "/contact", label: en ? "Contact the artist" : "Contacter l’artiste" },
    ];
  } else if (basePath === "/collections") {
    links = Object.entries(collectionsData).map(([slug, collection]) => ({
      path: `/collections/${slug}`,
      label: en ? collectionMeta[slug]?.en || collection.nom : collection.nom,
    }));
  } else if (page.collectionId) {
    links = getArtworkEntries(page.collectionId).map((artwork) => ({
      path: artwork.path,
      label: artwork.titre,
    }));
  } else if (page.artwork) {
    links = [
      {
        path: `/collections/${page.artwork.collectionId}`,
        label: en
          ? `${page.artwork.collectionNameEn} collection`
          : `Collection ${page.artwork.collectionName}`,
      },
      { path: "/collections", label: en ? "All collections" : "Toutes les collections" },
    ];
  }

  const image = page.image
    ? `<img src="${escapeHtml(page.image)}" alt="${escapeHtml(
        page.artwork
          ? en
            ? `${page.artwork.titre}, artwork by François Benett`
            : `${page.artwork.titre}, œuvre de François Benett`
          : page.title
      )}" width="960" height="720" />`
    : "";

  return `<main data-seo-fallback>
    <h1>${escapeHtml(page.title)}</h1>
    <p>${escapeHtml(page.description)}</p>
    ${image}
    ${renderLinkList(links, language)}
  </main>`;
}

function render(page) {
  const canonical = `${SITE_URL}${page.path === "/" ? "/" : page.path}`;
  const image = getAbsoluteUrl(page.image || "/images/branding/logo-b.png");
  const extraHead = `
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta name="robots" content="${page.robots || "index, follow"}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:type" content="${page.type || "website"}" />
    <meta property="og:site_name" content="Galerie François Benett" />
    <meta property="og:locale" content="${page.language === "en" ? "en_GB" : "fr_FR"}" />
    <meta property="og:locale:alternate" content="${page.language === "en" ? "fr_FR" : "en_GB"}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json">${jsonLd(page.structuredData || {
      ...siteData,
      url: canonical,
      inLanguage: page.language === "en" ? "en-GB" : "fr-FR",
    })}</script>`;

  const routeTemplate = page.path === "/" || page.path === "/en"
    ? template
    : template.replace(/\s*<link[^>]*data-home-hero[^>]*\/>/gi, "");

  const frenchPath = page.path.replace(/^\/en(?=\/|$)/, "") || "/";
  const englishPath = `/en${frenchPath === "/" ? "" : frenchPath}`;
  const frenchUrl = `${SITE_URL}${frenchPath === "/" ? "/" : frenchPath}`;
  const englishUrl = `${SITE_URL}${englishPath}`;

  return routeTemplate
    .replace('<html lang="fr">', `<html lang="${page.language || "fr"}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(page.description)}" />`
    )
    .replace(
      "</head>",
      `    <link rel="alternate" hreflang="fr" href="${frenchUrl}" />
    <link rel="alternate" hreflang="en" href="${englishUrl}" />
    <link rel="alternate" hreflang="x-default" href="${frenchUrl}" />
${extraHead}\n  </head>`
    )
    .replace('<div id="root"></div>', `<div id="root">${renderSeoFallback(page)}</div>`);
}

async function writePage(page) {
  const target = page.path === "/"
    ? join(dist, "index.html")
    : join(dist, `${page.path.slice(1)}.html`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(page), "utf8");
}

const frenchPages = [...staticPages, ...collectionPages, ...artworkPages];
const allPages = frenchPages.flatMap((page) => [
  page,
  {
    ...page,
    path: `/en${page.path === "/" ? "" : page.path}`,
    language: "en",
    title: page.enTitle || page.title,
    description: page.enDescription || page.description,
    structuredData: page.structuredData
      ? JSON.parse(
          JSON.stringify(page.structuredData).replaceAll(
            `${SITE_URL}/collections/`,
            `${SITE_URL}/en/collections/`
          )
        )
      : undefined,
  },
]);

for (const page of allPages) {
  await writePage(page);
}

await writeFile(
  join(dist, "404.html"),
  render({
    path: "/404",
    title: "Page introuvable | Galerie François Benett",
    description: "La page demandée n’existe pas ou n’est plus disponible.",
    robots: "noindex, follow",
  }),
  "utf8"
);

console.log(
  `Static metadata generated for ${allPages.length} routes.`
);
