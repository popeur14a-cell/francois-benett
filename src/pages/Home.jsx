import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const elements = [
  "/images/accueil/oeuvre1.jpg",
  "/images/accueil/oeuvre2.jpg",
  "/images/accueil/oeuvre3.jpg",
  "/images/accueil/oeuvre4.jpg",
  "/images/accueil/oeuvre5.jpg",
  "collection",
];

export default function Home() {
  const [index, setIndex] = useState(2);
  const [animation, setAnimation] = useState(false);

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
        <html lang="fr" />

        <title>
          François Benett | Galerie officielle – Peintre contemporain
        </title>

        <meta
          name="description"
          content="Découvrez les œuvres originales de François Benett, peintre contemporain français. Explorez ses collections inspirées de Venise, de l’Espagne, du Maroc et des scènes d’intimité."
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
          content="https://www.benett-peintre.fr/images/benett-cover.jpg"
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
          content="https://www.benett-peintre.fr/images/benett-cover.jpg"
        />

        <meta
          name="twitter:image:alt"
          content="Œuvre de François Benett, peintre contemporain"
        />
      </Helmet>

      <main>
        <section className="hero">
          <img
            src="/images/benett-cover.jpg"
            alt="Œuvre de François Benett, peintre contemporain"
            fetchPriority="high"
          />
        </section>

        <section className="decouvrir">
          <h1>Découvrir l’univers de François Benett</h1>

          <p>
            Entrez dans l’univers de François Benett, peintre
            contemporain, où la lumière, la poésie et l’émotion se
            rencontrent.
          </p>

          <p>
            Ses œuvres invitent le regard à voyager entre paysages,
            personnages et imaginaires.
          </p>
        </section>

        <section className="oeuvres-section">
          <h2>Œuvres à découvrir</h2>

          <div className="slider-container">
            <button
              type="button"
              className="slider-arrow"
              onClick={precedent}
              aria-label="Afficher les œuvres précédentes"
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
                element === "collection" ? (
                  <Link
                    key={`${element}-${position}`}
                    to="/collections"
                    className="collection-card"
                    aria-label="Voir toutes les collections de François Benett"
                  >
                    <div
                      className="plus-circle"
                      aria-hidden="true"
                    >
                      +
                    </div>

                    <span>Voir les collections</span>
                  </Link>
                ) : (
                  <img
                    key={`${element}-${position}`}
                    src={element}
                    className={
                      position === 1 ? "active" : ""
                    }
                    alt={`Œuvre de François Benett présentée dans la galerie ${
                      position + 1
                    }`}
                    loading="lazy"
                  />
                )
              )}
            </div>

            <button
              type="button"
              className="slider-arrow"
              onClick={suivant}
              aria-label="Afficher les œuvres suivantes"
            >
              →
            </button>
          </div>
        </section>
      </main>
    </>
  );
}