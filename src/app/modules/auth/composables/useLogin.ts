import { useMutation } from "@tanstack/vue-query";
import { api } from "@/shared/config/axios";
import { LoginSchema, type LoginType } from "../models/auth.types";
import {
  normalizeError,
  useApiErrorHandler,
} from "@/shared/utils/useApiErrorHandler";
import { useAuthToken } from "./useAuthToken";
const { handleError } = useApiErrorHandler();
const { setTokens } = useAuthToken();

const loginFn = async (payload: LoginType): Promise<any> => {
  await LoginSchema.validate(payload);

  try {
    const { data } = await api.post("/login/", payload);
    setTokens(data.access_token, data.refresh_token);
    return data;
  } catch (error: any) {
    throw normalizeError(error);
  }
};

export function useLogin() {
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginFn,
    onError: handleError,
  });

  return {
    ...mutation,
  };
}
