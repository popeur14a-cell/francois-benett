import { writeFile } from "node:fs/promises";
import { collectionsData } from "../src/data/collectionsData.js";
import { SITE_URL } from "../src/data/collectionMeta.js";
import { getAllArtworks, getArtworkImageList } from "../src/utils/artworks.js";

const lastModified = new Date().toISOString().slice(0, 10);

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const staticPages = [
  ["/", "weekly", "1.0"],
  ["/collections", "weekly", "0.9"],
  ["/parcours", "monthly", "0.8"],
  ["/contact", "monthly", "0.7"],
  ["/mentions-legales", "yearly", "0.3"],
  ["/confidentialite", "yearly", "0.3"],
];

const collectionPages = Object.keys(collectionsData).map((slug) => [
  `/collections/${slug}`,
  "monthly",
  "0.8",
]);

const localizedLinks = (path) => {
  const frenchUrl = `${SITE_URL}${path}`;
  const englishUrl = `${SITE_URL}/en${path === "/" ? "" : path}`;
  return `    <xhtml:link rel="alternate" hreflang="fr" href="${frenchUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frenchUrl}" />`;
};

const standardEntry = ([path, changefreq, priority], language = "fr") => {
  const localizedPath = language === "en" ? `/en${path === "/" ? "" : path}` : path;
  return `  <url>
    <loc>${SITE_URL}${localizedPath}</loc>
${localizedLinks(path)}
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

const artworkEntry = (artwork, language = "fr") => {
  const images = getArtworkImageList(artwork)
    .map(
      (image) => `    <image:image>
      <image:loc>${SITE_URL}${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(`${artwork.titre} — François Benett`)}</image:title>
    </image:image>`
    )
    .join("\n");

  return `  <url>
    <loc>${SITE_URL}${language === "en" ? `/en${artwork.path}` : artwork.path}</loc>
${localizedLinks(artwork.path)}
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${images}
  </url>`;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticPages, ...collectionPages].flatMap((entry) => [standardEntry(entry), standardEntry(entry, "en")]).join("\n")}
${getAllArtworks().flatMap((artwork) => [artworkEntry(artwork), artworkEntry(artwork, "en")]).join("\n")}
</urlset>
`;

await writeFile(new URL("../public/sitemap.xml", import.meta.url), xml, "utf8");
console.log(`Sitemap generated with ${(staticPages.length + collectionPages.length + getAllArtworks().length) * 2} URLs.`);
