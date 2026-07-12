import { api, USE_MOCKS } from "./api";
import { DriverStatus } from "../utils/constants";

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
}

export const driverService = {
  getAll: async (params?: { status?: DriverStatus }) => {
    if (USE_MOCKS) {
      return Promise.resolve([]);
    }
    const response = await api.get("/drivers", { params });
    return response.data;
  },

  getAvailable: async () => {
    if (USE_MOCKS) {
      return Promise.resolve([]);
    }
    const response = await api.get("/drivers/available");
    return response.data;
  },

  create: async (data: Omit<Driver, "id">) => {
    if (USE_MOCKS) {
      return Promise.resolve({ ...data, id: "mock-id" });
    }
    const response = await api.post("/drivers", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Driver>) => {
    if (USE_MOCKS) {
      return Promise.resolve({ ...data, id });
    }
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    if (USE_MOCKS) {
      return Promise.resolve(true);
    }
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  },
};
