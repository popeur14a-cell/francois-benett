import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import InteriorViewer from "../components/InteriorViewer";
import {
  ArrowIcon,
  CloseIcon,
  HeartIcon,
  RoomIcon,
  ShareIcon,
  ZoomIcon,
} from "../components/Icons";
import { COLLECTION_ORDER, collectionMeta, SITE_URL } from "../data/collectionMeta";
import { collectionsData } from "../data/collectionsData";
import {
  findArtwork,
  getAbsoluteUrl,
  getArtworkAlt,
  getArtworkImageList,
  getSortedArtworkEntries,
} from "../utils/artworks";
import useFavorites from "../context/useFavorites";
import useLanguage from "../context/useLanguage";
import FullscreenToggle from "../components/FullscreenToggle";

export default function ArtworkDetail() {
  const { collectionId, artworkSlug } = useParams();
  const { language } = useLanguage();
  const en = language === "en";
  const artwork = findArtwork(collectionId, artworkSlug);
  const artworks = getSortedArtworkEntries(collectionId);
  const currentIndex = artworks.findIndex((item) => item.slug === artworkSlug);
  const previous = currentIndex > 0 ? artworks[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < artworks.length - 1
    ? artworks[currentIndex + 1]
    : null;
  const collectionIds = COLLECTION_ORDER;
  const collectionIndex = collectionIds.indexOf(collectionId);
  const previousCollectionId = collectionIds[(collectionIndex - 1 + collectionIds.length) % collectionIds.length];
  const nextCollectionId = collectionIds[(collectionIndex + 1) % collectionIds.length];
  const previousCollection = collectionsData[previousCollectionId];
  const nextCollection = collectionsData[nextCollectionId];
  const related = artworks.filter((item) => item.slug !== artworkSlug).slice(0, 3);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [viewerMode, setViewerMode] = useState(null);
  const [shareStatus, setShareStatus] = useState("");
  const closeButtonRef = useRef(null);
  const lightboxRef = useRef(null);

  useEffect(() => {
    if (!viewerMode) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setViewerMode(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [viewerMode]);

  if (!artwork) {
    return (
      <main className="artwork-detail-page">
        <div className="collection-not-found">
          <h1>{en ? "Artwork not found" : "Œuvre introuvable"}</h1>
          <Link to={`/collections/${collectionId}`} className="collection-back-link">
            <ArrowIcon direction="left" /> {en ? "Back to the collection" : "Retour à la collection"}
          </Link>
        </div>
      </main>
    );
  }

  const collectionName = en
    ? collectionMeta[collectionId]?.en || artwork.collectionName
    : artwork.collectionName;
  const pageUrl = `${SITE_URL}${artwork.path}`;
  const imageUrl = getAbsoluteUrl(artwork.image);
  const title = artwork.dimensions
    ? `${artwork.titre}, ${artwork.dimensions} — François Benett`
    : `${artwork.titre} — François Benett`;
  const description = en
    ? `${artwork.titre}, original artwork by François Benett from the ${collectionName} collection${artwork.dimensions ? `, ${artwork.dimensions}` : ""}.`
    : `${artwork.titre}, œuvre originale de François Benett dans la collection ${collectionName}${artwork.dimensions ? `, format ${artwork.dimensions}` : ""}.`;
  const favorite = isFavorite(artwork.path);
  const contactParams = new URLSearchParams({
    artwork: artwork.titre,
    collection: artwork.collectionName,
    url: pageUrl,
  });
  if (artwork.dimensions) contactParams.set("dimensions", artwork.dimensions);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtwork",
        name: artwork.titre,
        image: getArtworkImageList(artwork).map(getAbsoluteUrl),
        url: pageUrl,
        creator: {
          "@type": "Person",
          name: "François Benett",
          url: SITE_URL,
        },
        artform: "Peinture",
        ...(artwork.dimensions ? { size: artwork.dimensions } : {}),
        ...(artwork.technique ? { artMedium: artwork.technique } : {}),
        isPartOf: {
          "@type": "CollectionPage",
          name: artwork.collectionName,
          url: `${SITE_URL}/collections/${collectionId}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: en ? "Home" : "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE_URL}/collections` },
          { "@type": "ListItem", position: 3, name: collectionName, item: `${SITE_URL}/collections/${collectionId}` },
          { "@type": "ListItem", position: 4, name: artwork.titre, item: pageUrl },
        ],
      },
    ],
  };

  const share = async () => {
    setShareStatus("");
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url: pageUrl });
        setShareStatus(en ? "Shared." : "Partage effectué.");
      } else {
        await navigator.clipboard.writeText(pageUrl);
        setShareStatus(en ? "Link copied." : "Lien copié.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        setShareStatus(en ? "The link could not be copied." : "Le lien n’a pas pu être copié.");
      }
    }
  };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={getArtworkAlt(artwork, en)} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content={en ? "en_GB" : "fr_FR"} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="artwork-detail-page">
        <Breadcrumbs
          label={en ? "Breadcrumb" : "Fil d’Ariane"}
          items={[
            { label: en ? "Home" : "Accueil", to: "/" },
            { label: "Collections", to: "/collections" },
            { label: collectionName, to: `/collections/${collectionId}` },
            { label: artwork.titre },
          ]}
        />

        <article className="artwork-detail-layout">
          <div className={`artwork-detail-visual ${artwork.images?.length > 1 ? "is-diptych" : ""}`}>
            <button
              type="button"
              className="artwork-favorite-button artwork-detail-favorite-button"
              onClick={() => toggleFavorite(artwork.path)}
              aria-label={favorite ? (en ? "Remove from favourites" : "Retirer des favoris") : (en ? "Add to favourites" : "Ajouter aux favoris")}
              aria-pressed={favorite}
            >
              <HeartIcon filled={favorite} />
            </button>
            {getArtworkImageList(artwork).map((image, index) => (
              <figure key={image}>
                <button type="button" onClick={() => setViewerMode("zoom")} aria-label={`${en ? "Enlarge" : "Agrandir"} ${artwork.titre}`}>
                  <img
                    src={image}
                    alt={artwork.images?.length > 1 ? `${getArtworkAlt(artwork, en)}, ${getPanelName(index, en)}` : getArtworkAlt(artwork, en)}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                  <span><ZoomIcon /> {en ? "Enlarge" : "Agrandir"}</span>
                </button>
                {artwork.images?.length > 1 && <figcaption>{getPanelName(index, en)}</figcaption>}
              </figure>
            ))}
          </div>

          <div className="artwork-detail-info">
            <span className="artwork-detail-collection">{en ? "Collection" : "Collection"} {collectionName}</span>
            <h1>{artwork.titre}</h1>
            <dl>
              {artwork.dimensions && <div><dt>{en ? "Dimensions" : "Format"}</dt><dd>{artwork.dimensions}</dd></div>}
              {artwork.technique && <div><dt>{en ? "Medium" : "Technique"}</dt><dd>{artwork.technique}</dd></div>}
              <div>
                <dt>{en ? "Availability" : "Disponibilité"}</dt>
                <dd>{artwork.collectionParticuliere ? (en ? "Private collection" : "Collection particulière") : (en ? "Available upon request" : "Disponible sur demande")}</dd>
              </div>
              {artwork.images?.length === 2 && (
                <div>
                  <dt>{en ? "Diptych" : "Diptyque"}</dt>
                  <dd>{en ? "The two panels may also be sold separately." : "Les deux panneaux peuvent également être vendus séparément."}</dd>
                </div>
              )}
            </dl>

            <div className="artwork-detail-actions">
              {!artwork.collectionParticuliere && (
                <Link to={`/contact?${contactParams.toString()}`} className="primary-artwork-action">
                  {en ? "Request information" : "Demander des informations"} <ArrowIcon direction="right" />
                </Link>
              )}
              <button type="button" onClick={() => setViewerMode("interior")}><RoomIcon /> {en ? "View in a room" : "Voir dans un intérieur"}</button>
              <button type="button" onClick={share}><ShareIcon /> {en ? "Share" : "Partager"}</button>
              {shareStatus && <span className="share-status" role="status">{shareStatus}</span>}
            </div>
          </div>
        </article>

        <nav className="artwork-sibling-nav" aria-label={en ? "Other works in this collection" : "Autres œuvres de cette collection"}>
          {previous ? (
            <Link to={previous.path}><ArrowIcon direction="left" /><span><small>{en ? "Previous work" : "Œuvre précédente"}</small>{previous.titre}</span></Link>
          ) : (
            <Link to={`/collections/${previousCollectionId}`} className="artwork-previous-collection">
              <ArrowIcon direction="left" />
              <span>
                <small>{en ? "Previous collection" : "Collection précédente"}</small>
                {en ? collectionMeta[previousCollectionId]?.en || previousCollection.nom : previousCollection.nom}
              </span>
            </Link>
          )}
          {next ? (
            <Link to={next.path}><span><small>{en ? "Next work" : "Œuvre suivante"}</small>{next.titre}</span><ArrowIcon direction="right" /></Link>
          ) : (
            <Link to={`/collections/${nextCollectionId}`} className="artwork-next-collection">
              <span>
                <small>{en ? "Next collection" : "Collection suivante"}</small>
                {en ? collectionMeta[nextCollectionId]?.en || nextCollection.nom : nextCollection.nom}
              </span>
              <ArrowIcon direction="right" />
            </Link>
          )}
        </nav>

        {related.length > 0 && (
          <section className="related-artworks">
            <h2>{en ? `More works from ${collectionName}` : `D’autres œuvres de la collection ${collectionName}`}</h2>
            <div>{related.map((item) => <Link key={item.path} to={item.path}><img src={item.thumbnail || item.image} alt={getArtworkAlt(item, en)} loading="lazy" /><span>{item.titre}</span></Link>)}</div>
          </section>
        )}

        {viewerMode && (
          <div ref={lightboxRef} className="lightbox" role="dialog" aria-modal="true" aria-label={viewerMode === "interior" ? (en ? "Artwork in a room" : "Œuvre dans un intérieur") : (en ? "Artwork zoom" : "Zoom de l’œuvre")}>
            <button ref={closeButtonRef} type="button" className="lightbox-close" onClick={() => setViewerMode(null)} aria-label={en ? "Close" : "Fermer"}><CloseIcon /></button>
            <FullscreenToggle targetRef={lightboxRef} language={language} />
            {viewerMode === "interior" ? (
              <InteriorViewer artwork={artwork} language={language} onBack={() => setViewerMode("zoom")} />
            ) : (
              <div className={`artwork-zoom-content ${artwork.images?.length > 1 ? "is-diptych" : ""}`}>
                {getArtworkImageList(artwork).map((image, index) => <img key={image} src={image} alt={artwork.images?.length > 1 ? `${getArtworkAlt(artwork, en)}, ${getPanelName(index, en)}` : getArtworkAlt(artwork, en)} />)}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function getPanelName(index, en) {
  if (en) return index === 0 ? "First part" : "Second part";
  return index === 0 ? "Première partie" : "Deuxième partie";
}
