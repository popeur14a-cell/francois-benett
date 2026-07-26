import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "../components/Helmet";
import useLanguage from "../context/useLanguage";
import { getArtworkEntries, getArtworkAlt } from "../utils/artworks";
import { ArrowIcon, CloseIcon, ZoomIcon } from "../components/Icons";
import { ArtistLinkedText } from "../components/ArtistName";
import FullscreenToggle from "../components/FullscreenToggle";
import ResponsiveImage from "../components/ResponsiveImage";

const selection = [
  ["scene-d-intimite", "Modèle 2"],
  ["venise", "La marionnettiste"],
  ["bretonnes", "Les belles histoires avec Billy"],
  ["tango", "Blue tango"],
  ["espagne", "Les deux andalouses 2"],
];

const elements = [
  ...selection
    .map(([collectionId, title]) =>
      getArtworkEntries(collectionId).find(
        (artwork) =>
          artwork.titre.localeCompare(title, "fr", { sensitivity: "base" }) === 0
      )
    )
    .filter(Boolean),
  { type: "collection" },
];

export default function Home() {
  const { language } = useLanguage();
  const en = language === "en";
  const pageUrl = en ? "https://www.benett-peintre.fr/en" : "https://www.benett-peintre.fr/";
  const [index, setIndex] = useState(1);
  const [direction, setDirection] = useState("next");
  const [openedArtwork, setOpenedArtwork] = useState(null);
  const [mobileCarousel, setMobileCarousel] = useState(() =>
    window.matchMedia("(max-width: 760px)").matches
  );
  const closeButtonRef = useRef(null);
  const lightboxRef = useRef(null);

  useEffect(() => {
    if (!openedArtwork) return undefined;

    const closeWithKeyboard = (event) => {
      if (event.key === "Escape") setOpenedArtwork(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithKeyboard);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [openedArtwork]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const updateCarouselMode = (event) => setMobileCarousel(event.matches);
    media.addEventListener("change", updateCarouselMode);
    return () => media.removeEventListener("change", updateCarouselMode);
  }, []);

  const changeSlide = (nextIndex, nextDirection) => {
    setDirection(nextDirection);
    setIndex(nextIndex);
  };

  const next = () => changeSlide((index + 1) % elements.length, "next");
  const previous = () =>
    changeSlide((index - 1 + elements.length) % elements.length, "previous");

  const visibleElements = mobileCarousel
    ? [elements[index]]
    : [
        elements[(index - 1 + elements.length) % elements.length],
        elements[index],
        elements[(index + 1) % elements.length],
      ];
  const centerPosition = mobileCarousel ? 0 : 1;
  const homeDescription = en
    ? "Discover original works by French contemporary painter François Benett, from Venice and Spain to tango and intimate scenes."
    : "Découvrez les œuvres originales de François Benett, artiste peintre contemporain : Venise, Espagne, tango et scènes d’intimité.";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.benett-peintre.fr/#webpage",
        url: "https://www.benett-peintre.fr/",
        name: en ? "François Benett — Contemporary painter" : "François Benett — Artiste peintre contemporain",
        description: homeDescription,
        isPartOf: { "@id": "https://www.benett-peintre.fr/#website" },
        about: { "@id": "https://www.benett-peintre.fr/#person" },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://www.benett-peintre.fr/images/benett-cover-1920.webp",
          width: 2400,
          height: 1813,
        },
      },
      {
        "@type": "ItemList",
        name: en ? "Featured artworks" : "Œuvres à découvrir",
        itemListElement: elements
          .filter((element) => element.type !== "collection")
          .map((artwork, position) => ({
            "@type": "ListItem",
            position: position + 1,
            name: artwork.titre,
            url: `https://www.benett-peintre.fr${artwork.path}`,
            image: `https://www.benett-peintre.fr${artwork.image}`,
          })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>
          {en
            ? "François Benett — Contemporary painter"
            : "François Benett — Artiste peintre contemporain"}
        </title>
        <meta
          name="description"
          content={homeDescription}
        />
        <meta name="author" content="François Benett" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <link rel="author" href={`https://www.benett-peintre.fr${en ? "/en" : ""}/parcours`} />
        <meta property="og:title" content="François Benett — Artiste peintre contemporain" />
        <meta
          property="og:description"
          content="Découvrez les œuvres originales et l’univers poétique et contemporain de François Benett."
        />
        <meta property="og:image" content="https://www.benett-peintre.fr/images/benett-cover-1920.webp" />
        <meta property="og:image:width" content="2400" />
        <meta property="og:image:height" content="1813" />
        <meta property="og:image:alt" content="Œuvre de François Benett, artiste peintre contemporain" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={en ? "en_GB" : "fr_FR"} />
        <meta property="og:site_name" content="Galerie François Benett" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={en ? "François Benett — Contemporary painter" : "François Benett — Artiste peintre contemporain"} />
        <meta name="twitter:description" content={homeDescription} />
        <meta name="twitter:image" content="https://www.benett-peintre.fr/images/benett-cover-1920.webp" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main>
        <section className="hero">
          <h1 className="sr-only">François Benett — Artiste peintre contemporain</h1>
          <img
            src="/images/benett-cover-1280.webp"
            srcSet="/images/benett-cover-640.webp 640w, /images/benett-cover-960.webp 960w, /images/benett-cover-1280.webp 1280w"
            sizes="100vw"
            alt={en ? "Artwork by contemporary painter François Benett" : "Œuvre de François Benett, artiste peintre contemporain"}
            fetchPriority="high"
            width="2400"
            height="1813"
          />
        </section>

        <section className="home-brief">
          <p>
            <ArtistLinkedText>
              {en
                ? "Between light, colour and emotion, François Benett creates worlds in which every painting tells a story. Original works conceived as suspended moments. Explore the collections and discover the available artworks."
                : "Entre lumière, couleur et émotion, François Benett compose des univers où chaque tableau raconte une histoire. Des œuvres originales, pensées comme des instants suspendus. Parcourez les collections et découvrez les œuvres disponibles."}
            </ArtistLinkedText>
          </p>
        </section>

        <section className="oeuvres-section">
          <h2>
            <Link to="/collections" className="featured-title-link">
              {en ? "Featured works" : "Œuvres à découvrir"}
            </Link>
          </h2>

          <div className="slider-container">
            <button
              type="button"
              className="slider-arrow"
              onClick={previous}
              aria-label={en ? "Show previous works" : "Afficher les œuvres précédentes"}
            >
              <ArrowIcon direction="left" />
            </button>

            <div
              key={`${index}-${direction}`}
              className={`oeuvres-slider slide-animation slide-${direction}`}
            >
              {visibleElements.map((element, position) =>
                element.type === "collection" ? (
                  <Link
                    key={`collection-${position}`}
                    to="/collections"
                    className="collection-card"
                    aria-label={en ? "View all François Benett collections" : "Voir toutes les collections de François Benett"}
                  >
                    <img
                      className="collection-card-logo"
                      src="/logo-b.png"
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="collection-card-topline" aria-hidden="true">
                      <span>Galerie Benett</span>
                      <span>01 — 10</span>
                    </div>
                    <div className="collection-card-copy">
                      <span>{en ? "All artistic worlds" : "Tous les univers"}</span>
                      <strong>{en ? "Explore the collections" : "Explorer les collections"}</strong>
                    </div>
                    <span className="collection-card-action" aria-hidden="true">
                      <span>{en ? "Discover" : "Découvrir"}</span>
                      <span className="collection-card-arrow"><ArrowIcon direction="upRight" /></span>
                    </span>
                  </Link>
                ) : (
                  <article className="carousel-artwork-card" key={`${element.path}-${position}`}>
                    <Link
                      to={element.path}
                      viewTransition
                      className="carousel-artwork-link"
                      aria-label={`${en ? "Open the artwork page for" : "Ouvrir la fiche de l’œuvre"} ${element.titre}`}
                    >
                      <ResponsiveImage
                        src={element.thumbnail || element.image}
                        sizes={mobileCarousel ? "82vw" : "28vw"}
                        className={`${position === centerPosition ? "active" : ""} ${
                          ["La marionnettiste", "Les belles histoires avec Billy"].includes(element.titre)
                            ? "carousel-artwork-image-enlarged"
                            : ""
                        }`}
                        alt={getArtworkAlt(element, en)}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                    <button
                      type="button"
                      className="carousel-zoom-button"
                      onClick={() => setOpenedArtwork(element)}
                      aria-label={`${en ? "Enlarge" : "Agrandir"} ${element.titre}`}
                    >
                      <ZoomIcon />
                    </button>
                  </article>
                )
              )}
            </div>

            <button
              type="button"
              className="slider-arrow"
              onClick={next}
              aria-label={en ? "Show next works" : "Afficher les œuvres suivantes"}
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </section>
      </main>

      {openedArtwork && (
        <div
          ref={lightboxRef}
          className="lightbox home-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={en ? "Featured artwork viewer" : "Visionneuse d’œuvre à découvrir"}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpenedArtwork(null);
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="lightbox-close"
            onClick={() => setOpenedArtwork(null)}
            aria-label={en ? "Close viewer" : "Fermer la visionneuse"}
          >
            <CloseIcon />
          </button>
          <FullscreenToggle targetRef={lightboxRef} language={language} />
          <figure className="lightbox-content">
            <img src={openedArtwork.image} alt={getArtworkAlt(openedArtwork, en)} />
            <figcaption className="home-lightbox-caption">
              <strong>{openedArtwork.titre}</strong>
              {openedArtwork.dimensions && <span>{openedArtwork.dimensions}</span>}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
