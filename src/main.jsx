import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LanguageProvider from "./context/LanguageProvider";
import FavoritesProvider from "./context/FavoritesProvider";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LanguageProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </LanguageProvider>
      </BrowserRouter>

      <SpeedInsights />
    </HelmetProvider>
  </React.StrictMode>
);
