import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useLanguage from "../context/useLanguage";
import { artworkSearchMetadata } from "../data/artworkSearchMetadata";
import { getAllArtworks, getArtworkAlt } from "../utils/artworks";
import { SearchIcon } from "./Icons";
import ResponsiveImage from "./ResponsiveImage";

const artworks = getAllArtworks();

function normalizeSearch(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .toLowerCase()
    .trim();
}

function getFormatTags(dimensions = "") {
  const values = [...dimensions.matchAll(/\d+/g)].map(([value]) => Number(value));
  const figureFormat = dimensions.match(/(25|40|50)\s*F/i)?.[1];
  const largestSide = figureFormat
    ? { 25: 81, 40: 100, 50: 116 }[figureFormat]
    : values.length
      ? Math.max(...values)
      : 0;
  const tags = [];

  if (/panneaux/i.test(dimensions)) {
    tags.push("diptyque", "deux panneaux", "grand format", "large format");
  } else if (largestSide >= 100) tags.push("grand format", "grande toile", "large format");
  else if (largestSide && largestSide <= 60) tags.push("petit format", "small format");
  else if (largestSide) tags.push("format moyen", "medium format");

  if (values.length >= 2 && !/panneaux/i.test(dimensions)) {
    const ratio = values[0] / values[1];
    if (ratio >= 0.92 && ratio <= 1.08) tags.push("carré", "carre", "square");
    else if (ratio > 1) tags.push("paysage", "horizontal", "landscape");
    else tags.push("portrait", "vertical");
  }

  return tags;
}

function getSubjectTags(artwork) {
  const title = normalizeSearch(artwork.titre);
  const tags = ["peinture", "tableau", "art contemporain"];

  if (/(oiseau|colombe|mesange|roitelet|chat|siamois|poisson|billy|oeuf|cavaliere|amazone|etendard)/.test(title)) {
    tags.push("animal", "animaux", "faune");
  }
  if (/(cavaliere|amazone|etendard)/.test(title)) {
    tags.push("cheval", "chevaux", "equestre");
  }
  if (/(andalouse|amazone|cavaliere|odalisque|diva|violoniste|modele|marionnettiste|bretonne)/.test(title)) {
    tags.push("femme", "femmes", "personnage");
  }
  if (artwork.collectionId === "tango") {
    tags.push("homme", "femme", "couple", "danse", "personnages");
  }
  if (["clowns", "messagers", "scene-d-intimite"].includes(artwork.collectionId)) {
    tags.push("personnage", "personnages", "figure");
  }
  if (artwork.collectionId === "clowns") tags.push("homme", "spectacle");
  if (/(joueur|parieur|messager|tambour|trio|dresseur)/.test(title)) {
    tags.push("homme", "hommes");
  }
  if (/(violon|violoncelle|trompette|tambour|cornemuse|concerto)/.test(title)) {
    tags.push("musique", "instrument", "musicien");
  }
  if (/(bouquet|fleur|nature morte|grenadine)/.test(title)) {
    tags.push("fleur", "fleurs", "nature morte");
  }
  if (["amsterdam", "espagne", "maroc", "paris", "venise"].includes(artwork.collectionId)) {
    tags.push("ville", "voyage", "lieu");
  }
  tags.push(
    artwork.collectionParticuliere
      ? "collection particulière non disponible"
      : "disponible disponibilité"
  );

  return tags;
}

const COLOR_ALIASES = {
  bleu: ["bleu", "blue", "turquoise"],
  rouge: ["rouge", "red", "carmin"],
  jaune: ["jaune", "yellow", "ocre", "or"],
  vert: ["vert", "green"],
  rose: ["rose", "pink"],
  violet: ["violet", "purple", "mauve"],
  orange: ["orange"],
  neutre: ["noir", "blanc", "gris", "black", "white", "grey", "monochrome"],
};

function getCatalogTags(artwork) {
  return (artworkSearchMetadata[artwork.path] || []).flatMap((tag) => [
    tag,
    ...(COLOR_ALIASES[tag] || []),
  ]);
}

export default function ArtworkSearch() {
  const { language } = useLanguage();
  const en = language === "en";
  const [query, setQuery] = useState("");

  const normalizedQuery = normalizeSearch(query);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return artworks
      .filter((artwork) =>
        normalizeSearch(
          [
            artwork.titre,
            artwork.collectionName,
            artwork.collectionNameEn,
            ...getFormatTags(artwork.dimensions),
            ...getSubjectTags(artwork),
            ...getCatalogTags(artwork),
            ...(artwork.searchTags || []),
          ].join(" ")
        ).includes(normalizedQuery)
      )
      .sort((a, b) => {
        const aStarts = normalizeSearch(a.titre).startsWith(normalizedQuery);
        const bStarts = normalizeSearch(b.titre).startsWith(normalizedQuery);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.titre.localeCompare(b.titre, language, {
          sensitivity: "base",
          numeric: true,
        });
      });
  }, [language, normalizedQuery]);

  return (
    <section className="artwork-search" aria-label={en ? "Search the gallery" : "Rechercher dans la galerie"}>
      <div className="artwork-search-body">
        <label className="artwork-search-field">
          <SearchIcon />
          <span className="sr-only">
            {en ? "Artwork title or collection" : "Titre de l’œuvre ou collection"}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              en
                ? "Title, colour, subject or format…"
                : "Titre, couleur, sujet ou format…"
            }
            autoComplete="off"
          />
        </label>

        <div className="artwork-search-content" aria-live="polite">
          {normalizedQuery && results.length > 0 ? (
            <>
              <p className="artwork-search-count">
                {results.length}{" "}
                {en
                  ? results.length === 1
                    ? "result"
                    : "results"
                  : results.length === 1
                    ? "résultat"
                    : "résultats"}
              </p>
              <ul className="artwork-search-results">
                {results.map((artwork) => (
                  <li key={artwork.path}>
                    <Link
                      to={`${en ? "/en" : ""}${artwork.path}`}
                      viewTransition
                    >
                      <span className="artwork-search-thumbnail">
                        <ResponsiveImage
                          src={artwork.thumbnail || artwork.image}
                          sizes="82px"
                          alt={getArtworkAlt(artwork, en)}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="artwork-search-copy">
                        <strong>{artwork.titre}</strong>
                        <small>
                          {en ? artwork.collectionNameEn : artwork.collectionName}
                          {artwork.dimensions ? ` · ${artwork.dimensions}` : ""}
                        </small>
                      </span>
                      <span className="artwork-search-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : normalizedQuery ? (
            <p className="artwork-search-empty">
              {en
                ? `No artwork found for “${query.trim()}”.`
                : `Aucune œuvre trouvée pour « ${query.trim()} ».`}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
