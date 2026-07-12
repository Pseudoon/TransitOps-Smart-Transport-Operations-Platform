import { api, USE_MOCKS } from "./api";

export const fuelExpenseService = {
  getFuelLogs: async () => {
    if (USE_MOCKS) return [];
    const response = await api.get("/fuel-logs");
    return response.data;
  },

  createFuelLog: async (data: Record<string, unknown>) => {
    if (USE_MOCKS) return { ...data, id: "mock-fuel" };
    const response = await api.post("/fuel-logs", data);
    return response.data;
  },

  getExpenses: async () => {
    if (USE_MOCKS) return [];
    const response = await api.get("/expenses");
    return response.data;
  },

  createExpense: async (data: Record<string, unknown>) => {
    if (USE_MOCKS) return { ...data, id: "mock-exp" };
    const response = await api.post("/expenses", data);
    return response.data;
  },
};
