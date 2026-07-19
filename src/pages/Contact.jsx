import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";
const PAGE_URL = `${SITE_URL}/contact`;
const SHARE_IMAGE = `${SITE_URL}/images/portrait.jpg`;

const DESCRIPTION =
  "Contactez François Benett pour toute demande concernant une œuvre originale, une exposition ou un projet artistique.";

export default function Contact() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact de François Benett",
    description: DESCRIPTION,
    url: PAGE_URL,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Person",
      name: "François Benett",
      jobTitle: "Peintre contemporain",
      telephone: "+33681099836",
      email: "mailto:benett.peintre@hotmail.fr",
      url: SITE_URL,
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
          Contacter François Benett | Peintre contemporain
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
          content="Contacter François Benett | Peintre contemporain"
        />

        <meta
          property="og:description"
          content={DESCRIPTION}
        />

        <meta
          property="og:image"
          content={SHARE_IMAGE}
        />

        <meta
          property="og:image:alt"
          content="Portrait de François Benett, peintre contemporain"
        />

        <meta
          property="og:url"
          content={PAGE_URL}
        />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />

        <meta
          property="og:site_name"
          content={SITE_NAME}
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Contacter François Benett | Peintre contemporain"
        />

        <meta
          name="twitter:description"
          content={DESCRIPTION}
        />

        <meta
          name="twitter:image"
          content={SHARE_IMAGE}
        />

        <meta
          name="twitter:image:alt"
          content="Portrait de François Benett, peintre contemporain"
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="contact-page">
        <header className="contact-header">
          <h1>Contacter François Benett</h1>

          <p className="contact-introduction">
            Pour toute demande concernant une œuvre originale, une
            exposition ou un projet artistique, vous pouvez contacter
            François Benett directement.
          </p>
        </header>

        <section
          className="contact-grid"
          aria-label="Coordonnées de François Benett"
        >
          <div className="contact-item">
            <h2 className="contact-label">Téléphone</h2>

            <a
              className="contact-link"
              href="tel:+33681099836"
              aria-label="Appeler François Benett au 06 81 09 98 36"
            >
              +33 6 81 09 98 36
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>

          <div className="contact-item">
            <h2 className="contact-label">E-mail</h2>

            <a
              className="contact-link"
              href="mailto:benett.peintre@hotmail.fr"
            >
              benett.peintre@hotmail.fr
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>

          <div className="contact-item">
            <h2 className="contact-label">Instagram</h2>

            <a
              className="contact-link"
              href="https://www.instagram.com/francois_benett/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir le compte Instagram de François Benett dans un nouvel onglet"
            >
              @francois_benett
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>

          <div className="contact-item">
            <h2 className="contact-label">Singulart</h2>

            <a
              className="contact-link"
              href="https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consulter la page Singulart de François Benett dans un nouvel onglet"
            >
              Voir François Benett sur Singulart
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </section>

        <section
          className="contact-signature"
          aria-label="Types de demandes acceptées"
        >
          <p>
            Œuvres originales · Expositions · Projets artistiques
          </p>
        </section>
      </main>
    </>
  );
}