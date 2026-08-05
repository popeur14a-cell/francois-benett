import fs from "node:fs";
import path from "node:path";
import { collectionsData } from "../src/data/collectionsData.js";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicImages = path.join(projectRoot, "public", "images");
const usedImages = new Set();

// Master used by scripts/optimize-images.py to regenerate the hero variants.
usedImages.add("/images/hero/benett-cover.webp");

for (const collection of Object.values(collectionsData)) {
  if (collection.couverture) usedImages.add(collection.couverture);

  for (const artwork of collection.oeuvres) {
    for (const image of [
      artwork.image,
      artwork.thumbnail,
      ...(artwork.images || []),
    ]) {
      if (image) usedImages.add(image);
    }
  }
}

for (const relativeFile of [
  "index.html",
  "public/site.webmanifest",
  "src/App.jsx",
  "src/components/Footer.jsx",
  "src/components/InteriorViewer.jsx",
  "src/components/Navbar.jsx",
  "src/pages/Collections.jsx",
  "src/pages/Home.jsx",
  "src/pages/Parcours.jsx",
]) {
  const source = fs.readFileSync(path.join(projectRoot, relativeFile), "utf8");

  for (const match of source.matchAll(/(\/images\/[^\s,"'`;]+)/g)) {
    usedImages.add(match[1]);
  }
}

const responsiveImages = new Set();

for (const image of usedImages) {
  if (
    !image.startsWith("/images/") ||
    image.includes("/branding/") ||
    image.includes("/interieurs/") ||
    image.includes("benett-cover")
  ) {
    continue;
  }

  const extensionIndex = image.lastIndexOf(".");
  const base = image.slice("/images/".length, extensionIndex);

  for (const width of [480, 640, 960, 1280]) {
    responsiveImages.add(`/images/responsive/${base}-${width}.webp`);
  }
}

const allImages = fs
  .readdirSync(publicImages, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) =>
    path
      .join(entry.parentPath, entry.name)
      .replaceAll("\\", "/")
      .replace(`${projectRoot.replaceAll("\\", "/")}/public`, "")
  );

const expectedImages = new Set([...usedImages, ...responsiveImages]);
const unused = allImages.filter((image) => !expectedImages.has(image)).sort();
const missing = [...expectedImages]
  .filter((image) => !allImages.includes(image))
  .sort();

console.log(
  JSON.stringify(
    {
      artworkCount: Object.values(collectionsData).reduce(
        (total, collection) => total + collection.oeuvres.length,
        0
      ),
      imageCount: allImages.length,
      usedCount: expectedImages.size,
      unusedCount: unused.length,
      unused,
      missingCount: missing.length,
      missing,
    },
    null,
    2
  )
);
