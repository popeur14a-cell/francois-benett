import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() =>
    window.localStorage.getItem("benett-language") === "en" ? "en" : "fr"
  );

  useEffect(() => {
    window.localStorage.setItem("benett-language", language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
