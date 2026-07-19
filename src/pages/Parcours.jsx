import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";
const PAGE_URL = `${SITE_URL}/parcours`;
const PORTRAIT_URL = `${SITE_URL}/images/portrait.jpg`;

const DESCRIPTION =
  "Découvrez le parcours, les expositions et les critiques consacrées à François Benett, peintre contemporain diplômé des Beaux-Arts.";

const expositions = [
  ["1974", ["Hôtel de Ville de Sablé"]],
  ["1975", ["Musée Tessé — Le Mans"]],
  ["1976", ["Abbaye de L’Épau — Le Mans"]],
  ["1978", ["Hôtel de Ville de Bückeburg — Allemagne"]],
  ["1983", ["Galerie de l’Orangerie — Nantes"]],
  ["1987", ["Mairie de Sauzon — Belle-Île", "Galerie Moyon Avenard — Nantes"]],
  ["1989", ["Galerie Moyon Avenard — Nantes"]],
  ["1991", ["Galerie Moyon Avenard — Nantes"]],
  ["1993", ["Galerie Moyon Avenard — Nantes", "Galerie La Palette d’Or — Strasbourg", "Galerie Vendôme — Paris"]],
  ["1995", ["Galerie La Palette d’Or — Strasbourg"]],
  ["1996", ["Galerie Moyon Avenard — Nantes"]],
  ["1997", ["Galerie Arcadie — Le Mans"]],
  ["1998", ["Galerie Titren — Beaune", "Galerie des Salines Royales — Arc-et-Senans", "Galerie Moyon Avenard — Nantes", "Galerie Vendôme — Paris"]],
  ["1999", ["Galerie La Palette d’Or — Strasbourg", "Galerie Val — Béthune"]],
  ["2000", ["Centre culturel d’Ancenis"]],
  ["2001", ["Galerie Moyon Avenard — Nantes", "Galerie La Palette d’Or — Strasbourg"]],
  ["2002", ["Galerie JCB — Colmar"]],
  ["2003", ["Galerie Nadine Moineau — Nantes"]],
  ["2005", ["Galerie JCB — Colmar", "Galerie Nadine Moineau — Nantes"]],
  ["2006", ["Galerie Modus — Paris", "Centre d’art contemporain — Briançon"]],
  ["2007", ["Galerie JCB — Colmar", "Galerie Nadine Moineau — Nantes", "Galerie Art Présent — Paris"]],
  ["2009", ["Galerie Nadine Moineau — Nantes"]],
];

const bibliographie = [
  "Préface de Raymond Chelet, directeur de l’École des Beaux-Arts du Mans, pour son exposition au Musée de Tessé au Mans (1975).",
  "Intervention sur France 3 dans l’émission « Midi cocktail », aux côtés de Benoîte Groult, sur le thème « Femme éternelle » (1993).",
  "Préface d’Yves Cosson de l’Académie de Bretagne pour son exposition au Salon du Mans (1995).",
  "Pratique des Arts n° 4 — « BENETT, la peinture idéale ? » (2000).",
  "Préface de Jean-Louis Avril, Univers des Arts, pour son exposition au Centre d’art contemporain de Briançon (2007).",
];

