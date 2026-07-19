import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useLanguage from "../context/useLanguage";

export default function Navbar() {
  const location = useLocation();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { language, setLanguage } = useLanguage();
  const en = language === "en";

  const obtenirTitrePage = () => {
    if (location.pathname === "/") {
      return en ? "HOME" : "ACCUEIL";
    }

    if (location.pathname.startsWith("/collections")) {
      return "COLLECTIONS";
    }

    if (location.pathname.startsWith("/parcours")) {
      return en ? "ABOUT" : "PARCOURS";
    }

    if (location.pathname.startsWith("/contact")) {
      return "CONTACT";
    }

    return "";
  };

  const obtenirLienPage = () => {
    if (location.pathname.startsWith("/collections")) return "/collections";
    if (location.pathname.startsWith("/parcours")) return "/parcours";
    if (location.pathname.startsWith("/contact")) return "/contact";
    return "/";
  };

  const fermerMenu = () => {
    setMenuOuvert(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOuvert ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOuvert]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <div className="navbar-brand">
          <Link
            to="/"
            className="navbar-logo-link"
            aria-label={en ? "Back to home" : "Retour à l’accueil"}
            onClick={fermerMenu}
          >
            <img
              src="/images/logo-b.png"
              alt="Logo François Benett"
              className="navbar-logo"
            />
          </Link>

          <div className="navbar-identity">
            <Link
              to="/parcours"
              className="navbar-name"
              onClick={fermerMenu}
            >
              François Benett
            </Link>

            <span className="navbar-subtitle">
              {en ? "Contemporary painter" : "Peintre contemporain"}
            </span>
          </div>
        </div>
        </div>

        <Link
          to={obtenirLienPage()}
          className="navbar-page-title"
          key={location.pathname}
          onClick={fermerMenu}
        >
          {obtenirTitrePage()}
        </Link>

        <div className="navbar-actions">
          <div className="language-switch" aria-label={en ? "Choose language" : "Choisir la langue"}>
            <button type="button" className={!en ? "active" : ""} onClick={() => setLanguage("fr")} aria-pressed={!en}>FR</button>
            <span aria-hidden="true">/</span>
            <button type="button" className={en ? "active" : ""} onClick={() => setLanguage("en")} aria-pressed={en}>EN</button>
          </div>

          <button
            type="button"
            className={`menu-toggle ${menuOuvert ? "menu-toggle-open" : ""}`}
            onClick={() => setMenuOuvert((ancienEtat) => !ancienEtat)}
            aria-label={menuOuvert ? (en ? "Close menu" : "Fermer le menu") : (en ? "Open menu" : "Ouvrir le menu")}
            aria-expanded={menuOuvert}
          >
            <span className="menu-toggle-label">MENU</span>
            <span className="menu-toggle-lines" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`menu-backdrop ${
          menuOuvert ? "menu-backdrop-visible" : ""
        }`}
        onClick={fermerMenu}
        aria-label={en ? "Close menu" : "Fermer le menu"}
      />

      <aside
        className={`menu-panel ${
          menuOuvert ? "menu-panel-open" : ""
        }`}
      >
        <div className="menu-panel-header">
          <span>{en ? "Navigation" : "Navigation"}</span>

          <button
            type="button"
            className="menu-close"
            onClick={fermerMenu}
            aria-label={en ? "Close menu" : "Fermer le menu"}
          >
            ×
          </button>
        </div>

        <nav className="menu-panel-links">
          <Link to="/" onClick={fermerMenu}>
            <span className="menu-number">01</span>
            <span>{en ? "Home" : "Accueil"}</span>
          </Link>

          <Link to="/collections" onClick={fermerMenu}>
            <span className="menu-number">02</span>
            <span>Collections</span>
          </Link>

          <Link to="/parcours" onClick={fermerMenu}>
            <span className="menu-number">03</span>
            <span>{en ? "About" : "Parcours"}</span>
          </Link>

          <Link to="/contact" onClick={fermerMenu}>
            <span className="menu-number">04</span>
            <span>Contact</span>
          </Link>
        </nav>

        <div className="menu-panel-footer">
          <span>François Benett</span>
          <span>{en ? "Contemporary painting" : "Peinture contemporaine"}</span>
        </div>
      </aside>
    </>
  );
}
