import { Helmet } from "react-helmet-async";

const SITE_URL = "https://benett-peintre.fr";

export default function Contact() {
  const pageUrl = `${SITE_URL}/contact`;

  const description =
    "Contactez François Benett pour toute demande concernant une œuvre originale, une exposition ou un projet artistique.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: pageUrl,
    name: "Contact - François Benett",
    description,
    about: {
      "@type": "Person",
      name: "François Benett",
      jobTitle: "Peintre contemporain",
      telephone: "+33 6 81 09 98 36",
      email: "benett.peintre@hotmail.fr",
      url: SITE_URL,
      sameAs: [
        "https://www.instagram.com/francois_benett/",
        "https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts"
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | François Benett – Benett Gallery</title>

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
          content="Contact - François Benett"
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
          content="Contact - François Benett"
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

      <main className="contact-page">
        <header className="contact-header">
          <h1>Contact</h1>

          <p className="contact-introduction">
            Pour toute demande concernant une œuvre, une exposition
            ou un projet artistique, vous pouvez me contacter directement.
          </p>
        </header>

        <section className="contact-grid">
          <div className="contact-item">
            <p className="contact-label">Téléphone</p>

            <a
              className="contact-link"
              href="tel:+33681099836"
            >
              +33 6 81 09 98 36
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="contact-item">
            <p className="contact-label">E-mail</p>

            <a
              className="contact-link"
              href="mailto:benett.peintre@hotmail.fr"
            >
              benett.peintre@hotmail.fr
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="contact-item">
            <p className="contact-label">Instagram</p>

            <a
              className="contact-link"
              href="https://www.instagram.com/francois_benett/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @francois_benett
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="contact-item">
            <p className="contact-label">Singulart</p>

            <a
              className="contact-link"
              href="https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contactez via Singulart
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="contact-signature">
          <p>Œuvres originales · Expositions · Projets artistiques</p>
        </section>
      </main>
    </>
  );
}