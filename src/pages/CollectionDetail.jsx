import { Link, useParams } from "react-router-dom";
import { collectionsData } from "../data/collectionsData";

export default function CollectionDetail() {
  const { collectionId } = useParams();

  const collection = collectionsData[collectionId];

  if (!collection) {
    return (
      <main className="collection-detail-page">
        <div className="collection-not-found">
          <h1>Collection introuvable</h1>

          <Link to="/collections" className="collection-back-link">
            ← Retour aux collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="collection-detail-page">
      <header className="collection-detail-header">
        <Link to="/collections" className="collection-back-link">
          <span aria-hidden="true">←</span>
          Retour aux collections
        </Link>

        <h1>{collection.nom}</h1>

        <p className="collection-count">
          {collection.oeuvres.length}{" "}
          {collection.oeuvres.length > 1 ? "œuvres" : "œuvre"}
        </p>
      </header>

      <section className="artworks-grid">
        {collection.oeuvres.map((oeuvre, index) => (
          <article className="artwork-card" key={`${oeuvre.titre}-${index}`}>
            <div className="artwork-image-container">
              <img
                src={oeuvre.image}
                alt={oeuvre.titre}
                className="artwork-image"
                loading="lazy"
              />
            </div>

            <div className="artwork-information">
              <h2>{oeuvre.titre}</h2>

              {oeuvre.dimensions && (
                <p className="artwork-dimensions">{oeuvre.dimensions}</p>
              )}

              {oeuvre.collectionParticuliere && (
                <p className="artwork-status">
                  Collection particulière
                </p>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}