import { Link } from "react-router-dom";
import useLanguage from "../context/useLanguage";

export default function Footer() {
  const { language } = useLanguage();
  const en = language === "en";
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo-link"
            aria-label={en ? "Back to home" : "Retour à l’accueil"}
          >
            <img
              src="/images/logo-b.png"
              alt="Logo François Benett"
              className="footer-logo"
            />
          </Link>

          <div className="footer-identity">
            <Link to="/parcours" className="footer-name">
              François Benett
            </Link>

            <p className="footer-subtitle">
              {en ? "Contemporary painter" : "Peintre contemporain"}
            </p>
          </div>
        </div>

        <div className="footer-contact">
          <Link to="/contact" className="footer-contact-title">
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
          © {new Date().getFullYear()} François Benett
        </p>
      </div>
    </footer>
  );
}
