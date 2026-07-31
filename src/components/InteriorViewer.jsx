import { useState } from "react";
import { artworkSearchMetadata } from "../data/artworkSearchMetadata";
import { getArtworkDimensionsLabel } from "../utils/artworks";

const interiors = [
  {
    image: "/images/interieurs/intime-ivoire.webp",
    fr: "Intime ivoire",
    en: "Ivory retreat",
    sceneWidthCm: 360,
    sizeRangeCm: [25, 60],
    position: { x: 50, y: 36 },
    palette: ["beige", "blanc", "rose", "jaune"],
    collections: ["scene-d-intimite", "bretonnes", "venise"],
  },
  {
    image: "/images/interieurs/lecture-greige.webp",
    fr: "Salon de lecture",
    en: "Reading room",
    sceneWidthCm: 420,
    sizeRangeCm: [35, 80],
    position: { x: 58, y: 37 },
    palette: ["beige", "blanc", "gris", "jaune"],
    collections: ["scene-d-intimite", "paris", "bretonnes"],
  },
  {
    image: "/images/interieurs/scandinave-lumineux.webp",
    fr: "Scandinave lumineux",
    en: "Light Scandinavian",
    sceneWidthCm: 460,
    sizeRangeCm: [45, 95],
    position: { x: 48, y: 39 },
    palette: ["bleu", "vert", "gris", "blanc", "noir", "beige"],
    collections: ["amsterdam", "bretonnes", "messagers"],
  },
  {
    image: "/images/interieurs/contemporain-sable.webp",
    fr: "Contemporain sable",
    en: "Sand contemporary",
    sceneWidthCm: 500,
    sizeRangeCm: [55, 115],
    position: { x: 58, y: 35 },
    palette: ["beige", "orange", "rouge", "jaune", "blanc"],
    collections: ["scene-d-intimite", "espagne", "maroc"],
  },
  {
    image: "/images/interieurs/parisien-ivoire.webp",
    fr: "Parisien",
    en: "Parisian",
    sceneWidthCm: 540,
    sizeRangeCm: [65, 125],
    position: { x: 61, y: 36 },
    palette: ["rouge", "rose", "noir", "beige", "blanc", "gris"],
    collections: ["paris", "venise", "clowns"],
  },
  {
    image: "/images/interieurs/galerie-chene.webp",
    fr: "Galerie en chêne",
    en: "Oak gallery",
    sceneWidthCm: 580,
    sizeRangeCm: [85, 155],
    position: { x: 49, y: 35 },
    palette: ["beige", "blanc", "gris", "vert", "bleu"],
    collections: ["amsterdam", "bretonnes", "venise"],
  },
  {
    image: "/images/interieurs/loft-industriel.webp",
    fr: "Loft industriel",
    en: "Industrial loft",
    sceneWidthCm: 520,
    sizeRangeCm: [65, 135],
    position: { x: 59, y: 35 },
    palette: ["rouge", "orange", "noir", "gris", "bleu"],
    collections: ["tango", "clowns", "messagers"],
  },
  {
    image: "/images/interieurs/vintage-prune.webp",
    fr: "Vintage prune",
    en: "Plum vintage",
    sceneWidthCm: 470,
    sizeRangeCm: [45, 95],
    position: { x: 50, y: 34 },
    palette: ["rouge", "rose", "orange", "jaune", "noir"],
    collections: ["clowns", "tango", "paris"],
  },
  {
    image: "/images/interieurs/mediterraneen-terracotta.webp",
    fr: "Méditerranéen",
    en: "Mediterranean",
    sceneWidthCm: 500,
    sizeRangeCm: [55, 115],
    position: { x: 45, y: 35 },
    palette: ["orange", "rouge", "jaune", "blanc", "bleu"],
    collections: ["espagne", "venise", "maroc"],
  },
  {
    image: "/images/interieurs/urbain-bleu-gris.webp",
    fr: "Urbain bleu-gris",
    en: "Blue-grey urban",
    sceneWidthCm: 560,
    sizeRangeCm: [75, 145],
    position: { x: 52, y: 34 },
    palette: ["bleu", "gris", "blanc", "noir", "vert"],
    collections: ["amsterdam", "paris", "messagers"],
  },
  {
    image: "/images/interieurs/japandi-sauge.webp",
    fr: "Japandi sauge",
    en: "Sage Japandi",
    sceneWidthCm: 450,
    sizeRangeCm: [40, 90],
    position: { x: 50, y: 35 },
    palette: ["vert", "bleu", "gris", "blanc", "beige"],
    collections: ["bretonnes", "amsterdam", "scene-d-intimite"],
  },
  {
    image: "/images/interieurs/marocain-tadelakt.webp",
    fr: "Tadelakt marocain",
    en: "Moroccan tadelakt",
    sceneWidthCm: 500,
    sizeRangeCm: [55, 115],
    position: { x: 52, y: 34 },
    palette: ["bleu", "jaune", "orange", "beige", "blanc", "vert"],
    collections: ["maroc", "espagne", "venise"],
  },
  {
    image: "/images/interieurs/wabi-sabi-charbon.webp",
    fr: "Wabi-sabi charbon",
    en: "Charcoal wabi-sabi",
    sceneWidthCm: 530,
    sizeRangeCm: [65, 135],
    position: { x: 57, y: 34 },
    palette: ["noir", "gris", "blanc", "rouge", "orange"],
    collections: ["tango", "messagers", "clowns"],
  },
  {
    image: "/images/interieurs/moderniste-ocre.webp",
    fr: "Moderniste ocre",
    en: "Ochre modernist",
    sceneWidthCm: 620,
    sizeRangeCm: [85, 165],
    position: { x: 53, y: 33 },
    palette: ["jaune", "orange", "vert", "rouge", "beige"],
    collections: ["espagne", "scene-d-intimite", "clowns"],
  },
  {
    image: "/images/interieurs/loft-mineral-panoramique.webp",
    fr: "Loft minéral",
    en: "Mineral loft",
    sceneWidthCm: 760,
    sizeRangeCm: [125, 270],
    position: { x: 54, y: 33 },
    palette: ["vert", "bleu", "gris", "blanc", "noir", "beige"],
    collections: ["bretonnes", "venise", "amsterdam"],
  },
];

