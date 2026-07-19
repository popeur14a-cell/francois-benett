import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import useLanguage from "../context/useLanguage";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";
const PAGE_URL = `${SITE_URL}/contact`;
const SHARE_IMAGE = `${SITE_URL}/images/portrait.jpg`;

const DESCRIPTION =
  "Contactez François Benett pour toute demande concernant une œuvre originale, une exposition ou un projet artistique.";

export default function Contact() {
  const { language } = useLanguage();
  const en = language === "en";
  const [statutEnvoi, setStatutEnvoi] = useState("idle");

  async function envoyerMessage(event) {
    event.preventDefault();
    setStatutEnvoi("sending");
    const donnees = new FormData(event.currentTarget);
    const formulaire = event.currentTarget;

    try {
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(donnees.entries())),
      });

      if (!reponse.ok) throw new Error("Envoi impossible");

      formulaire.reset();
      setStatutEnvoi("success");
    } catch {
      setStatutEnvoi("error");
    }
  }

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
        "https://www.instagram.com/benett_gallery/",
        "https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts",
      ],
    },
  };

  return (
    <>
      <Helmet>
        <html lang={language} />

        <title>
          {en ? "Contact François Benett | Contemporary painter" : "Contacter François Benett | Peintre contemporain"}
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
          <h1>{en ? "Contact François Benett" : "Contacter François Benett"}</h1>

          <p className="contact-introduction">
            {en ? "For enquiries about an original work, an exhibition or an artistic project, you can contact François Benett directly." : "Pour toute demande concernant une œuvre originale, une exposition ou un projet artistique, vous pouvez contacter François Benett directement."}
          </p>
        </header>

        <section
          className="contact-grid"
          aria-label="Coordonnées de François Benett"
        >
          <div className="contact-item">
            <h2 className="contact-label">{en ? "Phone" : "Téléphone"}</h2>

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
              href="https://www.instagram.com/benett_gallery/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir le compte Instagram de François Benett dans un nouvel onglet"
            >
              @benett_gallery
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
              {en ? "View François Benett on Singulart" : "Voir François Benett sur Singulart"}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </section>

        <section className="contact-form-section" aria-labelledby="contact-form-title">
          <div className="contact-form-heading">
            <span>{en ? "Write to us" : "Écrivez-nous"}</span>
            <h2 id="contact-form-title">{en ? "Send a message" : "Envoyer un message"}</h2>
            <p>
              {en ? "Complete this form and your e-mail application will automatically prepare the message." : "Remplissez ce formulaire : votre application de messagerie préparera automatiquement l’e-mail à envoyer."}
            </p>
          </div>

          <form className="contact-form" onSubmit={envoyerMessage}>
            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor="contact-site-web">Site web</label>
              <input id="contact-site-web" name="siteWeb" type="text" tabIndex="-1" autoComplete="off" />
            </div>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-nom">{en ? "Name" : "Nom"}</label>
                <input id="contact-nom" name="nom" type="text" autoComplete="name" required />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">E-mail</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-sujet">{en ? "Subject" : "Sujet"}</label>
              <select id="contact-sujet" name="sujet" defaultValue="artwork">
                <option value="artwork">{en ? "Enquiry about an artwork" : "Demande concernant une œuvre"}</option>
                <option value="exhibition">{en ? "Exhibition proposal" : "Proposition d’exposition"}</option>
                <option value="project">{en ? "Artistic project" : "Projet artistique"}</option>
                <option value="other">{en ? "Other enquiry" : "Autre demande"}</option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="7" required />
            </div>

            <p className="contact-privacy-note">
              {en
                ? "The information entered is used only to reply to your request and is retained for no longer than 12 months. "
                : "Les informations saisies servent uniquement à répondre à votre demande et sont conservées au maximum 12 mois. "}
              <Link to="/confidentialite">
                {en ? "Learn more about your data and rights." : "En savoir plus sur vos données et vos droits."}
              </Link>
            </p>

            <button className="contact-submit" type="submit" disabled={statutEnvoi === "sending"}>
              {statutEnvoi === "sending"
                ? en ? "Sending…" : "Envoi…"
                : en ? "Send message" : "Envoyer le message"}
              <span aria-hidden="true">↗</span>
            </button>

            <div className="contact-form-status" aria-live="polite">
              {statutEnvoi === "success" && (
                <p className="contact-success">
                  {en ? "Your message has been sent. Thank you." : "Votre message a bien été envoyé. Merci."}
                </p>
              )}
              {statutEnvoi === "error" && (
                <p className="contact-error">
                  {en ? "The message could not be sent. Please try again or use the e-mail address above." : "Le message n’a pas pu être envoyé. Réessayez ou utilisez l’adresse e-mail indiquée plus haut."}
                </p>
              )}
            </div>
          </form>
        </section>

        <section
          className="contact-signature"
          aria-label="Types de demandes acceptées"
        >
          <p>
            {en ? "Original works · Exhibitions · Artistic projects" : "Œuvres originales · Expositions · Projets artistiques"}
          </p>
        </section>
      </main>
    </>
  );
}
