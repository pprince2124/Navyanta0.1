// src/hooks/useServices.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../components/ui/api.js";
export function useServices({ categoryId, page = 1, limit = 12 } = {}) {
  return useQuery({
    queryKey: ["services", { categoryId, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      params.append("page", page);
      params.append("limit", limit);

      const res = await api.get(`/service/list?${params.toString()}`);
      if (!res.data?.success) throw new Error("Failed to fetch services");

      return {
        items: res.data.data || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        limit: res.data.limit || limit,
      };
    },
  });
}
