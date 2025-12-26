import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import type { LoginFormData } from "../types/login.types";

export function useLoginController() {
  const { mutateAsync: login } = useMutation({
    mutationFn: authService.login,
  });

  const handleSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return {
    handleSubmit,
  };
}
