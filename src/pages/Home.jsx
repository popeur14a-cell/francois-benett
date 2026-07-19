import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useLanguage from "../context/useLanguage";

const elements = [
  { image: "/images/accueil/oeuvre1.jpg", titre: "L’œuf bleu", collectionId: "venise", collection: "Venise" },
  { image: "/images/accueil/oeuvre2.jpg", titre: "Les parieurs", collectionId: "paris", collection: "Paris" },
  { image: "/images/accueil/oeuvre3.jpg", titre: "La marionnettiste", collectionId: "venise", collection: "Venise" },
  { image: "/images/accueil/oeuvre4.webp", titre: "Palais des Doges", collectionId: "venise", collection: "Venise" },
  { image: "/images/accueil/oeuvre5.webp", titre: "Tango in the night", collectionId: "tango", collection: "Tango" },
  { type: "collection" },
];

export default function Home() {
  const { language } = useLanguage();
  const en = language === "en";
  const [index, setIndex] = useState(2);
  const [animation, setAnimation] = useState(false);
  const [oeuvreCarouselOuverte, setOeuvreCarouselOuverte] = useState(null);

  useEffect(() => {
    if (!oeuvreCarouselOuverte) return undefined;

    const fermerAvecClavier = (event) => {
      if (event.key === "Escape") setOeuvreCarouselOuverte(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fermerAvecClavier);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fermerAvecClavier);
    };
  }, [oeuvreCarouselOuverte]);

  function changerSlide(nouvelIndex) {
    setAnimation(false);

    window.setTimeout(() => {
      setIndex(nouvelIndex);
      setAnimation(true);
    }, 100);
  }

  function suivant() {
    changerSlide((index + 1) % elements.length);
  }

  function precedent() {
    changerSlide(
      (index - 1 + elements.length) % elements.length
    );
  }

  const elementsAffiches = [
    elements[
      (index - 1 + elements.length) % elements.length
    ],
    elements[index],
    elements[(index + 1) % elements.length],
  ];

  return (
    <>
      <Helmet>
        <html lang={language} />

        <title>
          {en ? "François Benett | Official gallery – Contemporary painter" : "François Benett | Galerie officielle – Peintre contemporain"}
        </title>

        <meta
          name="description"
          content={en ? "Discover original works by French contemporary painter François Benett and explore his artistic collections." : "Découvrez les œuvres originales de François Benett, peintre contemporain français. Explorez ses collections inspirées de Venise, de l’Espagne, du Maroc et des scènes d’intimité."}
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://www.benett-peintre.fr/"
        />

        <meta
          property="og:title"
          content="François Benett | Galerie officielle – Peintre contemporain"
        />

        <meta
          property="og:description"
          content="Découvrez les œuvres originales et l’univers artistique de François Benett, peintre contemporain français."
        />

        <meta
          property="og:image"
          content="https://www.benett-peintre.fr/images/benett-cover.webp"
        />

        <meta
          property="og:image:alt"
          content="Œuvre de François Benett, peintre contemporain"
        />

        <meta
          property="og:url"
          content="https://www.benett-peintre.fr/"
        />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />

        <meta
          property="og:site_name"
          content="Galerie François Benett"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="François Benett | Galerie officielle – Peintre contemporain"
        />

        <meta
          name="twitter:description"
          content="Découvrez les œuvres originales et l’univers artistique de François Benett."
        />

        <meta
          name="twitter:image"
          content="https://www.benett-peintre.fr/images/benett-cover.webp"
        />

        <meta
          name="twitter:image:alt"
          content="Œuvre de François Benett, peintre contemporain"
        />
      </Helmet>

      <main>
        <section className="hero">
          <img
            src="/images/benett-cover.webp"
            alt={en ? "Artwork by contemporary painter François Benett" : "Œuvre de François Benett, peintre contemporain"}
            fetchPriority="high"
          />
        </section>

        <section className="decouvrir">
          <h1>{en ? "Discover the world of François Benett" : "Découvrir l’univers de François Benett"}</h1>

          <p>
            {en ? "Enter the world of contemporary painter François Benett, where light, poetry and emotion come together." : "Entrez dans l’univers de François Benett, peintre contemporain, où la lumière, la poésie et l’émotion se rencontrent."}
          </p>

          <p>
            {en ? "His works invite the viewer to travel through landscapes, figures and imagination." : "Ses œuvres invitent le regard à voyager entre paysages, personnages et imaginaires."}
          </p>
        </section>

        <section className="oeuvres-section">
          <h2>{en ? "Featured works" : "Œuvres à découvrir"}</h2>

          <div className="slider-container">
            <button
              type="button"
              className="slider-arrow"
              onClick={precedent}
              aria-label={en ? "Show previous works" : "Afficher les œuvres précédentes"}
            >
              ←
            </button>

            <div
              className={
                animation
                  ? "oeuvres-slider slide-animation"
                  : "oeuvres-slider"
              }
            >
              {elementsAffiches.map((element, position) =>
                element.type === "collection" ? (
                  <Link
                    key={`collection-${position}`}
                    to="/collections"
                    className="collection-card"
                    aria-label={en ? "View all François Benett collections" : "Voir toutes les collections de François Benett"}
                  >
                    <div className="collection-card-topline" aria-hidden="true">
                      <span>Galerie Benett</span>
                      <span>01 — 10</span>
                    </div>

                    <div className="collection-card-copy">
                      <span>{en ? "All artistic worlds" : "Tous les univers"}</span>
                      <strong>
                        {en ? "Explore the collections" : "Explorer les collections"}
                      </strong>
                    </div>

                    <span className="collection-card-action" aria-hidden="true">
                      <span>{en ? "Discover" : "Découvrir"}</span>
                      <span className="collection-card-arrow">↗</span>
                    </span>
                  </Link>
                ) : (
                  <button
                    key={`${element.image}-${position}`}
                    type="button"
                    className="carousel-artwork-button"
                    onClick={() => setOeuvreCarouselOuverte(element)}
                    aria-label={`${en ? "Enlarge" : "Agrandir"} ${element.titre}`}
                  >
                    <img
                      src={element.image}
                      className={position === 1 ? "active" : ""}
                      alt={`${element.titre}, ${en ? "artwork by François Benett" : "œuvre de François Benett"}`}
                      loading="lazy"
                    />
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="slider-arrow"
              onClick={suivant}
              aria-label={en ? "Show next works" : "Afficher les œuvres suivantes"}
            >
              →
            </button>
          </div>
        </section>
      </main>

      {oeuvreCarouselOuverte && (
        <div
          className="lightbox home-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={en ? "Featured artwork viewer" : "Visionneuse d’œuvre à découvrir"}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOeuvreCarouselOuverte(null);
          }}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setOeuvreCarouselOuverte(null)}
            aria-label={en ? "Close viewer" : "Fermer la visionneuse"}
          >
            <span aria-hidden="true">×</span>
          </button>

          <figure className="lightbox-content">
            <img src={oeuvreCarouselOuverte.image} alt={oeuvreCarouselOuverte.titre} />
            <figcaption className="home-lightbox-caption">
              <strong>{oeuvreCarouselOuverte.titre}</strong>
              <Link
                to={`/collections/${oeuvreCarouselOuverte.collectionId}`}
                className="home-lightbox-link"
                onClick={() => setOeuvreCarouselOuverte(null)}
              >
                {en ? `View the ${oeuvreCarouselOuverte.collection} collection` : `Voir la collection ${oeuvreCarouselOuverte.collection}`}
                <span aria-hidden="true">→</span>
              </Link>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
