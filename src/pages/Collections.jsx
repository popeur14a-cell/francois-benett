import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useLanguage from "../context/useLanguage";
import { ArrowIcon } from "../components/Icons";
import { ArtistLinkedText } from "../components/ArtistName";

const SITE_URL = "https://www.benett-peintre.fr";

const collections = [
  {
    nom: "Venise",
    nomEn: "Venice",
    categorie: "lieux",
    slug: "venise",
    image: "/images/venise/palais-des-doges.webp",
    descriptionEn: "Venetian light, architecture and atmosphere.",
    description:
      "Lumières, architectures et atmosphères vénitiennes.",
  },
  {
    nom: "Espagne",
    nomEn: "Spain",
    categorie: "lieux",
    slug: "espagne",
    image: "/images/espagne/les-deux-andalouses.jpg",
    descriptionEn: "Colours, traditions and scenes inspired by Spanish culture.",
    description:
      "Couleurs, traditions et scènes inspirées de la culture espagnole.",
  },
  {
    nom: "Maroc",
    nomEn: "Morocco",
    categorie: "lieux",
    slug: "maroc",
    image: "/images/maroc/les-colombes.jpg",
    descriptionEn: "Eastern light, landscapes and travel impressions.",
    description:
      "Lumières orientales, paysages et impressions de voyage.",
  },
  {
    nom: "Paris",
    nomEn: "Paris",
    categorie: "lieux",
    slug: "paris",
    image: "/images/paris/cafe-de-flore.jpg",
    descriptionEn: "Views of the city, its streets and its atmosphere.",
    description:
      "Regards sur la ville, ses rues et son atmosphère.",
  },
  {
    nom: "Bretonnes",
    nomEn: "Brittany",
    categorie: "lieux",
    slug: "bretonnes",
    image:
      "/images/bretonnes/les-belles-histoires-avec-billy.jpg",
    descriptionEn: "Figures and scenes inspired by Brittany.",
    description:
      "Personnages et scènes inspirées de la Bretagne.",
  },
  {
    nom: "Amsterdam",
    nomEn: "Amsterdam",
    categorie: "lieux",
    slug: "amsterdam",
    image: "/images/amsterdam/amsterdam.jpg",
    descriptionEn: "Canals, architecture and urban atmospheres.",
    description:
      "Canaux, architectures et atmosphères urbaines.",
  },
  {
    nom: "Tango",
    nomEn: "Tango",
    categorie: "personnages",
    slug: "tango",
    image: "/images/tango/tango.jpg",
    descriptionEn: "Movement, elegance and the passion of dance.",
    description:
      "Mouvement, élégance et passion autour de la danse.",
  },
  {
    nom: "Les Messagers",
    nomEn: "The Messengers",
    categorie: "personnages",
    slug: "messagers",
    image: "/images/messagers/les-messagers.jpg",
    descriptionEn: "A series of symbolic and poetic figures.",
    description:
      "Une série de personnages symboliques et poétiques.",
  },
  {
    nom: "Scènes d’intimité",
    nomEn: "Intimate Scenes",
    categorie: "personnages",
    slug: "scene-d-intimite",
    image: "/images/scene-d-intimite/passion.jpg",
    descriptionEn: "Moments of life, human relationships and suspended time.",
    description:
      "Moments de vie, relations humaines et instants suspendus.",
  },
  {
    nom: "Clowns",
    nomEn: "Clowns",
    categorie: "personnages",
    slug: "clowns",
    image: "/images/clowns/les-inseparables.jpg",
    descriptionEn: "Expressive figures combining emotion, poetry and depth.",
    description:
      "Des personnages expressifs entre émotion, poésie et profondeur.",
  },
];

const categories = [
  { id: "lieux", fr: "Pays et lieux", en: "Countries and places" },
  { id: "personnages", fr: "Personnages et scènes", en: "Figures and scenes" },
];

const PAGE_URL = `${SITE_URL}/collections`;

const PAGE_DESCRIPTION =
  "Découvrez les collections de François Benett, peintre contemporain français : Venise, Espagne, Maroc, Paris, Bretagne, Amsterdam, Tango, Les Messagers, scènes d’intimité et clowns.";

const SHARE_IMAGE = `${SITE_URL}/images/venise/palais-des-doges.webp`;

