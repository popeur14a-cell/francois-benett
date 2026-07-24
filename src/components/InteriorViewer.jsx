import { useState } from "react";

const interiors = [
  {
    image: "/images/interieurs/salon-contemporain-cocooning.webp",
    fr: "Contemporain",
    en: "Contemporary",
    sceneWidthCm: 590,
  },
  {
    image: "/images/interieurs/salon-classique-cocooning.webp",
    fr: "Haussmannien",
    en: "Parisian",
    sceneWidthCm: 620,
  },
  {
    image: "/images/interieurs/salon-japandi-cocooning.webp",
    fr: "Japandi",
    en: "Japandi",
    sceneWidthCm: 570,
  },
  {
    image: "/images/interieurs/salon-industriel-chaleureux.jpg",
    fr: "Industriel",
    en: "Industrial",
    sceneWidthCm: 430,
  },
  {
    image: "/images/interieurs/salon-occidental-contemporain.jpg",
    fr: "Contemporain doux",
    en: "Soft contemporary",
    sceneWidthCm: 380,
  },
  {
    image: "/images/interieurs/salon-vintage-elegant.jpg",
    fr: "Vintage",
    en: "Vintage",
    sceneWidthCm: 400,
  },
];

function obtenirInterieursAdaptes(artwork) {
  const format = obtenirDimensions(artwork.dimensions);
  const plusGrandCote = format ? Math.max(...format) : null;

  if (plusGrandCote && plusGrandCote <= 60) {
    return [interiors[4], interiors[3], interiors[5]];
  }

  switch (artwork.collectionId) {
    case "tango":
    case "clowns":
      return [interiors[3], interiors[5], interiors[0]];
    case "venise":
    case "paris":
      return [interiors[1], interiors[5], interiors[4]];
    case "espagne":
    case "maroc":
      return [interiors[4], interiors[2], interiors[5]];
    case "messagers":
      return [interiors[0], interiors[3], interiors[1]];
    case "bretonnes":
    case "amsterdam":
      return [interiors[2], interiors[4], interiors[5]];
    case "scene-d-intimite":
      return [interiors[4], interiors[5], interiors[0]];
    default:
      return [interiors[0], interiors[4], interiors[5]];
  }
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
      largeurVisibleCm: largeurSceneCm / 1.55,
      zoom: 1.55,
      type: "small",
    };
  }
  if (plusGrandCote <= 85) {
    return {
      largeurVisibleCm: largeurSceneCm / 1.25,
      zoom: 1.25,
      type: "medium",
    };
  }
  return { largeurVisibleCm: largeurSceneCm, zoom: 1, type: "large" };
}

function obtenirNomPanneau(index, en) {
  if (en) return index === 0 ? "First part" : "Second part";
  return index === 0 ? "Première partie" : "Deuxième partie";
}

export default function InteriorViewer({ artwork, language, onBack }) {
  const [interiorIndex, setInteriorIndex] = useState(0);
  const en = language === "en";
  const availableInteriors = obtenirInterieursAdaptes(artwork);
  const interior = availableInteriors[interiorIndex] || availableInteriors[0];
  const artworkImages = artwork.images?.length
    ? artwork.images
    : [artwork.image];
  const isDiptych = artworkImages.length === 2;
  const sceneProfile = obtenirProfilScene(
    artwork.dimensions,
    interior.sceneWidthCm,
    isDiptych ? artworkImages.length : 1
  );
  const artworkScale = obtenirEchelleMur(
    artwork.dimensions,
    sceneProfile.largeurVisibleCm,
    isDiptych ? artworkImages.length : 1
  );

  return (
    <div className="interior-viewer">
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
            isDiptych ? "interior-artwork-diptych" : "interior-artwork-single"
          }`}
          style={{
            width: artworkScale.width,
            aspectRatio: artworkScale.aspectRatio,
            "--diptych-gap": artworkScale.gap,
          }}
          role="img"
          aria-label={`${artwork.titre} ${
            en ? "shown in an interior" : "présentée dans un intérieur"
          }`}
        >
          {artworkImages.map((image) => (
            <span className="interior-canvas-panel" key={image}>
              <img src={image} alt="" />
            </span>
          ))}
        </div>
      </div>

      <div className="interior-toolbar">
        <div>
          <strong>{artwork.titre}</strong>
          {artwork.dimensions && <span>{artwork.dimensions}</span>}
          {isDiptych && (
            <div className="interior-diptych-names">
              {artworkImages.map((image, index) => (
                <span key={image}>{obtenirNomPanneau(index, en)}</span>
              ))}
            </div>
          )}
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
