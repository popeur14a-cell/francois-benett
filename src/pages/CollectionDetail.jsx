import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { collectionsData } from "../data/collectionsData";
import { COLLECTION_ORDER, collectionMeta, SITE_URL } from "../data/collectionMeta";
import {
  getAbsoluteUrl,
  getArtworkAlt,
  getSortedArtworkEntries,
} from "../utils/artworks";
import InteriorViewer from "../components/InteriorViewer";
import Breadcrumbs from "../components/Breadcrumbs";
import { ArrowIcon, CloseIcon, HeartIcon, RoomIcon } from "../components/Icons";
import useLanguage from "../context/useLanguage";
import useFavorites from "../context/useFavorites";
import FullscreenToggle from "../components/FullscreenToggle";

function getPanelName(index, en) {
  if (en) return index === 0 ? "First part" : "Second part";
  return index === 0 ? "Première partie" : "Deuxième partie";
}

export default function CollectionDetail() {
  const { language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const en = language === "en";
  const { collectionId } = useParams();
  const [openedIndex, setOpenedIndex] = useState(null);
  const [viewerMode, setViewerMode] = useState("artwork");
  const closeButtonRef = useRef(null);
  const lightboxRef = useRef(null);

  const collection = collectionsData[collectionId];
  const meta = collectionMeta[collectionId];
  const artworks = getSortedArtworkEntries(collectionId);
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
            <Link to="/collections" className="collection-back-link">
              <ArrowIcon direction="left" />
              {en ? "Back to collections" : "Retour aux collections"}
            </Link>
          </div>
        </main>
      </>
    );
  }

  const collectionUrl = `${SITE_URL}/collections/${collectionId}`;
  const description = en ? meta.enText : meta.fr;
  const firstImage = getAbsoluteUrl(artworks[0]?.image || "/images/benett-cover.webp");
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
          numberOfItems: count,
          itemListElement: artworks.map((artwork, index) => ({
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
        <title>{en ? `${collectionName} collection — François Benett` : `Collection ${collectionName} — François Benett`}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={collectionUrl} />
        <meta property="og:title" content={`Collection ${collectionName} — François Benett`} />
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
              { label: en ? "Home" : "Accueil", to: "/" },
              { label: "Collections", to: "/collections" },
              { label: collectionName },
            ]}
          />
          <Link to="/collections" className="collection-back-link">
            <ArrowIcon direction="left" />
            {en ? "Back to collections" : "Retour aux collections"}
          </Link>
          <h1>Collection {collectionName}</h1>
          <p className="collection-introduction">{description}</p>
          <p className="collection-count">
            {count} {en ? (count > 1 ? "works" : "work") : count > 1 ? "œuvres" : "œuvre"}
          </p>
        </header>

        <section className="artworks-grid" aria-label={`${en ? "Works in the" : "Œuvres de la collection"} ${collectionName}`}>
          {artworks.map((artwork, index) => (
            <article className="artwork-card" key={artwork.path}>
              <Link
                to={artwork.path}
                className="artwork-image-container artwork-open"
                aria-label={`${en ? "Open" : "Ouvrir"} ${artwork.titre}`}
              >
                {artwork.images?.length > 1 ? (
                  <span className="artwork-diptych" aria-hidden="true">
                    {artwork.images.map((image, panelIndex) => (
                      <img
                        key={image}
                        src={image}
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
                  <img
                    src={artwork.thumbnail || artwork.image}
                    alt={getArtworkAlt(artwork, en)}
                    className="artwork-image"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
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
                <h2><Link to={artwork.path}>{artwork.titre}</Link></h2>
                <div className="artwork-metadata">
                  {artwork.dimensions && (
                    <p className="artwork-dimensions">
                      <span className="artwork-meta-label">{en ? "Dimensions" : "Format"}</span>
                      {artwork.dimensions}
                    </p>
                  )}
                  {artwork.technique && (
                    <p className="artwork-technique">
                      <span className="artwork-meta-label">{en ? "Medium" : "Technique"}</span>
                      {artwork.technique}
                    </p>
                  )}
                </div>
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
        </section>

        <nav className="collection-navigation" aria-label={en ? "Browse collections" : "Parcourir les collections"}>
          <Link to={`/collections/${previousCollectionId}`} className="collection-navigation-link collection-navigation-previous">
            <ArrowIcon direction="left" />
            <span>
              <small>{en ? "Previous collection" : "Collection précédente"}</small>
              <strong>{previousCollectionName}</strong>
            </span>
          </Link>
          <Link to={`/collections/${nextCollectionId}`} className="collection-navigation-link collection-navigation-next">
            <span>
              <small>{en ? "Next collection" : "Collection suivante"}</small>
              <strong>{nextCollectionName}</strong>
            </span>
            <ArrowIcon direction="right" />
          </Link>
        </nav>

        <Link to="/collections" className="collection-floating-back">
          <ArrowIcon direction="left" />
          <span>{en ? "Collections" : "Collections"}</span>
        </Link>

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
