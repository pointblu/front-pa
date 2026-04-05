import { useContext } from "react";
import { FiltersContext } from "../context/filters";

export function useFilters() {
  const { filters, setFilters, categories } = useContext(FiltersContext);

  const filterProducts = (products) => {
    const search = (filters.search || "").toLowerCase().trim();
    return products.filter((product) => {
      const matchCategory =
        filters.category === "all" || product.category.name === filters.category;
      const matchSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        (product.description && product.description.toLowerCase().includes(search));
      return matchCategory && matchSearch;
    });
  };
  return { filters, filterProducts, setFilters, categories };
}
