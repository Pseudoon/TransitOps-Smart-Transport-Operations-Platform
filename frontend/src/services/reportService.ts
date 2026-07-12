import { api, USE_MOCKS } from "./api";

export const reportService = {
  getFuelEfficiency: async () => {
    if (USE_MOCKS) return [];
    const response = await api.get("/reports/fuel-efficiency");
    return response.data;
  },

  getOperationalCost: async () => {
    if (USE_MOCKS) return [];
    const response = await api.get("/reports/operational-cost");
    return response.data;
  },

  getROI: async () => {
    if (USE_MOCKS) return [];
    const response = await api.get("/reports/roi");
    return response.data;
  },

  exportCSV: async () => {
    if (USE_MOCKS) return;
    const response = await api.get("/reports/export-csv", {
      responseType: "blob",
    });
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
