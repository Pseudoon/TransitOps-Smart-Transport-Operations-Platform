import { api, USE_MOCKS } from "./api";
import type { DriverStatus } from "@/utils/constants";

export const driverService = {
  getAll: async (params?: { status?: DriverStatus }) => {
    if (USE_MOCKS) return [];
    const response = await api.get("/drivers", { params });
    return response.data;
  },

  getAvailable: async () => {
    if (USE_MOCKS) return [];
    const response = await api.get("/drivers/available");
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    if (USE_MOCKS) return { ...data, id: "mock-id" };
    const response = await api.post("/drivers", data);
    return response.data;
  },

  update: async (id: string, data: Record<string, unknown>) => {
    if (USE_MOCKS) return { ...data, id };
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    if (USE_MOCKS) return true;
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  },
};
