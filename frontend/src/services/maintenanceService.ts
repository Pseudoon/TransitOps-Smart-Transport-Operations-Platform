import { api, USE_MOCKS } from "./api";

export interface MaintenanceLog {
  id: string;
  vehicle_id: string;
  description: string;
  status: "Open" | "Closed";
}

export const maintenanceService = {
  getAll: async (params?: { vehicle_id?: string }) => {
    if (USE_MOCKS) return [];
    const response = await api.get("/maintenance", { params });
    return response.data;
  },

  create: async (data: Omit<MaintenanceLog, "id" | "status">) => {
    if (USE_MOCKS) return { ...data, id: "mock-log", status: "Open" };
    const response = await api.post("/maintenance", data);
    return response.data;
  },

  close: async (id: string) => {
    if (USE_MOCKS) return { id, status: "Closed" };
    const response = await api.put(`/maintenance/${id}/close`);
    return response.data;
  },
};
