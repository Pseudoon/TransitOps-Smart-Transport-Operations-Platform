import { api, USE_MOCKS } from "./api";
import { TripStatus } from "../utils/constants";

export interface Trip {
  id: string;
  vehicle_id: string;
  driver_id: string;
  status: TripStatus;
}

export const tripService = {
  getAll: async (params?: { status?: TripStatus }) => {
    if (USE_MOCKS) return [];
    const response = await api.get("/trips", { params });
    return response.data;
  },

  create: async (data: Omit<Trip, "id" | "status">) => {
    if (USE_MOCKS) return { ...data, id: "mock-trip", status: "Draft" };
    const response = await api.post("/trips", data);
    return response.data;
  },

  dispatch: async (id: string) => {
    if (USE_MOCKS) return { id, status: "Dispatched" };
    const response = await api.post(`/trips/${id}/dispatch`);
    return response.data;
  },

  complete: async (
    id: string,
    data: { final_odometer: number; fuel_consumed: number },
  ) => {
    if (USE_MOCKS) return { id, status: "Completed", ...data };
    const response = await api.post(`/trips/${id}/complete`, data);
    return response.data;
  },

  cancel: async (id: string) => {
    if (USE_MOCKS) return { id, status: "Cancelled" };
    const response = await api.post(`/trips/${id}/cancel`);
    return response.data;
  },
};
