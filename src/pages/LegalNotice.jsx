import { Helmet } from "react-helmet-async";
import useLanguage from "../context/useLanguage";
import { ArtistLink, ArtistLinkedText } from "../components/ArtistName";

const PAGE_URL = "https://www.benett-peintre.fr/mentions-legales";

export default function LegalNotice() {
  const { language } = useLanguage();
  const en = language === "en";

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{en ? "Legal notice | Benett Gallery" : "Mentions légales | Galerie Benett"}</title>
        <meta
          name="description"
          content={en ? "Legal information for the official François Benett website." : "Informations légales du site officiel de François Benett."}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <main className="legal-page">
        <header className="legal-header">
          <span>{en ? "Information" : "Informations"}</span>
          <h1>{en ? "Legal notice" : "Mentions légales"}</h1>
          <p>{en ? "Last updated: 19 July 2026" : "Dernière mise à jour : 19 juillet 2026"}</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>{en ? "Website publisher" : "Éditeur du site"}</h2>
            <p>
              <ArtistLinkedText>{en
                ? "This website is published by François Benett, a private individual and contemporary painter."
                : "Ce site est édité par François Benett, personne physique et artiste peintre contemporain."}</ArtistLinkedText>
            </p>
            <dl className="legal-details">
              <div><dt>{en ? "Publication director" : "Directeur de la publication"}</dt><dd><ArtistLink /></dd></div>
              <div><dt>{en ? "Postal address" : "Adresse postale"}</dt><dd>8 rue Alphonse Daudet, 44130 Blain, France</dd></div>
              <div><dt>{en ? "Email" : "E-mail"}</dt><dd><a href="mailto:benett.peintre@hotmail.fr">benett.peintre@hotmail.fr</a></dd></div>
              <div><dt>{en ? "Telephone" : "Téléphone"}</dt><dd><a href="tel:+33681099836">+33 6 81 09 98 36</a></dd></div>
            </dl>
          </section>

          <section>
            <h2>{en ? "Hosting" : "Hébergement"}</h2>
            <p>{en ? "The website is hosted by:" : "Le site est hébergé par :"}</p>
            <address>
              Vercel Inc.<br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723, United States<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </address>
          </section>

          <section>
            <h2>{en ? "Intellectual property" : "Propriété intellectuelle"}</h2>
            <p>
              <ArtistLinkedText>{en
                ? "All artworks, photographs, texts, the logo and other content shown on this website are protected by intellectual property law. Unless prior written permission has been granted by François Benett, no reproduction, representation, adaptation or use, in whole or in part, is permitted."
                : "Les œuvres, photographies, textes, logo et autres contenus présentés sur ce site sont protégés par le droit de la propriété intellectuelle. Sauf autorisation écrite préalable de François Benett, aucune reproduction, représentation, adaptation ou utilisation, totale ou partielle, n’est autorisée."}</ArtistLinkedText>
            </p>
          </section>

          <section>
            <h2>{en ? "Liability and external links" : "Responsabilité et liens externes"}</h2>
            <p>
              {en
                ? "Every effort is made to provide accurate and up-to-date information. However, the publisher cannot guarantee that all information is complete or error-free. Links to third-party websites are provided for information only; their content remains under the responsibility of their respective publishers."
                : "Toutes les précautions sont prises pour fournir des informations exactes et à jour. L’éditeur ne peut toutefois garantir leur exhaustivité ni l’absence d’erreur. Les liens vers des sites tiers sont proposés à titre informatif ; leurs contenus restent sous la responsabilité de leurs éditeurs respectifs."}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
