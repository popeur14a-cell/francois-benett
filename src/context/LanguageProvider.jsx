import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "./LanguageContext";

export default function LanguageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguageState] = useState(() =>
    window.location.pathname === "/en" || window.location.pathname.startsWith("/en/")
      ? "en"
      : "fr"
  );

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(nextLanguage === "en" ? "en" : "fr");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("benett-language", language);
    document.documentElement.lang = language;

    const hasEnglishPrefix =
      location.pathname === "/en" || location.pathname.startsWith("/en/");
    if (language === "en" && !hasEnglishPrefix) {
      navigate(`/en${location.pathname === "/" ? "" : location.pathname}${location.search}${location.hash}`, { replace: true });
    } else if (language === "fr" && hasEnglishPrefix) {
      const frenchPath = location.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
      navigate(`${frenchPath}${location.search}${location.hash}`, { replace: true });
    }
  }, [language, location.hash, location.pathname, location.search, navigate]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
