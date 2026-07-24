import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useLanguage from "../context/useLanguage";
import { ArrowIcon } from "../components/Icons";

export default function NotFound() {
  const { language } = useLanguage();
  const en = language === "en";
  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{en ? "Page not found" : "Page introuvable"} | Galerie François Benett</title>
        <meta
          name="description"
          content={en ? "This page does not exist or is no longer available." : "Cette page n’existe pas ou n’est plus disponible."}
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="collection-detail-page">
        <div className="collection-not-found">
          <h1>{en ? "Page not found" : "Page introuvable"}</h1>
          <p>{en ? "The requested page cannot be found. You can return to the gallery or explore the collections." : "La page demandée est introuvable. Vous pouvez revenir à la galerie ou découvrir les collections."}</p>
          <div className="not-found-actions">
            <Link to="/" className="collection-back-link">
              <ArrowIcon direction="left" />
              {en ? "Back to home" : "Retour à l’accueil"}
            </Link>
            <Link to="/collections" className="artwork-primary-link">
              {en ? "View collections" : "Voir les collections"}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
