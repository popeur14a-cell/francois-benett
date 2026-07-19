import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.benett-peintre.fr";

const collections = [
  {
    nom: "Venise",
    slug: "venise",
    image: "/images/venise/palais-des-doges.jpg",
    description:
      "Lumières, architectures et atmosphères vénitiennes.",
  },
  {
    nom: "Espagne",
    slug: "espagne",
    image: "/images/espagne/les-deux-andalouses.jpg",
    description:
      "Couleurs, traditions et scènes inspirées de la culture espagnole.",
  },
  {
    nom: "Maroc",
    slug: "maroc",
    image: "/images/maroc/les-colombes.jpg",
    description:
      "Lumières orientales, paysages et impressions de voyage.",
  },
  {
    nom: "Paris",
    slug: "paris",
    image: "/images/paris/cafe-de-flore.jpg",
    description:
      "Regards sur la ville, ses rues et son atmosphère.",
  },
  {
    nom: "Bretonnes",
    slug: "bretonnes",
    image:
      "/images/bretonnes/les-belles-histoires-avec-billy.jpg",
    description:
      "Personnages et scènes inspirées de la Bretagne.",
  },
  {
    nom: "Amsterdam",
    slug: "amsterdam",
    image: "/images/amsterdam/amsterdam.jpg",
    description:
      "Canaux, architectures et atmosphères urbaines.",
  },
  {
    nom: "Tango",
    slug: "tango",
    image: "/images/tango/tango.jpg",
    description:
      "Mouvement, élégance et passion autour de la danse.",
  },
  {
    nom: "Les Messagers",
    slug: "messagers",
    image: "/images/messagers/les-messagers.jpg",
    description:
      "Une série de personnages symboliques et poétiques.",
  },
  {
    nom: "Scènes d’intimité",
    slug: "scene-d-intimite",
    image: "/images/scene-d-intimite/passion.jpg",
    description:
      "Moments de vie, relations humaines et instants suspendus.",
  },
  {
    nom: "Clowns",
    slug: "clowns",
    image: "/images/clowns/les-inseparables.jpg",
    description:
      "Des personnages expressifs entre émotion, poésie et profondeur.",
  },
];

const PAGE_URL = `${SITE_URL}/collections`;

const PAGE_DESCRIPTION =
  "Découvrez les collections de François Benett, peintre contemporain français : Venise, Espagne, Maroc, Paris, Bretagne, Amsterdam, Tango, Les Messagers, scènes d’intimité et clowns.";

const SHARE_IMAGE = `${SITE_URL}/images/venise/palais-des-doges.jpg`;

export default function Collections() {
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
        <html lang="fr" />

        <title>
          Collections de François Benett | Peintre contemporain
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
          <h1>Collections de François Benett</h1>

          <p>
            Découvrez les différents univers de François Benett,
            entre voyages, lieux, personnages et émotions. Chaque
            collection révèle une atmosphère particulière à travers
            des œuvres originales.
          </p>
        </section>

        <section
          className="collections-grid"
          aria-label="Liste des collections de François Benett"
        >
          {collections.map((collection, index) => (
            <Link
              key={collection.slug}
              to={`/collections/${collection.slug}`}
              className="collection-card-page"
              aria-label={`Découvrir la collection ${collection.nom}`}
            >
              <img
                src={collection.image}
                alt={`Œuvre représentative de la collection ${collection.nom} de François Benett`}
                loading={index < 2 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />

              <div className="collection-overlay">
                <h2>{collection.nom}</h2>

                <p>{collection.description}</p>

                <span>
                  Découvrir
                  <span aria-hidden="true"> →</span>
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section
          className="oeuvres-originales"
          aria-labelledby="titre-oeuvres-originales"
        >
          <h2 id="titre-oeuvres-originales">
            Des œuvres originales et uniques
          </h2>

          <p>
            Chaque tableau de François Benett est une pièce unique,
            disponible sur demande.
          </p>
        </section>
      </main>
    </>
  );
}