import { useEffect, useState } from "react";
import { FavoritesContext } from "./FavoritesContext";

const STORAGE_KEY = "benett-favorite-artworks";

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (path) => {
    setFavorites((current) =>
      current.includes(path)
        ? current.filter((favorite) => favorite !== path)
        : [...current, path]
    );
  };

  const removeFavorite = (path) => {
    setFavorites((current) => current.filter((favorite) => favorite !== path));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        removeFavorite,
        isFavorite: (path) => favorites.includes(path),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
