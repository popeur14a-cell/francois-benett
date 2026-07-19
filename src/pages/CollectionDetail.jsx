import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { collectionsData } from "../data/collectionsData";
import InteriorViewer from "../components/InteriorViewer";
import useLanguage from "../context/useLanguage";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";
const DEFAULT_IMAGE = `${SITE_URL}/images/benett-cover.webp`;

function obtenirImagesOeuvre(oeuvre) {
  return oeuvre.images?.length ? oeuvre.images : [oeuvre.image];
}

function obtenirNomPanneau(index, en) {
  if (en) return index === 0 ? "First part" : "Second part";
  return index === 0 ? "Première partie" : "Deuxième partie";
}

export default function CollectionDetail() {
  const { language } = useLanguage();
  const en = language === "en";
  const [oeuvreOuverte, setOeuvreOuverte] = useState(null);
  const [modeVisionneuse, setModeVisionneuse] = useState("oeuvre");
  const { collectionId } = useParams();

  const collection = collectionsData[collectionId];
  const nomsAnglais = {
    venise: "Venice",
    espagne: "Spain",
    maroc: "Morocco",
    paris: "Paris",
    bretonnes: "Brittany",
    amsterdam: "Amsterdam",
    tango: "Tango",
    messagers: "The Messengers",
    "scene-d-intimite": "Intimate Scenes",
    clowns: "Clowns",
  };

  const oeuvres = Array.isArray(collection?.oeuvres)
    ? [...collection.oeuvres].sort((a, b) => {
        if (a.collectionParticuliere !== b.collectionParticuliere) {
          return a.collectionParticuliere ? 1 : -1;
        }

        return a.titre.localeCompare(b.titre, "fr", {
          sensitivity: "base",
          numeric: true,
        });
      })
    : [];

  const nombreOeuvres = oeuvres.length;
  const nomCollection = en
    ? nomsAnglais[collectionId] || ""
    : collection?.nom || "";

  useEffect(() => {
    if (oeuvreOuverte === null) return undefined;

    const gererClavier = (event) => {
      if (event.key === "Escape") {
        setOeuvreOuverte(null);
        setModeVisionneuse("oeuvre");
      }
      if (event.key === "ArrowRight") {
        setOeuvreOuverte((index) => (index + 1) % nombreOeuvres);
      }
      if (event.key === "ArrowLeft") {
        setOeuvreOuverte((index) =>
          (index - 1 + nombreOeuvres) % nombreOeuvres
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", gererClavier);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", gererClavier);
    };
  }, [oeuvreOuverte, nombreOeuvres]);

  const oeuvreActive =
    oeuvreOuverte === null ? null : oeuvres[oeuvreOuverte];

  const ouvrirVisionneuse = (index, mode = "oeuvre") => {
    setModeVisionneuse(mode);
    setOeuvreOuverte(index);
  };

  const fermerVisionneuse = () => {
    setOeuvreOuverte(null);
    setModeVisionneuse("oeuvre");
  };

  if (!collection) {
    return (
      <>
        <Helmet>
          <html lang={language} />
          <title>{en ? "Collection not found" : "Collection introuvable"} | Galerie François Benett</title>
          <meta
            name="description"
            content={en ? "This collection does not exist or is no longer available." : "Cette collection n’existe pas ou n’est plus disponible."}
          />
          <meta name="robots" content="noindex, follow" />
        </Helmet>

        <main className="collection-detail-page">
          <div className="collection-not-found">
            <h1>{en ? "Collection not found" : "Collection introuvable"}</h1>
            <p>{en ? "This collection does not exist or is no longer available." : "Cette collection n’existe pas ou n’est plus disponible."}</p>
            <Link to="/collections" className="collection-back-link">
              <span aria-hidden="true">←</span>
              {en ? "Back to collections" : "Retour aux collections"}
            </Link>
          </div>
        </main>
      </>
    );
  }

  const collectionUrl = `${SITE_URL}/collections/${collectionId}`;

  const premiereImage = oeuvres[0]?.image
    ? `${SITE_URL}${oeuvres[0].image}`
    : DEFAULT_IMAGE;

  const description = en
    ? `Discover the ${nomCollection} collection by French contemporary painter François Benett, featuring ${nombreOeuvres} original ${nombreOeuvres > 1 ? "works" : "work"}.`
    : `Découvrez la collection ${collection.nom} de François Benett, peintre contemporain français, composée de ${nombreOeuvres} ${nombreOeuvres > 1 ? "œuvres originales" : "œuvre originale"}.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Collection ${collection.nom} de François Benett`,
    description,
    url: collectionUrl,
    image: premiereImage,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Person",
      name: "François Benett",
      jobTitle: "Peintre contemporain",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: nombreOeuvres,
      itemListElement: oeuvres.map((oeuvre, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "VisualArtwork",
          name: oeuvre.titre,
          image: obtenirImagesOeuvre(oeuvre).map(
            (image) => `${SITE_URL}${image}`
          ),
          artform: "Peinture",
          artMedium: oeuvre.technique || "Acrylique sur toile",
          creator: {
            "@type": "Person",
            name: "François Benett",
          },
        },
      })),
    },
  };

  return (
    <>
      <Helmet>
        <html lang={language} />

        <title>
          Collection {collection.nom} | François Benett
        </title>

        <meta
          name="description"
          content={description}
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href={collectionUrl}
        />

        <meta
          property="og:title"
          content={`Collection ${collection.nom} | François Benett`}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:image"
          content={premiereImage}
        />

        <meta
          property="og:image:alt"
          content={`Œuvre de la collection ${collection.nom} de François Benett`}
        />

        <meta
          property="og:url"
          content={collectionUrl}
        />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />

        <meta
          property="og:site_name"
          content={SITE_NAME}
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={`Collection ${collection.nom} | François Benett`}
        />

        <meta
          name="twitter:description"
          content={description}
        />

        <meta
          name="twitter:image"
          content={premiereImage}
        />

        <meta
          name="twitter:image:alt"
          content={`Œuvre de la collection ${collection.nom} de François Benett`}
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="collection-detail-page">
        <header className="collection-detail-header">
          <Link
            to="/collections"
            className="collection-back-link"
          >
            <span aria-hidden="true">←</span>
            {en ? "Back to collections" : "Retour aux collections"}
          </Link>

          <h1>
            Collection {nomCollection}
          </h1>

          <p className="collection-count">
            {nombreOeuvres}{" "}
            {en ? (nombreOeuvres > 1 ? "works" : "work") : (nombreOeuvres > 1 ? "œuvres" : "œuvre")}
          </p>
        </header>

        {nombreOeuvres > 0 ? (
          <section
            className="artworks-grid"
            aria-label={`Œuvres de la collection ${collection.nom}`}
          >
            {oeuvres.map((oeuvre, index) => (
              <article
                className="artwork-card"
                key={`${collectionId}-${oeuvre.titre}-${index}`}
              >
                <button
                  type="button"
                  className="artwork-image-container artwork-open"
                  onClick={() => ouvrirVisionneuse(index)}
                  aria-label={`${en ? "Enlarge" : "Agrandir"} ${oeuvre.titre}`}
                >
                  {oeuvre.images?.length > 1 ? (
                    <span className="artwork-diptych" aria-hidden="true">
                      {oeuvre.images.map((image, imageIndex) => (
                        <img
                          key={image}
                          src={image}
                          alt=""
                          className="artwork-image"
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          decoding="async"
                          data-panel={imageIndex + 1}
                        />
                      ))}
                    </span>
                  ) : (
                    <img
                      src={oeuvre.image}
                      alt={`${oeuvre.titre}, œuvre de François Benett issue de la collection ${collection.nom}`}
                      className="artwork-image"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                    />
                  )}
                  <span className="artwork-zoom-label" aria-hidden="true">
                    {en ? "View" : "Voir"} <span>＋</span>
                  </span>
                </button>

                {oeuvre.images?.length > 1 && (
                  <div
                    className="artwork-diptych-labels"
                    aria-label={en ? "Diptych panels" : "Panneaux du diptyque"}
                  >
                    {oeuvre.images.map((image, imageIndex) => (
                      <span key={image}>
                        {obtenirNomPanneau(imageIndex, en)}
                      </span>
                    ))}
                  </div>
                )}

                <div className="artwork-information">
                  <h2>{oeuvre.titre}</h2>

                  <div className="artwork-metadata">
                    {oeuvre.dimensions && (
                      <p className="artwork-dimensions">
                        <span className="artwork-meta-label">Format</span>
                        {oeuvre.dimensions}
                      </p>
                    )}

                    {oeuvre.technique && (
                      <p className="artwork-technique">
                        <span className="artwork-meta-label">
                          {en ? "Medium" : "Technique"}
                        </span>
                        {oeuvre.technique}
                      </p>
                    )}
                  </div>

                  <p
                    className={`artwork-state ${
                      oeuvre.collectionParticuliere
                        ? "artwork-state-private"
                        : "artwork-state-available"
                    }`}
                  >
                    {oeuvre.collectionParticuliere
                      ? en ? "Private collection" : "Collection particulière"
                      : en ? "Available upon request" : "Disponible sur demande"}
                  </p>

                  <button
                    type="button"
                    className="artwork-room-button"
                    onClick={() => ouvrirVisionneuse(index, "interieur")}
                  >
                    <span aria-hidden="true">▣</span>
                    {en ? "View in a room" : "Voir dans un intérieur"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="collection-empty">
            <h2>{en ? "No works available" : "Aucune œuvre disponible"}</h2>

            <p>
              {en ? "Works from this collection will be added soon." : "Les œuvres de cette collection seront prochainement ajoutées."}
            </p>
          </section>
        )}

        {oeuvreActive && (
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={
              modeVisionneuse === "interieur"
                ? en ? "Artwork in an interior" : "Œuvre dans un intérieur"
                : en ? "Artwork viewer" : "Visionneuse d’œuvre"
            }
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                fermerVisionneuse();
              }
            }}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={fermerVisionneuse}
              aria-label={en ? "Close viewer" : "Fermer la visionneuse"}
            >
              <span aria-hidden="true">×</span>
            </button>

            {nombreOeuvres > 1 && (
              <button
                type="button"
                className="lightbox-arrow lightbox-previous"
                onClick={() =>
                  setOeuvreOuverte(
                    (oeuvreOuverte - 1 + nombreOeuvres) % nombreOeuvres
                  )
                }
                aria-label={en ? "Previous artwork" : "Œuvre précédente"}
              >
                <span aria-hidden="true">←</span>
              </button>
            )}

            {modeVisionneuse === "interieur" ? (
              <InteriorViewer
                artwork={oeuvreActive}
                language={language}
                onBack={() => setModeVisionneuse("oeuvre")}
              />
            ) : (
              <figure className="lightbox-content">
                {oeuvreActive.images?.length > 1 ? (
                  <div
                    className="lightbox-diptych"
                    role="img"
                    aria-label={oeuvreActive.titre}
                  >
                    {oeuvreActive.images.map((image, index) => (
                      <div className="lightbox-diptych-panel" key={image}>
                        <img
                          src={image}
                          alt={`${oeuvreActive.titre}, ${obtenirNomPanneau(
                            index,
                            en
                          ).toLocaleLowerCase(language)}`}
                        />
                        <span>{obtenirNomPanneau(index, en)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <img src={oeuvreActive.image} alt={oeuvreActive.titre} />
                )}
                <figcaption>
                  <div className="lightbox-caption-copy">
                    <strong>{oeuvreActive.titre}</strong>
                    <span>
                      {oeuvreOuverte + 1} / {nombreOeuvres}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="lightbox-room-button"
                    onClick={() => setModeVisionneuse("interieur")}
                  >
                    {en ? "View in a room" : "Voir dans un intérieur"}
                  </button>
                </figcaption>
              </figure>
            )}

            {nombreOeuvres > 1 && (
              <button
                type="button"
                className="lightbox-arrow lightbox-next"
                onClick={() =>
                  setOeuvreOuverte((oeuvreOuverte + 1) % nombreOeuvres)
                }
                aria-label={en ? "Next artwork" : "Œuvre suivante"}
              >
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
