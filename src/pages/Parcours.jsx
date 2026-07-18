import { Helmet } from "react-helmet-async";

const SITE_URL = "https://benett-galerie.vercel.app";

export default function Parcours() {
  const pageUrl = `${SITE_URL}/parcours`;

  const description =
    "Découvrez le parcours de François Benett, peintre contemporain. Son univers artistique, ses inspirations, ses voyages et son approche de la peinture.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: pageUrl,
    mainEntity: {
      "@type": "Person",
      name: "François Benett",
      jobTitle: "Peintre contemporain",
      url: SITE_URL,
      image: `${SITE_URL}/images/portrait.jpg`,
      description,
    },
  };

  return (
    <>
      <Helmet>
        <title>Parcours de François Benett | Benett Gallery</title>

        <meta
          name="description"
          content={description}
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href={pageUrl}
        />

        <meta
          property="og:title"
          content="Parcours de François Benett"
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:image"
          content={`${SITE_URL}/images/portrait.jpg`}
        />

        <meta
          property="og:image:alt"
          content="Portrait de François Benett"
        />

        <meta
          property="og:url"
          content={pageUrl}
        />

        <meta
          property="og:type"
          content="profile"
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
          content="Parcours de François Benett"
        />

        <meta
          name="twitter:description"
          content={description}
        />

        <meta
          name="twitter:image"
          content={`${SITE_URL}/images/portrait.jpg`}
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="parcours-page">
        <h1 className="parcours-title">
          Parcours
        </h1>

        <section className="parcours-introduction">
          <div className="parcours-text">
            <p>
              François Benett est un peintre contemporain dont
              l’univers artistique s’inscrit dans une recherche
              autour de la lumière, de la poésie et de l’émotion.
              Son travail propose un voyage entre paysages,
              personnages et imaginaires.
            </p>

            <p>
              À travers ses œuvres, il crée des scènes où
              les souvenirs, les rencontres et les lieux
              se mélangent pour raconter une histoire.
            </p>
          </div>

          <div className="parcours-portrait">
            <img
              src="/images/portrait.jpg"
              alt="Portrait de François Benett, peintre contemporain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </section>

        <section className="parcours-suite">
          <p>
            Inspiré par ses voyages, François Benett explore
            différents univers comme Venise, Paris, l’Espagne
            ou le Maroc. Chaque lieu devient une source
            d’inspiration où la lumière et l’atmosphère
            occupent une place essentielle.
          </p>

          <p>
            Sa peinture met en scène des personnages,
            des musiciens, des danseurs et des instants
            de vie suspendus entre réalité et imaginaire.
          </p>

          <p>
            Chaque tableau invite le spectateur à entrer
            dans un univers sensible, construit autour
            de l’émotion et de la poésie.
          </p>
        </section>
      </main>
    </>
  );
}