const estimatedArtworkDimensions = {
  "/collections/venise/la-belle-violoniste": [75, 75],
  "/collections/venise/escale-a-venise": [75, 75],
  "/collections/venise/attente-2": [75, 75],
  "/collections/espagne/au-cafe": [85, 65],
  "/collections/espagne/le-cafe-bleu": [85, 65],
  "/collections/maroc/les-deux-odalisques-au-siamois": [70, 85],
  "/collections/maroc/le-tri-des-fleurs": [75, 75],
  "/collections/paris/confidence-au-procope": [75, 75],
  "/collections/paris/cafe-de-flore-collection-particuliere": [65, 85],
  "/collections/paris/cafe-de-flore-2": [70, 85],
  "/collections/paris/montmartre-in-blue": [75, 75],
  "/collections/paris/nuit-parisienne": [75, 75],
  "/collections/paris/repos-a-montmartre": [75, 75],
  "/collections/paris/la-rotonde": [85, 65],
  "/collections/messagers/l-echappee": [75, 75],
  "/collections/messagers/les-trois-amazones": [75, 75],
  "/collections/messagers/la-mesange-bleue": [75, 75],
  "/collections/messagers/les-messagers": [85, 65],
  "/collections/clowns/les-inseparables-2": [80, 70],
  "/collections/clowns/l-oeuf-bleu": [75, 75],
};

function obtenirInterieursAdaptes(artwork) {
  const format = obtenirDimensions(artwork);
  const nombrePanneaux = artwork.images?.length || 1;
  const largeurOeuvre =
    format?.[1] * nombrePanneaux + (nombrePanneaux > 1 ? ecartDiptyqueCm : 0);
  const artworkTags = new Set(artworkSearchMetadata[artwork.path] || []);

  return interiors
    .map((interior, index) => {
      const paletteScore = interior.palette.reduce(
        (score, color) => score + (artworkTags.has(color) ? 3 : 0),
        0
      );
      const collectionScore = interior.collections.includes(artwork.collectionId)
        ? 4
        : 0;
      const [minimum, maximum] = interior.sizeRangeCm;
      const milieu = (minimum + maximum) / 2;
      const horsPlage =
        largeurOeuvre < minimum
          ? minimum - largeurOeuvre
          : largeurOeuvre > maximum
            ? largeurOeuvre - maximum
            : 0;
      const sizeScore =
        horsPlage === 0
          ? 8 - Math.abs(largeurOeuvre - milieu) / 30
          : Math.max(-4, 4 - horsPlage / 12);

      return { interior, index, score: paletteScore + collectionScore + sizeScore };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ interior }) => interior);
}

const ecartDiptyqueCm = 3;

const formatsFigure = {
  25: [81, 65],
  40: [100, 81],
  50: [116, 89],
};

function obtenirDimensions(artwork) {
  const dimensions = artwork?.dimensions || "";
  const formatClassique = dimensions.match(/(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)/i);

  if (formatClassique) {
    return formatClassique.slice(1, 3).map((valeur) => Number(valeur.replace(",", ".")));
  }

  const formatFigure = dimensions.match(/(\d+)\s*F/i);
  if (formatFigure) {
    return formatsFigure[Number(formatFigure[1])] || null;
  }

  return estimatedArtworkDimensions[artwork?.path] || [75, 75];
}

