import { Helmet } from "react-helmet-async";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Parcours from "./pages/Parcours";
import Contact from "./pages/Contact";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";

export default function App() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          "Galerie officielle de François Benett, peintre contemporain français.",
        inLanguage: "fr-FR",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "François Benett",
        jobTitle: "Peintre contemporain",
        image: `${SITE_URL}/images/portrait.jpg`,
        url: SITE_URL,
        sameAs: [
          "https://www.instagram.com/francois_benett/",
          "https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts",
        ],
        homeLocation: {
          "@type": "Place",
          name: "Région nantaise, France",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo192.png`,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/collections"
          element={<Collections />}
        />

        <Route
          path="/collections/:collectionId"
          element={<CollectionDetail />}
        />

        <Route
          path="/parcours"
          element={<Parcours />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
      </Routes>

      <Footer />
    </>
  );
}