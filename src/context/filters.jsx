import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const FiltersContext = createContext();

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
  });
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return Array.isArray(info.favorites) ? info.favorites : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .get(`${apiUrl}/categories`)
      .then(({ data }) => {
        const list = data?.data ?? data;
        if (Array.isArray(list) && list.length > 0) setCategories(list);
      })
      .catch(() => {});
  }, []);

  return (
    <FiltersContext.Provider value={{ filters, setFilters, categories, favorites, setFavorites }}>
      {children}
    </FiltersContext.Provider>
  );
}
