import { api, USE_MOCKS } from "./api";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    if (USE_MOCKS) {
      return Promise.resolve({
        token: "mock-jwt-token-12345",
        role: "Fleet Manager",
        name: "Mock User",
      });
    }
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    if (USE_MOCKS) {
      return Promise.resolve({ user_id: "mock-user-1" });
    }
    const response = await api.post("/auth/register", data);
    return response.data;
  },
};
