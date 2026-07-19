import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useLanguage from "../context/useLanguage";

const elements = [
  "/images/accueil/oeuvre1.jpg",
  "/images/accueil/oeuvre2.jpg",
  "/images/accueil/oeuvre3.jpg",
  "/images/accueil/oeuvre4.webp",
  "/images/accueil/oeuvre5.webp",
  "collection",
];

export default function Home() {
  const { language } = useLanguage();
  const en = language === "en";
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
                element === "collection" ? (
                  <Link
                    key={`${element}-${position}`}
                    to="/collections"
                    className="collection-card"
                    aria-label={en ? "View all François Benett collections" : "Voir toutes les collections de François Benett"}
                  >
                    <div
                      className="plus-circle"
                      aria-hidden="true"
                    >
                      +
                    </div>

                    <span>{en ? "View collections" : "Voir les collections"}</span>
                  </Link>
                ) : (
                  <img
                    key={`${element}-${position}`}
                    src={element}
                    className={
                      position === 1 ? "active" : ""
                    }
                    alt={`${en ? "François Benett artwork shown in the gallery" : "Œuvre de François Benett présentée dans la galerie"} ${
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
              aria-label={en ? "Show next works" : "Afficher les œuvres suivantes"}
            >
              →
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
