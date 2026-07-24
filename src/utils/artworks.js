import { collectionsData } from "../data/collectionsData.js";
import { collectionMeta, SITE_URL } from "../data/collectionMeta.js";

export function slugify(value = "") {
  return value
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getArtworkEntries(collectionId) {
  const collection = collectionsData[collectionId];
  if (!collection) return [];

  const usedSlugs = new Set();

  return collection.oeuvres.map((artwork, sourceIndex) => {
    const baseSlug = slugify(artwork.titre);
    let slug = baseSlug;

    if (usedSlugs.has(slug)) {
      const suffix = artwork.collectionParticuliere
        ? "collection-particuliere"
        : String(sourceIndex + 1);
      slug = `${baseSlug}-${suffix}`;
    }

    let counter = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    usedSlugs.add(slug);

    return {
      ...artwork,
      collectionId,
      collectionName: collection.nom,
      collectionNameEn: collectionMeta[collectionId]?.en || collection.nom,
      slug,
      path: `/collections/${collectionId}/${slug}`,
      sourceIndex,
    };
  });
}

export function getSortedArtworkEntries(collectionId) {
  return getArtworkEntries(collectionId).sort((a, b) => {
    if (a.collectionParticuliere !== b.collectionParticuliere) {
      return a.collectionParticuliere ? 1 : -1;
    }
    return a.titre.localeCompare(b.titre, "fr", {
      sensitivity: "base",
      numeric: true,
    });
  });
}

export function findArtwork(collectionId, artworkSlug) {
  return getArtworkEntries(collectionId).find(
    (artwork) => artwork.slug === artworkSlug
  );
}

export function getAllArtworks() {
  return Object.keys(collectionsData).flatMap(getArtworkEntries);
}

export function findArtworkByPath(path) {
  return getAllArtworks().find((artwork) => artwork.path === path);
}

export function getArtworkImageList(artwork) {
  return artwork.images?.length ? artwork.images : [artwork.image];
}

export function getArtworkAlt(artwork, en = false) {
  const dimensions = artwork.dimensions
    ? en
      ? `, ${artwork.dimensions}`
      : `, format ${artwork.dimensions}`
    : "";
  return en
    ? `${artwork.titre}, original artwork by François Benett${dimensions}`
    : `Tableau ${artwork.titre} de François Benett${dimensions}`;
}

export function getAbsoluteUrl(path) {
  return `${SITE_URL}${path}`;
}
