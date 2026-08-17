import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "../components/Helmet";
import { collectionsData } from "../data/collectionsData";
import { COLLECTION_ORDER, collectionMeta, SITE_URL } from "../data/collectionMeta";
import {
  getAbsoluteUrl,
  getArtworkAlt,
  getArtworkDimensionsLabel,
  getSortedArtworkEntries,
} from "../utils/artworks";
import InteriorViewer from "../components/InteriorViewer";
import Breadcrumbs from "../components/Breadcrumbs";
import { ArrowIcon, CloseIcon, HeartIcon, RoomIcon } from "../components/Icons";
import useLanguage from "../context/useLanguage";
import useFavorites from "../context/useFavorites";
import FullscreenToggle from "../components/FullscreenToggle";
import ResponsiveImage from "../components/ResponsiveImage";
import {
  getArtworkTransitionState,
  prepareArtworkTransition,
} from "../utils/viewTransitions";
import { getLocalizedPath } from "../utils/localizedPath";

function getPanelName(index, en) {
  if (en) return index === 0 ? "Left panel" : "Right panel";
  return index === 0 ? "Partie gauche" : "Partie droite";
}

function alignInformationWithArtwork(event) {
  const image = event.currentTarget;
  if (!image.naturalWidth || !image.naturalHeight) return;
  image
    .closest(".artwork-card")
    ?.style.setProperty(
      "--artwork-image-ratio",
      String(image.naturalWidth / image.naturalHeight)
    );
}

