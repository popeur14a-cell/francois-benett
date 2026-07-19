import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Page introuvable | Galerie François Benett</title>
        <meta
          name="description"
          content="Cette page n’existe pas ou n’est plus disponible."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="collection-detail-page">
        <div className="collection-not-found">
          <h1>Page introuvable</h1>
          <p>Cette page n’existe pas ou n’est plus disponible.</p>
          <Link to="/" className="collection-back-link">
            <span aria-hidden="true">←</span>
            Retour à l’accueil
          </Link>
        </div>
      </main>
    </>
  );
}
