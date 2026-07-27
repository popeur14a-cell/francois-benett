import { Helmet } from "../components/Helmet";
import { Link } from "react-router-dom";
import { ArrowIcon, HeartIcon } from "../components/Icons";
import ResponsiveImage from "../components/ResponsiveImage";
import useFavorites from "../context/useFavorites";
import useLanguage from "../context/useLanguage";
import { findArtworkByPath, getArtworkAlt, getArtworkDimensionsLabel } from "../utils/artworks";

export default function Favorites() {
  const { language } = useLanguage();
  const en = language === "en";
  const { favorites, removeFavorite } = useFavorites();
  const artworks = favorites.map(findArtworkByPath).filter(Boolean);
  const groupedTitles = artworks.map((artwork) => artwork.titre).join(", ");

  return (
    <>
      <Helmet>
        <title>{en ? "My favourite artworks" : "Mes œuvres favorites"} | Galerie François Benett</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <main className="favorites-page">
        <header>
          <span>{en ? "Personal selection" : "Sélection personnelle"}</span>
          <h1>{en ? "My favourite artworks" : "Mes œuvres favorites"}</h1>
          <p>{en ? "Your selection is stored only in this browser." : "Votre sélection est conservée uniquement dans ce navigateur."}</p>
        </header>

        {artworks.length ? (
          <>
            <div className="favorites-grid">
              {artworks.map((artwork) => (
                <article key={artwork.path}>
                  <Link
                    to={artwork.path}
                    viewTransition
                    aria-label={`${en ? "Open" : "Ouvrir"} ${artwork.titre}`}
                  >
                    <span className={`favorites-artwork-visual ${artwork.images?.length > 1 ? "is-diptych" : ""}`}>
                      {(artwork.images?.length > 1 ? artwork.images : [artwork.thumbnail || artwork.image]).map((image, index) => (
                        <ResponsiveImage
                          key={image}
                          src={image}
                          sizes={artwork.images?.length > 1 ? "(max-width: 760px) 44vw, 15vw" : "(max-width: 760px) 92vw, 30vw"}
                          alt={artwork.images?.length > 1 ? `${getArtworkAlt(artwork, en)} — ${en ? `panel ${index + 1}` : `panneau ${index + 1}`}` : getArtworkAlt(artwork, en)}
                          loading="lazy"
                          decoding="async"
                        />
                      ))}
                    </span>
                  </Link>
                  <div>
                    <h2><Link to={artwork.path} viewTransition>{artwork.titre}</Link></h2>
                    {artwork.dimensions && <p>{getArtworkDimensionsLabel(artwork.dimensions, en)}</p>}
                    <button type="button" onClick={() => removeFavorite(artwork.path)}><HeartIcon filled /> {en ? "Remove" : "Retirer"}</button>
                  </div>
                </article>
              ))}
            </div>
            <Link to={`/contact?artworks=${encodeURIComponent(groupedTitles)}`} className="favorites-contact">
              {en ? "Ask about this selection" : "Demander des informations sur cette sélection"} <ArrowIcon direction="right" />
            </Link>
          </>
        ) : (
          <div className="favorites-empty">
            <p>{en ? "You have not saved any artwork yet." : "Vous n’avez pas encore enregistré d’œuvre."}</p>
            <Link to="/collections">{en ? "Explore the collections" : "Explorer les collections"} <ArrowIcon direction="right" /></Link>
          </div>
        )}
      </main>
    </>
  );
}
