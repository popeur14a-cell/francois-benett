import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { collectionsData } from "../data/collectionsData";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";
const DEFAULT_IMAGE = `${SITE_URL}/images/benett-cover.jpg`;

export default function CollectionDetail() {
  const { collectionId } = useParams();

  const collection = collectionsData[collectionId];

  if (!collection) {
    return (
      <>
        <Helmet>
          <html lang="fr" />

          <title>Collection introuvable | Galerie François Benett</title>

          <meta
            name="description"
            content="Cette collection n’existe pas ou n’est plus disponible."
          />

          <meta name="robots" content="noindex, follow" />
        </Helmet>

        <main className="collection-detail-page">
          <div className="collection-not-found">
            <h1>Collection introuvable</h1>

            <p>
              Cette collection n’existe pas ou n’est plus disponible.
            </p>

            <Link
              to="/collections"
              className="collection-back-link"
            >
              <span aria-hidden="true">←</span>
              Retour aux collections
            </Link>
          </div>
        </main>
      </>
    );
  }

  const oeuvres = Array.isArray(collection.oeuvres)
    ? collection.oeuvres
    : [];

  const nombreOeuvres = oeuvres.length;

  const collectionUrl = `${SITE_URL}/collections/${collectionId}`;

  const premiereImage = oeuvres[0]?.image
    ? `${SITE_URL}${oeuvres[0].image}`
    : DEFAULT_IMAGE;

  const description = `Découvrez la collection ${collection.nom} de François Benett, peintre contemporain français, composée de ${nombreOeuvres} ${
    nombreOeuvres > 1 ? "œuvres originales" : "œuvre originale"
  }.`;

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
          image: `${SITE_URL}${oeuvre.image}`,
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
        <html lang="fr" />

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
            Retour aux collections
          </Link>

          <h1>
            Collection {collection.nom}
          </h1>

          <p className="collection-count">
            {nombreOeuvres}{" "}
            {nombreOeuvres > 1 ? "œuvres" : "œuvre"}
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
                <div className="artwork-image-container">
                  <img
                    src={oeuvre.image}
                    alt={`${oeuvre.titre}, œuvre de François Benett issue de la collection ${collection.nom}`}
                    className="artwork-image"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                </div>

                <div className="artwork-information">
                  <h2>{oeuvre.titre}</h2>

                  {oeuvre.collectionParticuliere && (
                    <p className="artwork-status">
                      Collection particulière
                    </p>
                  )}

                  {oeuvre.dimensions && (
                    <p className="artwork-dimensions">
                      <span className="sr-only">Dimensions : </span>
                      {oeuvre.dimensions}
                    </p>
                  )}

                  {oeuvre.technique && (
                    <p className="artwork-technique">
                      {oeuvre.technique}
                    </p>
                  )}

                  {!oeuvre.collectionParticuliere && (
                    <p className="artwork-availability">
                      Disponible sur demande
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="collection-empty">
            <h2>Aucune œuvre disponible</h2>

            <p>
              Les œuvres de cette collection seront prochainement
              ajoutées.
            </p>
          </section>
        )}
      </main>
    </>
  );
}