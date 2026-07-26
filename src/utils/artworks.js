import { collectionsData } from "../data/collectionsData.js";
import { collectionMeta, SITE_URL } from "../data/collectionMeta.js";
import { artworkColorMetadata } from "../data/artworkColorMetadata.js";

const FIGURE_FORMATS = {
  25: [81, 65],
  40: [100, 81],
  50: [116, 89],
};

export function getArtworkFormatMetrics(dimensions = "", diptych = false) {
  const classic = dimensions.match(/(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)/i);
  const figure = dimensions.match(/(\d+)\s*F/i);
  const values = classic
    ? classic.slice(1, 3).map((value) => Number(value.replace(",", ".")))
    : figure
      ? FIGURE_FORMATS[Number(figure[1])] || []
      : [];
  const [height = 0, width = 0] = values;
  const largestSide = Math.max(height, width);
  const sizeGroup = largestSide >= 100 ? 0 : largestSide > 60 ? 1 : largestSide ? 2 : 3;
  const area = height * width * (diptych ? 2 : 1);

  return { area, sizeGroup };
}

export function compareArtworksByFormatColorSize(a, b) {
  if (a.collectionParticuliere !== b.collectionParticuliere) {
    return a.collectionParticuliere ? 1 : -1;
  }

  const aFormat = getArtworkFormatMetrics(a.dimensions, a.images?.length === 2);
  const bFormat = getArtworkFormatMetrics(b.dimensions, b.images?.length === 2);
  if (aFormat.sizeGroup !== bFormat.sizeGroup) {
    return aFormat.sizeGroup - bFormat.sizeGroup;
  }

  const aColor = artworkColorMetadata[a.path]?.[0]?.[0] || "zz";
  const bColor = artworkColorMetadata[b.path]?.[0]?.[0] || "zz";
  const colorOrder = aColor.localeCompare(bColor, "fr", { sensitivity: "base" });
  if (colorOrder) return colorOrder;
  if (aFormat.area !== bFormat.area) return bFormat.area - aFormat.area;

  return a.titre.localeCompare(b.titre, "fr", {
    sensitivity: "base",
    numeric: true,
  });
}

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
  return getArtworkEntries(collectionId).sort(compareArtworksByFormatColorSize);
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
