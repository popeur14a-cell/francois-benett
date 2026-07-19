import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";
const PAGE_URL = `${SITE_URL}/parcours`;
const PORTRAIT_URL = `${SITE_URL}/images/portrait.jpg`;

const DESCRIPTION =
  "Découvrez le parcours de François Benett, peintre contemporain français, diplômé des Beaux-Arts, ainsi que ses inspirations, ses voyages et son univers artistique.";

export default function Parcours() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Parcours de François Benett",
    description: DESCRIPTION,
    url: PAGE_URL,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "Person",
      name: "François Benett",
      jobTitle: "Peintre contemporain",
      url: SITE_URL,
      image: PORTRAIT_URL,
      description: DESCRIPTION,
      homeLocation: {
        "@type": "Place",
        name: "Région nantaise, France",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "École des Beaux-Arts",
      },
      sameAs: [
        "https://www.instagram.com/francois_benett/",
        "https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts",
      ],
    },
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />

        <title>
          Parcours de François Benett | Peintre contemporain
        </title>

        <meta
          name="description"
          content={DESCRIPTION}
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href={PAGE_URL}
        />

        <meta
          property="og:title"
          content="Parcours de François Benett | Peintre contemporain"
        />

        <meta
          property="og:description"
          content={DESCRIPTION}
        />

        <meta
          property="og:image"
          content={PORTRAIT_URL}
        />

        <meta
          property="og:image:alt"
          content="Portrait de François Benett, peintre contemporain"
        />

        <meta
          property="og:url"
          content={PAGE_URL}
        />

        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="fr_FR" />

        <meta
          property="og:site_name"
          content={SITE_NAME}
        />

        <meta
          property="profile:first_name"
          content="François"
        />

        <meta
          property="profile:last_name"
          content="Benett"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Parcours de François Benett | Peintre contemporain"
        />

        <meta
          name="twitter:description"
          content={DESCRIPTION}
        />

        <meta
          name="twitter:image"
          content={PORTRAIT_URL}
        />

        <meta
          name="twitter:image:alt"
          content="Portrait de François Benett, peintre contemporain"
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="parcours-page">
        <header className="parcours-header">
          <h1 className="parcours-title">
            Parcours de François Benett
          </h1>

          <p className="parcours-subtitle">
            Peintre contemporain vivant et travaillant dans la région
            nantaise.
          </p>
        </header>

        <section
          className="parcours-introduction"
          aria-labelledby="presentation-artiste"
        >
          <div className="parcours-text">
            <h2 id="presentation-artiste">
              Un univers entre lumière, poésie et émotion
            </h2>

            <p>
              François Benett est un peintre contemporain dont
              l’univers artistique s’inscrit dans une recherche autour
              de la lumière, de la poésie et de l’émotion. Son travail
              propose un voyage entre paysages, personnages et
              imaginaires.
            </p>

            <p>
              À travers ses œuvres, il compose des scènes dans lesquelles
              les souvenirs, les rencontres et les lieux se mêlent pour
              raconter une histoire.
            </p>
          </div>

          <figure className="parcours-portrait">
            <img
              src="/images/portrait.jpg"
              alt="Portrait de François Benett, peintre contemporain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="800"
              height="1000"
            />

            <figcaption>
              François Benett, peintre contemporain.
            </figcaption>
          </figure>
        </section>

        <section
          className="parcours-suite"
          aria-labelledby="inspirations-artiste"
        >
          <h2 id="inspirations-artiste">
            Voyages et inspirations
          </h2>

          <p>
            Inspiré par ses voyages, François Benett explore différents
            univers tels que Venise, l’Espagne, le Maroc, Paris ou
            Amsterdam. Chaque lieu devient une source d’inspiration où
            la lumière et l’atmosphère occupent une place essentielle.
          </p>

          <p>
            Sa peinture met également en scène des personnages, des
            musiciens, des danseurs et des instants de vie suspendus
            entre réalité et imaginaire.
          </p>

          <p>
            Chaque tableau invite le spectateur à entrer dans un univers
            sensible construit autour de l’émotion, de la poésie et du
            mouvement.
          </p>
        </section>

        <section
          className="parcours-formation"
          aria-labelledby="formation-parcours"
        >
          <h2 id="formation-parcours">
            Formation et expositions
          </h2>

          <p>
            Diplômé national des Beaux-Arts, François Benett a exposé
            dans de nombreuses galeries et a été invité d’honneur dans
            différents salons en France.
          </p>

          <p>
            Parmi ses thèmes de prédilection figurent l’Espagne, le
            Maroc, Venise, Les Messagers et les scènes d’intimité.
          </p>
        </section>
      </main>
    </>
  );
}