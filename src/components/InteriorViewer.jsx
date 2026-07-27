import { useState } from "react";
import { artworkSearchMetadata } from "../data/artworkSearchMetadata";
import { getArtworkDimensionsLabel } from "../utils/artworks";

const interiors = [
  {
    image: "/images/interieurs/salon-contemporain-cocooning.webp",
    fr: "Contemporain",
    en: "Contemporary",
    sceneWidthCm: 590,
    position: { x: 52, y: 40 },
    palette: ["rouge", "orange", "jaune", "beige", "blanc", "gris"],
    collections: ["scene-d-intimite", "messagers", "maroc"],
  },
  {
    image: "/images/interieurs/salon-classique-cocooning.webp",
    fr: "Haussmannien",
    en: "Parisian",
    sceneWidthCm: 620,
    position: { x: 50, y: 42 },
    palette: ["rouge", "orange", "jaune", "rose", "beige", "noir"],
    collections: ["paris", "venise", "clowns"],
  },
  {
    image: "/images/interieurs/salon-japandi-cocooning.webp",
    fr: "Japandi",
    en: "Japandi",
    sceneWidthCm: 570,
    position: { x: 48, y: 43 },
    palette: ["bleu", "vert", "gris", "blanc", "noir", "beige"],
    collections: ["amsterdam", "bretonnes", "espagne"],
  },
  {
    image: "/images/interieurs/salon-industriel-chaleureux.jpg",
    fr: "Industriel",
    en: "Industrial",
    sceneWidthCm: 430,
    position: { x: 57, y: 37 },
    palette: ["rouge", "orange", "noir", "gris", "blanc", "bleu"],
    collections: ["tango", "clowns", "messagers"],
  },
  {
    image: "/images/interieurs/salon-occidental-contemporain.jpg",
    fr: "Contemporain doux",
    en: "Soft contemporary",
    sceneWidthCm: 380,
    position: { x: 56, y: 40 },
    palette: ["vert", "bleu", "gris", "blanc", "rose", "beige"],
    collections: ["espagne", "maroc", "scene-d-intimite"],
  },
  {
    image: "/images/interieurs/salon-vintage-elegant.jpg",
    fr: "Vintage",
    en: "Vintage",
    sceneWidthCm: 400,
    position: { x: 55, y: 41 },
    palette: ["rouge", "orange", "jaune", "rose", "vert", "bleu"],
    collections: ["tango", "paris", "venise"],
  },
];

function obtenirInterieursAdaptes(artwork) {
  const format = obtenirDimensions(artwork.dimensions);
  const plusGrandCote = format ? Math.max(...format) : null;
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
      const sizeScore =
        plusGrandCote && plusGrandCote <= 60
          ? interior.sceneWidthCm <= 430
            ? 3
            : 0
          : plusGrandCote && plusGrandCote >= 100
            ? interior.sceneWidthCm >= 570
              ? 3
              : 0
            : 1;

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

function obtenirDimensions(dimensions = "") {
  const formatClassique = dimensions.match(/(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)/i);

  if (formatClassique) {
    return formatClassique.slice(1, 3).map((valeur) => Number(valeur.replace(",", ".")));
  }

  const formatFigure = dimensions.match(/(\d+)\s*F/i);
  return formatFigure ? formatsFigure[Number(formatFigure[1])] || null : null;
}

function obtenirEchelleMur(dimensions, largeurSceneCm, nombrePanneaux = 1) {
  const format = obtenirDimensions(dimensions);
  if (!format) {
    return {
      width: "14%",
      aspectRatio: undefined,
      gap: undefined,
      isExact: false,
    };
  }

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
    isExact: true,
  };
}

function obtenirProfilScene(dimensions, largeurSceneCm, nombrePanneaux = 1) {
  const format = obtenirDimensions(dimensions);
  if (!format || nombrePanneaux > 1) {
    return { largeurVisibleCm: largeurSceneCm, zoom: 1, type: "large" };
  }

  const plusGrandCote = Math.max(...format);
  if (plusGrandCote <= 60) {
    return {
      largeurVisibleCm: largeurSceneCm / 1.08,
      zoom: 1.08,
      type: "small",
    };
  }
  if (plusGrandCote <= 85) {
    return {
      largeurVisibleCm: largeurSceneCm / 1.04,
      zoom: 1.04,
      type: "medium",
    };
  }
  return { largeurVisibleCm: largeurSceneCm, zoom: 1, type: "large" };
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
  const sceneProfile = obtenirProfilScene(
    artwork.dimensions,
    interior.sceneWidthCm,
    displaysDiptych ? displayedImages.length : 1
  );
  const artworkScale = obtenirEchelleMur(
    artwork.dimensions,
    sceneProfile.largeurVisibleCm,
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

      <div className={`interior-scene interior-scene-${sceneProfile.type}`}>
        <img
          className="interior-background"
          src={interior.image}
          alt=""
          aria-hidden="true"
          style={{ transform: `scale(${sceneProfile.zoom})` }}
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
            ? "Dimensions not provided: the displayed size is indicative."
            : "Dimensions non renseignées : la taille affichée reste indicative."}
      </p>
    </div>
  );
}