const regards = [
  {
    titre: "Le petit théâtre de Benett",
    auteur: "Yves Cosson",
    paragraphes: [
      "Quand on parle portraits, on s’attend à pouvoir admirer, selon la tradition classique, une galerie de personnages distingués, bien situés socialement, portraits dont la qualité et la richesse se découvrent essentiellement dans la vérité du sujet, les manières, le port de tête, le bel ovale du visage, le sourire de circonstance ou la raideur naturelle et, par-dessus tout, la profondeur d’un regard étrange ou charmeur. On va voir, en troupeau, le fameux sourire de la Joconde.",
      "On mesurera, ici, l’énorme surprise de l’amateur à qui l’on offre un étonnant spectacle, multiple et changeant et, cependant, apparemment répétitif puisque, d’une image à l’autre, on retrouve les mêmes jeunes femmes aux formes sveltes et pures, singulièrement statiques, au repos ou dans une sorte d’attente mystérieuse, rencontrées là, par hasard, le plus souvent sur une place ou dans une rue d’Espagne ou encore dans l’intimité familière d’un salon ou d’une chambre. Elles sont andalouses, choisies pour leur réputation populaire de beauté, de charme et de séduction.",
      "En réalité, le peintre évite de recourir aux procédés pittoresques et anecdotiques. Son ambition, son audace et sa réserve l’incitent à élaborer une sorte d’hommage fervent à la femme, signe de son admiration secrète, hommage du cœur qui exalte la tendresse et la douceur de ces êtres de chair, donneuses de vie et d’amour. Dans l’épanouissement de la jeunesse, toutes les femmes paraissent semblables et, cependant, uniques car elles tissent avec les hommes de leur vie des liens mystérieux.",
      "Mais ces adorables créatures gardent d’abord les yeux baissés, semblent indifférentes, car les jeux de la séduction sont encore à venir.",
      "Ainsi, à travers la profusion de scènes apparemment banales, s’organise un petit théâtre silencieux mais ardent, chaque mise en scène étant un arrêt sur image — même les danseuses de flamenco ou les gracieuses amazones — qui saisit le secret d’un boudoir, la chaleur d’une rencontre entre amies sur une place qu’une sorte de blason suffit à identifier, ou encore ces belles de Montmartre.",
      "Plus subtile encore est la mise en scène symbolique où intervient l’oiseau de l’amour sur le rebord de la fenêtre. Serait-ce le chant du roitelet ou celui du rossignol des pures nuits d’été ?",
      "Et cependant, ces jeunes femmes au port hiératique, toujours secrètes, rayonnent d’une fine et merveilleuse sensualité que le peintre, avec virtuosité, colore. Les costumes vaporeux et légers étalent une richesse délicate de tons et de couleurs qui pourraient rappeler la somptuosité lumineuse des robes andalouses ; même quelques pointes écarlates n’auraient-elles pas quelque parenté avec la tauromachie ?",
      "En contrepoint, BENETT nous rappelle son goût raffiné pour ses superbes camaïeux dans les bleus et les jaunes, qui restent liés à sa fréquentation poétique des gens du cirque et des clowns musiciens dans les tons froids.",
      "Le charme opère. Ces jeunes femmes prennent en nous une place forte dans le jardin de la beauté, fascinantes et mystérieuses, tellement étranges et cependant si proches. BENETT est bien un peintre subtil, amoureux de la femme.",
    ],
  },
  {
    titre: "Le Moniteur de Strasbourg",
    auteur: "Novembre 1997",
    paragraphes: [
      "Original parce qu’il associe la représentation figurative à un style moderne élégamment maîtrisé. Chaque tableau de BENETT a son propre rythme et son intense poésie.",
      "En jouant avec les transparences comme l’ombre et la lumière, en accordant à la couleur sa propre magie par le choix d’une dominante, qu’elle soit bleue, rouge ou autre, la femme elle-même épouse ce rythme avec toute sa grâce et son charme.",
    ],
  },
  {
    titre: "Le Maine Libre",
    auteur: "J. Guichard — 1994",
    paragraphes: [
      "François BENETT possède une rigoureuse technique qu’il met au service d’un style qui, effaçant les détails auxquels on s’attend, met en exergue les accessoires que l’on se prend à découvrir.",
      "Le peintre évite le maniérisme tout en donnant l’impression d’un symbolisme ouvragé. Il crée un nouveau baroque très personnel que seuls surchargent les regards qu’on y appuie.",
    ],
  },
  {
    titre: "Les Dernières Nouvelles d’Alsace",
    auteur: "Décembre 2001",
    paragraphes: [
      "Une technique personnelle d’une grande richesse de matière, un travail en épaisseur qui conserve une réelle fraîcheur, une certaine liberté du geste, rendant les compositions de BENETT fascinantes. Une femme stylisée, mêlée à des jeux de lumière et de couleur évoquant la vision au travers d’un prisme ou d’un filtre coloré.",
      "BENETT nous donne à voir un monde aux formes épurées, aux atmosphères raffinées évoquant l’âge d’or vénitien. Un univers féérique, alchimique, reflet de la vision intérieure du peintre.",
    ],
  },
  {
    titre: "Univers des Arts",
    auteur: "J.-L. Avril — Novembre 2007",
    paragraphes: [
      "Dans sa peinture, BENETT alterne les contraires : la spontanéité de l’expression que permet l’acrylique et la subjectivité de ses compositions.",
      "Son art est polymorphe. Les personnages apparaissent souvent dédoublés, à facettes, androgynes… L’ambiguïté, le mystère lui permettent de parler de lui et de nous, d’exprimer des dualités, d’instaurer le doute, le trouble, l’inquiétude tout autant que la quiétude ou la joie.",
      "Pour cet artiste, une toile doit être interprétée sous tous ses aspects : sous sa phase figurée et, au-delà de la composition du sujet, dans la trace, la pose et le travail de la matière et des couleurs. Sa palette s’ajuste de façon cyclique, souvent en camaïeu de bleus ou en réponses de rouges et de jaunes, avec quelques accents toniques en contraste fort. BENETT sait retenir l’œil afin de mieux nous déstabiliser pour nous retenir mieux encore et toujours.",
    ],
  },
];

