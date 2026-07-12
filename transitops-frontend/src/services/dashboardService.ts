import { api, USE_MOCKS } from "./api";

export const dashboardService = {
  getKPIs: async () => {
    if (USE_MOCKS) {
      return {
        active_vehicles: 12,
        available_vehicles: 8,
        vehicles_in_maintenance: 2,
        active_trips: 5,
        pending_trips: 3,
        drivers_on_duty: 6,
        fleet_utilization_pct: 75,
      };
    }
    const response = await api.get("/dashboard/kpis");
    return response.data;
  },
};