function obtenirEchelleMur(artwork, largeurSceneCm, nombrePanneaux = 1) {
  const format = obtenirDimensions(artwork);

  // Le catalogue de l’artiste indique les formats hauteur × largeur.
  const [hauteurCm, largeurCm] = format;
  const largeurEspacementCm =
    nombrePanneaux > 1 ? ecartDiptyqueCm * (nombrePanneaux - 1) : 0;
  const largeurTotaleCm = largeurCm * nombrePanneaux + largeurEspacementCm;

  return {
    width: `${(largeurTotaleCm / largeurSceneCm) * 100}%`,
    aspectRatio: `${largeurTotaleCm} / ${hauteurCm}`,
    gap:
      nombrePanneaux > 1
        ? `${(ecartDiptyqueCm / largeurTotaleCm) * 100}%`
        : undefined,
    isExact: Boolean(artwork.dimensions),
  };
}

export default function InteriorViewer({ artwork, language, onBack }) {
  const [interiorIndex, setInteriorIndex] = useState(0);
  const [panelMode, setPanelMode] = useState("together");
  const en = language === "en";
  const availableInteriors = obtenirInterieursAdaptes(artwork);
  const interior = availableInteriors[interiorIndex] || availableInteriors[0];
  const artworkImages = artwork.images?.length
    ? artwork.images
    : [artwork.image];
  const isDiptych = artworkImages.length === 2;
  const displayedImages = !isDiptych || panelMode === "together"
    ? artworkImages
    : [artworkImages[panelMode === "left" ? 0 : 1]];
  const displaysDiptych = displayedImages.length === 2;
  const artworkScale = obtenirEchelleMur(
    artwork,
    interior.sceneWidthCm,
    displaysDiptych ? displayedImages.length : 1
  );

  return (
    <div className="interior-viewer">
      {isDiptych && (
        <div className="diptych-view-options interior-diptych-controls" aria-label={en ? "Choose the diptych view" : "Choisir la vue du diptyque"}>
          {[
            ["together", en ? "Together" : "Ensemble"],
            ["left", en ? "Left panel" : "Partie gauche"],
            ["right", en ? "Right panel" : "Partie droite"],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className={panelMode === mode ? "active" : ""}
              onClick={() => setPanelMode(mode)}
              aria-pressed={panelMode === mode}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="interior-scene">
        <img
          className="interior-background"
          src={interior.image}
          alt=""
          aria-hidden="true"
        />
        <div
          className={`interior-artwork ${
            displaysDiptych ? "interior-artwork-diptych" : "interior-artwork-single"
          }`}
          style={{
            width: artworkScale.width,
            aspectRatio: artworkScale.aspectRatio,
            "--diptych-gap": artworkScale.gap,
            left: `${interior.position.x}%`,
            top: `${interior.position.y}%`,
          }}
          role="img"
          aria-label={`${artwork.titre} ${
            en ? "shown in an interior" : "présentée dans un intérieur"
          }`}
        >
          {displayedImages.map((image) => (
            <span className="interior-canvas-panel" key={image}>
              <img src={image} alt="" />
            </span>
          ))}
        </div>
      </div>

      <div className="interior-toolbar">
        <div>
          <strong>{artwork.titre}</strong>
          {artwork.dimensions && <span>{getArtworkDimensionsLabel(artwork.dimensions, en)}</span>}
          <span className="interior-match">
            {en ? "Room matched to this artwork" : "Décor accordé à cette œuvre"}
          </span>
        </div>

        <div className="interior-choices" aria-label={en ? "Choose an interior" : "Choisir un intérieur"}>
          {availableInteriors.map((option, index) => (
            <button
              key={option.image}
              type="button"
              className={index === interiorIndex ? "active" : ""}
              onClick={() => setInteriorIndex(index)}
              aria-pressed={index === interiorIndex}
            >
              <span className="interior-choice-preview" aria-hidden="true">
                <img src={option.image} alt="" />
              </span>
              <span>{en ? option.en : option.fr}</span>
            </button>
          ))}
        </div>

        <button type="button" className="interior-back" onClick={onBack}>
          {en ? "View artwork only" : "Voir l’œuvre seule"}
        </button>
      </div>

      <p className="interior-disclaimer">
        {artworkScale.isExact
          ? en
            ? "Artwork shown in proportion to its stated real dimensions."
            : "Œuvre présentée proportionnellement à ses dimensions réelles renseignées."
          : en
            ? "Dimensions not provided: scale estimated from the artwork's proportions and its collection."
            : "Dimensions non renseignées : échelle estimée d’après les proportions de l’œuvre et sa collection."}
      </p>
    </div>
  );
}
