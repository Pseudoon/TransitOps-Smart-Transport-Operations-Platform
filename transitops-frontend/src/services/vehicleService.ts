import { api, USE_MOCKS } from "./api";
import type { VehicleStatus } from "@/utils/constants";

export const vehicleService = {
  getAll: async (params?: {
    status?: VehicleStatus;
    type?: string;
    region?: string;
  }) => {
    if (USE_MOCKS) return [];
    const response = await api.get("/vehicles", { params });
    return response.data;
  },

  getAvailable: async () => {
    if (USE_MOCKS) return [];
    const response = await api.get("/vehicles/available");
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    if (USE_MOCKS) return { ...data, id: "mock-id" };
    const response = await api.post("/vehicles", data);
    return response.data;
  },

  update: async (id: string, data: Record<string, unknown>) => {
    if (USE_MOCKS) return { ...data, id };
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    if (USE_MOCKS) return true;
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
};
