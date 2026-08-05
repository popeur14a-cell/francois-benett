import React from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import { BrowserRouter } from "react-router-dom";
import LanguageProvider from "./context/LanguageProvider";
import FavoritesProvider from "./context/FavoritesProvider";

import App from "./App";
import "./index.css";

inject();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </LanguageProvider>
    </BrowserRouter>

  </React.StrictMode>
);
