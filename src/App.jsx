import { Helmet } from "react-helmet-async";
import { Navigate, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import ArtworkDetail from "./pages/ArtworkDetail";
import Parcours from "./pages/Parcours";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import LegalNotice from "./pages/LegalNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";

export default function App() {
  useEffect(() => {
    const blockContextMenu = (event) => event.preventDefault();
    const blockImageDrag = (event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockImageDrag);
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockImageDrag);
    };
  }, []);

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
          "https://www.instagram.com/benett_gallery/",
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
        logo: `${SITE_URL}/logo-b.png`,
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
      <ScrollToTop />

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
          path="/collections/paris/les-parieurs"
          element={<Navigate to="/collections/paris/les-dernieres-nouvelles" replace />}
        />

        <Route
          path="/collections/:collectionId/:artworkSlug"
          element={<ArtworkDetail />}
        />

        <Route
          path="/parcours"
          element={<Parcours />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route path="/favoris" element={<Favorites />} />

        <Route
          path="/mentions-legales"
          element={<LegalNotice />}
        />

        <Route
          path="/confidentialite"
          element={<PrivacyPolicy />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
