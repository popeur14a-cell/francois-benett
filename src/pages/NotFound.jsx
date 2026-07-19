import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useLanguage from "../context/useLanguage";

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
          <p>{en ? "This page does not exist or is no longer available." : "Cette page n’existe pas ou n’est plus disponible."}</p>
          <Link to="/" className="collection-back-link">
            <span aria-hidden="true">←</span>
            {en ? "Back to home" : "Retour à l’accueil"}
          </Link>
        </div>
      </main>
    </>
  );
}