export default function CollectionDetail() {
  const { language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const en = language === "en";
  const { collectionId } = useParams();
  const [openedIndex, setOpenedIndex] = useState(null);
  const [viewerMode, setViewerMode] = useState("artwork");
  const [availableOnly, setAvailableOnly] = useState(false);
  const closeButtonRef = useRef(null);
  const lightboxRef = useRef(null);

  const collection = collectionsData[collectionId];
  const meta = collectionMeta[collectionId];
  const allArtworks = getSortedArtworkEntries(collectionId);
  const availableCount = allArtworks.filter((artwork) => !artwork.collectionParticuliere).length;
  const artworks = availableOnly
    ? allArtworks.filter((artwork) => !artwork.collectionParticuliere)
    : allArtworks;
  const count = artworks.length;
  const collectionName = en ? meta?.en || collection?.nom : collection?.nom;
  const activeArtwork = openedIndex === null ? null : artworks[openedIndex];
  const collectionIds = COLLECTION_ORDER;
  const collectionIndex = collectionIds.indexOf(collectionId);
  const previousCollectionId = collectionIds[(collectionIndex - 1 + collectionIds.length) % collectionIds.length];
  const nextCollectionId = collectionIds[(collectionIndex + 1) % collectionIds.length];
  const previousCollection = collectionsData[previousCollectionId];
  const nextCollection = collectionsData[nextCollectionId];
  const previousCollectionName = en
    ? collectionMeta[previousCollectionId]?.en || previousCollection.nom
    : previousCollection.nom;
  const nextCollectionName = en
    ? collectionMeta[nextCollectionId]?.en || nextCollection.nom
    : nextCollection.nom;

  useEffect(() => {
    if (openedIndex === null) return undefined;

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setOpenedIndex(null);
        setViewerMode("artwork");
      } else if (event.key === "ArrowRight" && count > 1) {
        setOpenedIndex((current) => (current + 1) % count);
      } else if (event.key === "ArrowLeft" && count > 1) {
        setOpenedIndex((current) => (current - 1 + count) % count);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyboard);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [openedIndex, count]);

  if (!collection) {
    return (
      <>
        <Helmet>
          <title>{en ? "Collection not found" : "Collection introuvable"} | Galerie François Benett</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <main className="collection-detail-page">
          <div className="collection-not-found">
            <h1>{en ? "Collection not found" : "Collection introuvable"}</h1>
            <Link to={getLocalizedPath("/collections", en)} className="collection-back-link">
              <ArrowIcon direction="left" />
              {en ? "Back to collections" : "Retour aux collections"}
            </Link>
          </div>
        </main>
      </>
    );
  }

  const collectionUrl = `${SITE_URL}${en ? "/en" : ""}/collections/${collectionId}`;
  const description = en ? meta.enText : meta.fr;
  const pageTitle = en
    ? `${collectionName} collection — François Benett`
    : `Collection ${collectionName} — François Benett`;
  const firstImage = getAbsoluteUrl(allArtworks[0]?.image || "/images/hero/benett-cover-1920.webp");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Collection ${collection.nom} — François Benett`,
        description,
        url: collectionUrl,
        image: firstImage,
        inLanguage: en ? "en" : "fr",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: allArtworks.length,
          itemListElement: allArtworks.map((artwork, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}${artwork.path}`,
            name: artwork.titre,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: en ? "Home" : "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE_URL}/collections` },
          { "@type": "ListItem", position: 3, name: collectionName, item: collectionUrl },
        ],
      },
    ],
  };

  const openViewer = (index, mode = "artwork") => {
    setViewerMode(mode);
    setOpenedIndex(index);
  };

  const closeViewer = () => {
    setOpenedIndex(null);
    setViewerMode("artwork");
  };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={collectionUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={firstImage} />
        <meta property="og:image:alt" content={`${en ? "Artwork from the" : "Œuvre de la collection"} ${collectionName}`} />
        <meta property="og:url" content={collectionUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={en ? "en_GB" : "fr_FR"} />
        <meta property="og:site_name" content="Galerie François Benett" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="collection-detail-page">
        <header className="collection-detail-header">
          <Breadcrumbs
            label={en ? "Breadcrumb" : "Fil d’Ariane"}
            items={[
              { label: en ? "Home" : "Accueil", to: getLocalizedPath("/", en) },
              { label: "Collections", to: getLocalizedPath("/collections", en) },
              { label: collectionName },
            ]}
          />
          <Link to={getLocalizedPath("/collections", en)} className="collection-back-link">
            <ArrowIcon direction="left" />
            {en ? "Back to collections" : "Retour aux collections"}
          </Link>
          <h1>Collection {collectionName}</h1>
          <p className="collection-introduction">{description}</p>
          <div className="collection-toolbar">
            <p className="collection-count">
              {count} {en ? (count > 1 ? "works" : "work") : count > 1 ? "œuvres" : "œuvre"}
            </p>
            <button
              type="button"
              className="collection-availability-filter"
              aria-pressed={availableOnly}
              onClick={() => {
                setOpenedIndex(null);
                setViewerMode("artwork");
                setAvailableOnly((current) => !current);
              }}
            >
              <span aria-hidden="true" />
              {en ? "Available works" : "Œuvres disponibles"}
              <small>{availableCount}</small>
            </button>
          </div>
        </header>

        <section className={`artworks-grid ${availableOnly ? "is-filtered" : ""}`} aria-label={`${en ? "Works in the" : "Œuvres de la collection"} ${collectionName}`}>
          {artworks.map((artwork, index) => (
            <article className="artwork-card" key={artwork.path}>
              <Link
                to={getLocalizedPath(artwork.path, en)}
                viewTransition
                state={getArtworkTransitionState(artwork.path)}
                onClick={prepareArtworkTransition}
                className="artwork-image-container artwork-open"
                aria-label={`${en ? "Open" : "Ouvrir"} ${artwork.titre}`}
              >
                {artwork.images?.length > 1 ? (
                  <span className="artwork-diptych" aria-hidden="true">
                    {artwork.images.map((image, panelIndex) => (
                      <ResponsiveImage
                        key={image}
                        src={image}
                        sizes="(max-width: 760px) 44vw, 24vw"
                        alt=""
                        className="artwork-image"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        decoding="async"
                        data-panel={panelIndex + 1}
                      />
                    ))}
                  </span>
                ) : (
                  <ResponsiveImage
                    src={artwork.thumbnail || artwork.image}
                    sizes="(max-width: 760px) 92vw, 32vw"
                    alt={getArtworkAlt(artwork, en)}
                    className="artwork-image"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    onLoad={alignInformationWithArtwork}
                  />
                )}
              </Link>

              <button
                type="button"
                className="artwork-favorite-button collection-favorite-button"
                onClick={() => toggleFavorite(artwork.path)}
                aria-label={
                  isFavorite(artwork.path)
                    ? `${en ? "Remove from favourites" : "Retirer des favoris"} : ${artwork.titre}`
                    : `${en ? "Add to favourites" : "Ajouter aux favoris"} : ${artwork.titre}`
                }
                aria-pressed={isFavorite(artwork.path)}
              >
                <HeartIcon filled={isFavorite(artwork.path)} />
              </button>

              {artwork.images?.length > 1 && (
                <div className="artwork-diptych-labels" aria-label={en ? "Diptych panels" : "Panneaux du diptyque"}>
                  {artwork.images.map((image, panelIndex) => (
                    <span key={image}>{getPanelName(panelIndex, en)}</span>
                  ))}
                </div>
              )}

              <div className="artwork-information">
                <h2><Link to={getLocalizedPath(artwork.path, en)} viewTransition>{artwork.titre}</Link></h2>
                {(artwork.dimensions || artwork.technique) && (
                  <div className="artwork-metadata">
                    {artwork.dimensions && (
                      <p className="artwork-dimensions">
                        <span className="artwork-meta-label">{en ? "Dimensions" : "Format"}</span>
                        {getArtworkDimensionsLabel(artwork.dimensions, en)}
                      </p>
                    )}
                    {artwork.technique && (
                      <p className="artwork-technique">
                        <span className="artwork-meta-label">{en ? "Medium" : "Technique"}</span>
                        {artwork.technique}
                      </p>
                    )}
                  </div>
                )}
                <p className={`artwork-state ${artwork.collectionParticuliere ? "artwork-state-private" : "artwork-state-available"}`}>
                  {artwork.collectionParticuliere
                    ? en ? "Private collection" : "Collection particulière"
                    : en ? "Available upon request" : "Disponible sur demande"}
                </p>
                <div className="artwork-card-actions">
                  <button type="button" className="artwork-room-button" onClick={() => openViewer(index, "interior")}>
                    <RoomIcon />
                    {en ? "View in a room" : "Voir dans un intérieur"}
                  </button>
                </div>
              </div>
            </article>
          ))}
          {count === 0 && (
            <p className="collection-filter-empty">
              {en ? "No work is currently available in this collection." : "Aucune œuvre n’est actuellement disponible dans cette collection."}
            </p>
          )}
        </section>

        <nav className="collection-navigation" aria-label={en ? "Browse collections" : "Parcourir les collections"}>
          <Link
            to={getLocalizedPath(`/collections/${previousCollectionId}`, en)}
            className="collection-navigation-link collection-navigation-previous"
            aria-label={`${en ? "Previous collection" : "Collection précédente"} : ${previousCollectionName}`}
          >
            <ArrowIcon direction="left" />
            <strong>{previousCollectionName}</strong>
          </Link>
          <Link
            to={getLocalizedPath(`/collections/${nextCollectionId}`, en)}
            className="collection-navigation-link collection-navigation-next"
            aria-label={`${en ? "Next collection" : "Collection suivante"} : ${nextCollectionName}`}
          >
            <strong>{nextCollectionName}</strong>
            <ArrowIcon direction="right" />
          </Link>
        </nav>

        {activeArtwork && (
          <div
            ref={lightboxRef}
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={viewerMode === "interior" ? (en ? "Artwork in an interior" : "Œuvre dans un intérieur") : (en ? "Artwork viewer" : "Visionneuse d’œuvre")}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeViewer();
            }}
          >
            <button ref={closeButtonRef} type="button" className="lightbox-close" onClick={closeViewer} aria-label={en ? "Close viewer" : "Fermer la visionneuse"}>
              <CloseIcon />
            </button>
            <FullscreenToggle targetRef={lightboxRef} language={language} />
            {count > 1 && (
              <button type="button" className="lightbox-arrow lightbox-previous" onClick={() => setOpenedIndex((openedIndex - 1 + count) % count)} aria-label={en ? "Previous artwork" : "Œuvre précédente"}>
                <ArrowIcon direction="left" />
              </button>
            )}

            <div key={`${activeArtwork.path}-${viewerMode}`} className="viewer-transition">
              {viewerMode === "interior" ? (
                <InteriorViewer artwork={activeArtwork} language={language} onBack={() => setViewerMode("artwork")} />
              ) : (
                <figure className="lightbox-content">
                  {activeArtwork.images?.length > 1 ? (
                    <div className="lightbox-diptych" role="img" aria-label={activeArtwork.titre}>
                      {activeArtwork.images.map((image, panelIndex) => (
                        <div className="lightbox-diptych-panel" key={image}>
                          <img src={image} alt={`${activeArtwork.titre}, ${getPanelName(panelIndex, en).toLocaleLowerCase(language)}`} />
                          <span>{getPanelName(panelIndex, en)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <img src={activeArtwork.image} alt={getArtworkAlt(activeArtwork, en)} />
                  )}
                  <figcaption>
                    <div className="lightbox-caption-copy">
                      <strong>{activeArtwork.titre}</strong>
                      <span>{openedIndex + 1} / {count}</span>
                    </div>
                    <button type="button" className="lightbox-room-button" onClick={() => setViewerMode("interior")}>
                      <RoomIcon /> {en ? "View in a room" : "Voir dans un intérieur"}
                    </button>
                  </figcaption>
                </figure>
              )}
            </div>

            {count > 1 && (
              <button type="button" className="lightbox-arrow lightbox-next" onClick={() => setOpenedIndex((openedIndex + 1) % count)} aria-label={en ? "Next artwork" : "Œuvre suivante"}>
                <ArrowIcon direction="right" />
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
