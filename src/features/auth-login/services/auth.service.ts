import type { LoginFormData } from "../types/login.types";

export const authService = {
  async login(_data: LoginFormData) {
    // TODO: Implement actual API call
    // const response = await apiClient.post('/auth/login', data);
    // return response.data;
    return Promise.resolve({ success: true });
  },
};
