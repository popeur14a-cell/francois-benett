import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [menuOuvert, setMenuOuvert] = useState(false);

  const obtenirTitrePage = () => {
    if (location.pathname === "/") {
      return "ACCUEIL";
    }

    if (location.pathname.startsWith("/collections")) {
      return "COLLECTIONS";
    }

    if (location.pathname.startsWith("/parcours")) {
      return "PARCOURS";
    }

    if (location.pathname.startsWith("/contact")) {
      return "CONTACT";
    }

    return "";
  };

  const fermerMenu = () => {
    setMenuOuvert(false);
  };

  useEffect(() => {
    fermerMenu();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOuvert ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOuvert]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">
          <Link
            to="/"
            className="navbar-logo-link"
            aria-label="Retour à l’accueil"
          >
            <img
              src="/images/logo-b.png"
              alt="Logo François Benett"
              className="navbar-logo"
            />
          </Link>

          <div className="navbar-identity">
            <Link to="/parcours" className="navbar-name">
              François Benett
            </Link>

            <span className="navbar-subtitle">
              Peintre contemporain
            </span>
          </div>
        </div>

        <div
          className="navbar-page-title"
          key={location.pathname}
        >
          {obtenirTitrePage()}
        </div>

        <button
          type="button"
          className={`menu-toggle ${
            menuOuvert ? "menu-toggle-open" : ""
          }`}
          onClick={() => setMenuOuvert((ancienEtat) => !ancienEtat)}
          aria-label={
            menuOuvert ? "Fermer le menu" : "Ouvrir le menu"
          }
          aria-expanded={menuOuvert}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <button
        type="button"
        className={`menu-backdrop ${
          menuOuvert ? "menu-backdrop-visible" : ""
        }`}
        onClick={fermerMenu}
        aria-label="Fermer le menu"
      />

      <aside
        className={`menu-panel ${
          menuOuvert ? "menu-panel-open" : ""
        }`}
      >
        <div className="menu-panel-header">
          <span>Navigation</span>

          <button
            type="button"
            className="menu-close"
            onClick={fermerMenu}
            aria-label="Fermer le menu"
          >
            ×
          </button>
        </div>

        <nav className="menu-panel-links">
          <Link to="/" onClick={fermerMenu}>
            <span className="menu-number">01</span>
            <span>Accueil</span>
          </Link>

          <Link to="/collections" onClick={fermerMenu}>
            <span className="menu-number">02</span>
            <span>Collections</span>
          </Link>

          <Link to="/parcours" onClick={fermerMenu}>
            <span className="menu-number">03</span>
            <span>Parcours</span>
          </Link>

          <Link to="/contact" onClick={fermerMenu}>
            <span className="menu-number">04</span>
            <span>Contact</span>
          </Link>
        </nav>

        <div className="menu-panel-footer">
          <span>François Benett</span>
          <span>Peinture contemporaine</span>
        </div>
      </aside>
    </>
  );
}