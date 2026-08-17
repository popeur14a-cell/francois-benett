import { Link } from "react-router-dom";
import useLanguage from "../context/useLanguage";
import { getLocalizedPath } from "../utils/localizedPath";

export default function Footer() {
  const { language } = useLanguage();
  const en = language === "en";
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link
            to={getLocalizedPath("/", en)}
            className="footer-logo-link"
            aria-label={en ? "Back to home" : "Retour à l’accueil"}
          >
            <img
              src="/images/branding/logo-b.png"
              alt="Logo François Benett"
              className="footer-logo"
            />
          </Link>

          <div className="footer-identity">
            <Link to={getLocalizedPath("/parcours", en)} className="footer-name">
              François Benett
            </Link>

            <p className="footer-subtitle">
              {en ? "Contemporary painter" : "Peintre contemporain"}
            </p>
          </div>
        </div>

        <div className="footer-contact">
          <Link to={getLocalizedPath("/contact", en)} className="footer-contact-title">
            {en ? "Contact:" : "Contact :"}
          </Link>

          <div className="footer-contact-links">
            <a href="tel:+33681099836">
              +33 6 81 09 98 36
            </a>

            <a href="mailto:benett.peintre@hotmail.fr">
              benett.peintre@hotmail.fr
            </a>

            <a
              href="https://www.instagram.com/benett_gallery/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts"
              target="_blank"
              rel="noreferrer"
            >
              Singulart
            </a>

            
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} <Link to={getLocalizedPath("/parcours", en)} className="artist-name-link">François Benett</Link> — {en ? "Official gallery · All rights reserved" : "Galerie officielle · Tous droits réservés"}
        </p>

        <nav className="footer-legal-links" aria-label={en ? "Legal information" : "Informations légales"}>
          <Link to={getLocalizedPath("/favoris", en)}>{en ? "Favorites" : "Favoris"}</Link>
          <Link to={getLocalizedPath("/mentions-legales", en)}>
            {en ? "Legal notice" : "Mentions légales"}
          </Link>
          <Link to={getLocalizedPath("/confidentialite", en)}>
            {en ? "Privacy" : "Confidentialité"}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
