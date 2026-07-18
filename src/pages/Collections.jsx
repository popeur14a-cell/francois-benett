import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://benett-galerie.vercel.app";

export default function Collections() {
  const collections = [
    {
      nom: "Venise",
      slug: "venise",
      image: "/images/venise/palais-des-doges.jpg",
      description:
        "Lumières, architecture et atmosphères vénitiennes.",
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
        "Mouvement, élégance et passion.",
    },
    {
      nom: "Les Messagers",
      slug: "messagers",
      image: "/images/messagers/les-messagers.jpg",
      description:
        "Série autour de personnages symboliques et poétiques.",
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
        "Personnages expressifs entre émotion, poésie et profondeur.",
    },
  ];

  const pageUrl = `${SITE_URL}/collections`;

  const description =
    "Découvrez les collections de François Benett, peintre contemporain : Venise, Espagne, Maroc, Paris, Bretagne, Amsterdam, Tango, Les Messagers, Scènes d’intimité et Clowns.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Collections de François Benett",
    description,
    url: pageUrl,
    image: `${SITE_URL}/images/venise/palais-des-doges.jpg`,
    isPartOf: {
      "@type": "WebSite",
      name: "Benett Gallery",
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
        <title>
          Collections de François Benett | Benett Gallery
        </title>

        <meta name="description" content={description} />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={pageUrl} />

        <meta
          property="og:title"
          content="Collections de François Benett"
        />

        <meta property="og:description" content={description} />

        <meta
          property="og:image"
          content={`${SITE_URL}/images/venise/palais-des-doges.jpg`}
        />

        <meta
          property="og:image:alt"
          content="Œuvre de la collection Venise de François Benett"
        />

        <meta property="og:url" content={pageUrl} />

        <meta property="og:type" content="website" />

        <meta property="og:site_name" content="Benett Gallery" />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Collections de François Benett"
        />

        <meta
          name="twitter:description"
          content={description}
        />

        <meta
          name="twitter:image"
          content={`${SITE_URL}/images/venise/palais-des-doges.jpg`}
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="collections-page">
        <section className="collections-header">
          <h1>Collections</h1>

          <p>
            Découvrez les différents univers de François Benett,
            entre voyages, lieux, personnages et émotions. Chaque
            collection révèle une atmosphère particulière à travers
            des œuvres originales.
          </p>
        </section>

        <section
          className="collections-grid"
          aria-label="Collections de François Benett"
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
                alt={`Collection ${collection.nom} de François Benett`}
                loading={index < 3 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />

              <div className="collection-overlay">
                <h2>{collection.nom}</h2>

                <p>{collection.description}</p>

                <span>
                  Découvrir <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="oeuvres-originales">
          <h2>Œuvres originales</h2>

          <p>
            Chaque œuvre est une pièce unique. Disponible sur demande.
          </p>
        </section>
      </main>
    </>
  );
}