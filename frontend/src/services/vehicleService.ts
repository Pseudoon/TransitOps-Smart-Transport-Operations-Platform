import { api, USE_MOCKS } from "./api";
import { VehicleStatus } from "../utils/constants";

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: VehicleStatus;
  region: string;
  max_load: number;
}

export const vehicleService = {
  getAll: async (params?: {
    status?: VehicleStatus;
    type?: string;
    region?: string;
  }) => {
    if (USE_MOCKS) {
      return Promise.resolve([]);
    }
    const response = await api.get("/vehicles", { params });
    return response.data;
  },

  getAvailable: async () => {
    if (USE_MOCKS) {
      return Promise.resolve([]);
    }
    const response = await api.get("/vehicles/available");
    return response.data;
  },

  create: async (data: Omit<Vehicle, "id">) => {
    if (USE_MOCKS) {
      return Promise.resolve({ ...data, id: "mock-id" });
    }
    const response = await api.post("/vehicles", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Vehicle>) => {
    if (USE_MOCKS) {
      return Promise.resolve({ ...data, id });
    }
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    if (USE_MOCKS) {
      return Promise.resolve(true);
    }
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
};
