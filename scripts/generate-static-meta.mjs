import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectionsData } from "../src/data/collectionsData.js";
import { collectionMeta, SITE_URL } from "../src/data/collectionMeta.js";
import {
  getAbsoluteUrl,
  getAllArtworks,
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

const staticPages = [
  {
    path: "/",
    title: "François Benett — Artiste peintre contemporain",
    description:
      "Découvrez l’univers de François Benett, peintre contemporain français, ses collections et ses œuvres originales disponibles.",
    image: "/images/benett-cover-1920.webp",
  },
  {
    path: "/collections",
    title: "Collections — François Benett",
    description:
      "Explorez les collections de François Benett : Venise, Paris, Bretagne, Espagne, Maroc, Tango et scènes de vie.",
  },
  {
    path: "/parcours",
    title: "Parcours de François Benett — Artiste peintre",
    description:
      "Découvrez le parcours, la démarche artistique et les principales expositions de François Benett, peintre contemporain.",
    image: "/images/portrait.jpg",
  },
  {
    path: "/contact",
    title: "Contacter François Benett — Artiste peintre",
    description:
      "Contactez François Benett pour une œuvre originale, une exposition ou un projet artistique.",
    image: "/images/portrait-2.jpg",
  },
  {
    path: "/mentions-legales",
    title: "Mentions légales | Galerie François Benett",
    description: "Informations légales du site officiel de François Benett.",
  },
  {
    path: "/confidentialite",
    title: "Politique de confidentialité | Galerie François Benett",
    description:
      "Informations sur la protection et l’utilisation des données personnelles sur le site de François Benett.",
  },
  {
    path: "/favoris",
    title: "Mes œuvres favorites | Galerie François Benett",
    description: "Retrouvez les œuvres de François Benett ajoutées à vos favoris.",
    robots: "noindex, follow",
  },
];

const collectionPages = Object.entries(collectionsData).map(([slug, collection]) => ({
  path: `/collections/${slug}`,
  title: `${collection.nom} — Collection de François Benett`,
  description:
    collectionMeta[slug]?.fr ||
    `Découvrez les œuvres de la collection ${collection.nom} de François Benett.`,
  image: collection.couverture,
  type: "collection",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Collection ${collection.nom} — François Benett`,
    url: `${SITE_URL}/collections/${slug}`,
    description: collectionMeta[slug]?.fr,
  },
}));

const artworkPages = getAllArtworks().map((artwork) => {
  const collectionName = artwork.collectionName;
  const availability = artwork.collectionParticuliere
    ? "collection particulière"
    : "disponible sur demande";
  const dimensions = artwork.dimensions ? `, format ${artwork.dimensions}` : "";
  const description = `${artwork.titre}, œuvre originale de François Benett${dimensions}, collection ${collectionName}, ${availability}.`;
  const images = getArtworkImageList(artwork).map(getAbsoluteUrl);

  return {
    path: artwork.path,
    title: `${artwork.titre} — François Benett`,
    description,
    image: getArtworkImageList(artwork)[0],
    type: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      name: artwork.titre,
      creator: {
        "@type": "Person",
        name: "François Benett",
        url: SITE_URL,
      },
      image: images,
      url: `${SITE_URL}${artwork.path}`,
      ...(artwork.dimensions ? { size: artwork.dimensions } : {}),
      isPartOf: {
        "@type": "CollectionPage",
        name: collectionName,
        url: `${SITE_URL}/collections/${artwork.collectionId}`,
      },
    },
  };
});

const siteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Galerie François Benett",
  url: SITE_URL,
  inLanguage: "fr-FR",
};

function render(page) {
  const canonical = `${SITE_URL}${page.path === "/" ? "/" : page.path}`;
  const image = getAbsoluteUrl(page.image || "/logo-b.png");
  const extraHead = `
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta name="robots" content="${page.robots || "index, follow"}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:type" content="${page.type || "website"}" />
    <meta property="og:site_name" content="Galerie François Benett" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:locale:alternate" content="en_GB" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json">${jsonLd(page.structuredData || siteData)}</script>`;

  return template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(page.description)}" />`
    )
    .replace("</head>", `${extraHead}\n  </head>`);
}

async function writePage(page) {
  const target = page.path === "/"
    ? join(dist, "index.html")
    : join(dist, `${page.path.slice(1)}.html`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(page), "utf8");
}

for (const page of [...staticPages, ...collectionPages, ...artworkPages]) {
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
  `Static metadata generated for ${staticPages.length + collectionPages.length + artworkPages.length} routes.`
);