export default function Collections() {
  const { language } = useLanguage();
  const en = language === "en";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Collections de François Benett",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    image: SHARE_IMAGE,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      name: "Galerie François Benett",
      url: SITE_URL,
    },
    about: {
      "@type": "Person",
      name: "François Benett",
      jobTitle: "Peintre contemporain",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collections.length,
      itemListElement: collections.map((collection, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: collection.nom,
        url: `${SITE_URL}/collections/${collection.slug}`,
        image: `${SITE_URL}${collection.image}`,
      })),
    },
  };

  return (
    <>
      <Helmet>
        <html lang={language} />

        <title>
          {en ? "François Benett Collections | Contemporary painter" : "Collections de François Benett | Peintre contemporain"}
        </title>

        <meta
          name="description"
          content={PAGE_DESCRIPTION}
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={PAGE_URL} />

        <meta
          property="og:title"
          content="Collections de François Benett | Peintre contemporain"
        />

        <meta
          property="og:description"
          content={PAGE_DESCRIPTION}
        />

        <meta property="og:image" content={SHARE_IMAGE} />

        <meta
          property="og:image:alt"
          content="Œuvre de la collection Venise de François Benett"
        />

        <meta property="og:url" content={PAGE_URL} />

        <meta property="og:type" content="website" />

        <meta property="og:locale" content="fr_FR" />

        <meta
          property="og:site_name"
          content="Galerie François Benett"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Collections de François Benett | Peintre contemporain"
        />

        <meta
          name="twitter:description"
          content={PAGE_DESCRIPTION}
        />

        <meta name="twitter:image" content={SHARE_IMAGE} />

        <meta
          name="twitter:image:alt"
          content="Œuvre de la collection Venise de François Benett"
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="collections-page">
        <section className="collections-header">
          <h1><ArtistLinkedText>{en ? "François Benett Collections" : "Collections de François Benett"}</ArtistLinkedText></h1>

          <p>
            <ArtistLinkedText>{en ? "Explore the different worlds of François Benett through journeys, places, figures and emotions. Each collection reveals its own atmosphere through original works." : "Découvrez les différents univers de François Benett, entre voyages, lieux, personnages et émotions. Chaque collection révèle une atmosphère particulière à travers des œuvres originales."}</ArtistLinkedText>
          </p>
        </section>

        <div
          className="collections-groups"
          aria-label={en ? "List of François Benett collections" : "Liste des collections de François Benett"}
        >
          {categories.map((categorie) => {
            const collectionsCategorie = collections
              .filter((collection) => collection.categorie === categorie.id)
              .sort((a, b) =>
                (en ? a.nomEn : a.nom).localeCompare(
                  en ? b.nomEn : b.nom,
                  language,
                  { sensitivity: "base" }
                )
              );

            return (
              <section className="collections-category" key={categorie.id}>
                <header className="collections-category-header">
                  <span>{String(categories.indexOf(categorie) + 1).padStart(2, "0")}</span>
                  <h2>{en ? categorie.en : categorie.fr}</h2>
                </header>

                <div className="collections-grid">
                  {collectionsCategorie.map((collection, index) => (
                    <Link
                      key={collection.slug}
                      to={`/collections/${collection.slug}`}
                      className="collection-card-page"
                      aria-label={`${en ? "Discover the collection" : "Découvrir la collection"} ${en ? collection.nomEn : collection.nom}`}
                    >
                      <img
                        src={collection.image}
                        alt={`${en ? "Artwork representing the collection" : "Œuvre représentative de la collection"} ${en ? collection.nomEn : collection.nom} ${en ? "by" : "de"} François Benett`}
                        loading={categorie.id === "lieux" && index < 2 ? "eager" : "lazy"}
                        fetchPriority={categorie.id === "lieux" && index === 0 ? "high" : "auto"}
                        decoding="async"
                      />

                      <div className="collection-overlay">
                        <h2>{en ? collection.nomEn : collection.nom}</h2>
                        <p>{en ? collection.descriptionEn : collection.description}</p>
                        <span>
                          {en ? "Discover" : "Découvrir"}
                          <ArrowIcon />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section
          className="oeuvres-originales"
          aria-labelledby="titre-oeuvres-originales"
        >
          <h2 id="titre-oeuvres-originales">
            {en ? "Original and unique works" : "Des œuvres originales et uniques"}
          </h2>

          <p>
            <ArtistLinkedText>{en ? "Each François Benett painting is a unique piece, available upon request." : "Chaque tableau de François Benett est une pièce unique, disponible sur demande."}</ArtistLinkedText>
          </p>
        </section>
      </main>
    </>
  );
}
