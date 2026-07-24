import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContext";

export default function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans FavoritesProvider");
  }
  return context;
}