export default function Parcours() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Parcours de François Benett",
    description: DESCRIPTION,
    url: PAGE_URL,
    inLanguage: "fr-FR",
    mainEntity: {
      "@type": "Person",
      name: "François Benett",
      jobTitle: "Peintre contemporain",
      image: PORTRAIT_URL,
      url: SITE_URL,
      homeLocation: { "@type": "Place", name: "Région nantaise, France" },
      alumniOf: { "@type": "EducationalOrganization", name: "École des Beaux-Arts" },
    },
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Parcours de François Benett | Peintre contemporain</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Parcours de François Benett | Peintre contemporain" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={PORTRAIT_URL} />
        <meta property="og:image:alt" content="Portrait de François Benett, peintre contemporain" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Parcours de François Benett | Peintre contemporain" />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={PORTRAIT_URL} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="parcours-page">
        <header className="parcours-header">
          <span className="parcours-kicker">Parcours</span>
          <h1 className="parcours-title">François Benett</h1>
          <p className="parcours-subtitle">Peintre contemporain</p>
        </header>

        <section className="parcours-introduction" aria-labelledby="presentation-artiste">
          <div className="parcours-text">
            <h2 id="presentation-artiste">Une peinture de lumière, de poésie et d’émotion</h2>
            <p>François Benett vit et travaille dans la région nantaise. Diplômé National des Beaux-Arts, il développe depuis plusieurs décennies un univers artistique personnel, construit autour de la lumière, de la poésie et de l’émotion.</p>
            <p>Son œuvre s’inscrit dans une peinture figurative contemporaine où les personnages, les paysages et les scènes de vie deviennent des espaces d’expression et de sensibilité.</p>
            <p>À travers ses tableaux, François Benett invite le spectateur à voyager entre réalité et imaginaire. Son travail est marqué par une recherche constante autour de la couleur, de la matière et des atmosphères.</p>
            <p>Au fil des années, il a construit un style qui lui est propre, permettant de reconnaître ses œuvres sans même voir sa signature.</p>
            <p>François Benett a exposé dans de nombreuses galeries et salons en France. Il a également été invité d’honneur dans différents salons artistiques.</p>
          </div>
          <figure className="parcours-portrait">
            <img src="/images/portrait.jpg" alt="Portrait de François Benett, peintre contemporain" fetchPriority="high" decoding="async" width="800" height="1000" />
            <figcaption>François Benett, peintre contemporain.</figcaption>
          </figure>
        </section>

        <section className="parcours-section parcours-formation" aria-labelledby="formation-reconnaissance">
          <h2 id="formation-reconnaissance">Formation et reconnaissance</h2>
          <p>François Benett est diplômé National des Beaux-Arts. Son parcours artistique est marqué par de nombreuses expositions personnelles, des invitations d’honneur et une présence dans plusieurs galeries françaises. Son travail a été présenté auprès de collectionneurs en France et à l’étranger.</p>
        </section>

        <section className="parcours-section" aria-labelledby="expositions-personnelles">
          <h2 id="expositions-personnelles">Expositions personnelles</h2>
          <div className="parcours-timeline">
            {expositions.map(([annee, lieux]) => (
              <article className="parcours-event" key={annee}>
                <time>{annee}</time>
                <ul>{lieux.map((lieu) => <li key={lieu}>{lieu}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="parcours-section parcours-two-columns" aria-label="Collections et bibliographie">
          <div>
            <h2>Collections particulières et musées</h2>
            <p>Les œuvres de François Benett sont présentes dans des collections particulières en France, en Allemagne, en Belgique, en Italie, aux États-Unis et au Japon.</p>
            <p>Ses œuvres ont également été présentées dans plusieurs collections publiques et musées :</p>
            <ul className="parcours-list">
              <li>Musée de Tessé — Le Mans</li>
              <li>Musée de Cholet</li>
              <li>Musée d’Angers</li>
            </ul>
          </div>
          <div>
            <h2>Bibliographie</h2>
            <ul className="parcours-list">
              {bibliographie.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="parcours-section parcours-regards" aria-labelledby="regards-oeuvre">
          <header>
            <span className="parcours-kicker">Critiques et publications</span>
            <h2 id="regards-oeuvre">Regards sur l’œuvre de François Benett</h2>
          </header>
          {regards.map((regard) => (
            <article className="parcours-critique" key={regard.titre}>
              <h3>{regard.titre}</h3>
              {regard.paragraphes.map((paragraphe) => <p key={paragraphe}>{paragraphe}</p>)}
              <footer>{regard.auteur}</footer>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
