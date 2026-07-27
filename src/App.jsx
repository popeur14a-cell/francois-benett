import { Helmet } from "./components/Helmet";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/Home"));
const Collections = lazy(() => import("./pages/Collections"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const ArtworkDetail = lazy(() => import("./pages/ArtworkDetail"));
const Parcours = lazy(() => import("./pages/Parcours"));
const Contact = lazy(() => import("./pages/Contact"));
const Favorites = lazy(() => import("./pages/Favorites"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const SITE_URL = "https://www.benett-peintre.fr";
const SITE_NAME = "Galerie François Benett";

export default function App() {
  const location = useLocation();
  const pathWithoutLanguage = location.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const frenchUrl = `${SITE_URL}${pathWithoutLanguage === "/" ? "/" : pathWithoutLanguage}`;
  const englishUrl = `${SITE_URL}/en${pathWithoutLanguage === "/" ? "" : pathWithoutLanguage}`;
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
        image: `${SITE_URL}/images/portraits/portrait.jpg`,
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
        logo: `${SITE_URL}/images/branding/logo-b.png`,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <link rel="alternate" hrefLang="fr" href={frenchUrl} />
        <link rel="alternate" hrefLang="en" href={englishUrl} />
        <link rel="alternate" hrefLang="x-default" href={frenchUrl} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Navbar />
      <ScrollToTop />

      <Suspense fallback={<main className="route-loading" aria-busy="true"><span className="sr-only">Chargement de la page</span></main>}>
        <GalleryRoutes />
      </Suspense>

      <Footer />
    </>
  );
}

function GalleryRoutes() {
  return (
    <Routes>
      {["", "/en"].flatMap((prefix) => [
        <Route key={`${prefix}-home`} path={prefix || "/"} element={<Home />} />,

        <Route
          key={`${prefix}-collections`}
          path={`${prefix}/collections`}
          element={<Collections />}
        />,

        <Route
          key={`${prefix}-collection`}
          path={`${prefix}/collections/:collectionId`}
          element={<CollectionDetail />}
        />,

        <Route
          key={`${prefix}-legacy-parieurs`}
          path={`${prefix}/collections/paris/les-parieurs`}
          element={<Navigate to={`${prefix}/collections/paris/les-dernieres-nouvelles`} replace />}
        />,

        <Route
          key={`${prefix}-legacy-jeu-de-cartes`}
          path={`${prefix}/collections/paris/jeu-de-cartes`}
          element={<Navigate to={`${prefix}/collections/scene-d-intimite/les-joueurs`} replace />}
        />,

        <Route
          key={`${prefix}-artwork`}
          path={`${prefix}/collections/:collectionId/:artworkSlug`}
          element={<ArtworkDetail />}
        />,

        <Route
          key={`${prefix}-parcours`}
          path={`${prefix}/parcours`}
          element={<Parcours />}
        />,

        <Route
          key={`${prefix}-contact`}
          path={`${prefix}/contact`}
          element={<Contact />}
        />,

        <Route key={`${prefix}-favoris`} path={`${prefix}/favoris`} element={<Favorites />} />,

        <Route
          key={`${prefix}-legal`}
          path={`${prefix}/mentions-legales`}
          element={<LegalNotice />}
        />,

        <Route
          key={`${prefix}-privacy`}
          path={`${prefix}/confidentialite`}
          element={<PrivacyPolicy />}
        />,
      ])}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
