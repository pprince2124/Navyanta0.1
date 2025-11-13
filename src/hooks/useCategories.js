// useCategories.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../components/ui/api.js";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/category/list");
      if (!res.data?.success) throw new Error("Failed to fetch categories");
      return res.data.data; // returns array of categories
    },
  });
}
