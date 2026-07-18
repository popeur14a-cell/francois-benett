import { Link } from "react-router-dom";

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
      description: "Mouvement, élégance et passion.",
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

  return (
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

      <section className="collections-grid">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            to={`/collections/${collection.slug}`}
            className="collection-card-page"
          >
            <img
              src={collection.image}
              alt={collection.nom}
            />

            <div className="collection-overlay">
              <h2>{collection.nom}</h2>

              <p>{collection.description}</p>

              <span>Découvrir →</span>
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
  );
}