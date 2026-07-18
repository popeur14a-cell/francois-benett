import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const elements = [
    "/images/accueil/oeuvre1.jpg",
    "/images/accueil/oeuvre2.jpg",
    "/images/accueil/oeuvre3.jpg",
    "/images/accueil/oeuvre4.jpg",
    "/images/accueil/oeuvre5.jpg",
    "collection",
  ];

  const [index, setIndex] = useState(2);
  const [animation, setAnimation] = useState(false);

  function changerSlide(nouvelIndex) {
    setAnimation(false);

    setTimeout(() => {
      setIndex(nouvelIndex);
      setAnimation(true);
    }, 100);
  }

  function suivant() {
    changerSlide((index + 1) % elements.length);
  }

  function precedent() {
    changerSlide((index - 1 + elements.length) % elements.length);
  }

  const afficher = [
    elements[(index - 1 + elements.length) % elements.length],
    elements[index],
    elements[(index + 1) % elements.length],
  ];

  return (
    <>
      <Helmet>
        <title>
          François Benett – Peintre contemporain | Benett Gallery
        </title>

        <meta
          name="description"
          content="Découvrez les œuvres originales de François Benett, peintre contemporain. Explorez ses collections, son parcours artistique et son univers."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href="https://benett-galerie.vercel.app/"
        />

        <meta
          property="og:title"
          content="François Benett – Peintre contemporain"
        />

        <meta
          property="og:description"
          content="Découvrez l’univers artistique et les œuvres originales de François Benett."
        />

        <meta
          property="og:image"
          content="https://benett-galerie.vercel.app/images/benett-cover.jpg"
        />

        <meta
          property="og:url"
          content="https://benett-galerie.vercel.app/"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="Benett Gallery"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="François Benett – Peintre contemporain"
        />

        <meta
          name="twitter:description"
          content="Découvrez l’univers artistique et les œuvres originales de François Benett."
        />

        <meta
          name="twitter:image"
          content="https://benett-galerie.vercel.app/images/benett-cover.jpg"
        />
      </Helmet>

      <main>
        <section className="hero">
          <img
            src="/images/benett-cover.jpg"
            alt="Œuvre de François Benett, peintre contemporain"
          />
        </section>

        <section className="decouvrir">
          <h1>DÉCOUVRIR</h1>

          <p>
            Entrez dans l’univers de François Benett, un peintre
            contemporain où la lumière, la poésie et l’émotion se
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
              {afficher.map((element, position) =>
                element === "collection" ? (
                  <Link
                    key={`${element}-${position}`}
                    to="/collections"
                    className="collection-card"
                    aria-label="Voir toutes les collections de François Benett"
                  >
                    <div className="plus-circle">+</div>

                    <span>Voir la collection</span>
                  </Link>
                ) : (
                  <img
                    key={`${element}-${position}`}
                    src={element}
                    className={position === 1 ? "active" : ""}
                    alt={`Œuvre de François Benett ${
                      position + 1
                    }`}
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