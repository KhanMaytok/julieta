import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/shared/config/axios";
import {
  type Establishment,
  type EstablishmentCreate,
  establishmentFormSchema,
} from "@/app/modules/core/models/Establishment.types";
import {
  normalizeError,
  useApiErrorHandler,
} from "@/shared/utils/useApiErrorHandler";
import { type Ref, computed } from "vue";
import { unrefParams, type PaginatedResponse } from "@/shared/utils/composableHelpers";

const { handleError } = useApiErrorHandler();

interface EstablishmentListParams {
  page?: Ref<number> | number;
  page_size?: Ref<number> | number;
  search?: Ref<string> | string | null;
}

const EstablishmentCreateFn = async (
  payload: EstablishmentCreate
): Promise<Establishment> => {
  await establishmentFormSchema.validate(payload);
  try {
    const { data } = await api.post("/core/establishments/", payload);
    return data;
  } catch (error: unknown) {
    throw normalizeError(error);
  }
};

const EstablishmentListFn = async (
  params: EstablishmentListParams = {}
): Promise<PaginatedResponse<Establishment>> => {
  try {
    const resolved = unrefParams({
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
      search: params.search ?? null,
    });
    const { data } = await api.get("/core/establishments/", { params: resolved });
    return data as PaginatedResponse<Establishment>;
  } catch (error: unknown) {
    throw normalizeError(error);
  }
};

const EstablishmentGetFn = async (
  id: string | number
): Promise<Establishment> => {
  try {
    const { data } = await api.get(`/core/establishments/${id}/`);
    return data;
  } catch (error: unknown) {
    throw normalizeError(error);
  }
};

const EstablishmentUpdateFn = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: Partial<Establishment>;
}): Promise<Establishment> => {
  await establishmentFormSchema.validate(payload, {
    abortEarly: false,
    strict: false,
  });
  try {
    const { data } = await api.put(`/core/establishments/${id}/`, payload);
    return data;
  } catch (error: unknown) {
    throw normalizeError(error);
  }
};

const EstablishmentDeleteFn = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`/core/establishments/${id}/`);
  } catch (error: unknown) {
    throw normalizeError(error);
  }
};

export function useEstablishment() {
  const queryClient = useQueryClient();

  const create = useMutation<Establishment, Error, EstablishmentCreate>({
    mutationKey: ["establishments", "create"],
    mutationFn: EstablishmentCreateFn,
    onError: handleError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
      queryClient.setQueryData(["establishments", data.id], data);
    },
  });


  const list = (params: EstablishmentListParams = {}) =>
    useQuery<PaginatedResponse<Establishment>>({
      queryKey: computed(() => ["establishments", unrefParams(params)]),
      queryFn: () => EstablishmentListFn(params),
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    });


  const get = (id: string | number) =>
    useQuery<Establishment>({
      queryKey: ["establishments", id],
      queryFn: () => EstablishmentGetFn(id),
      enabled: !!id,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    });

  const update = useMutation<Establishment, Error, { id: string | number; payload: Partial<Establishment> }>({
    mutationKey: ["establishments", "update"],
    mutationFn: EstablishmentUpdateFn,
    onError: handleError,
    onSuccess: (data) => {
      queryClient.setQueryData(["establishments", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
    },
  });

  const remove = useMutation<void, Error, string | number>({
    mutationKey: ["establishments", "delete"],
    mutationFn: EstablishmentDeleteFn,
    onError: handleError,
    onSuccess: (_, id) => {
      // Remueve del cache
      queryClient.removeQueries({ queryKey: ["establishments", id] });
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
    },
  });

  return {
    create,
    list,
    get,
    update,
    remove,
    EstablishmentCreateFn,
    EstablishmentListFn,
    EstablishmentGetFn,
    EstablishmentUpdateFn,
    EstablishmentDeleteFn,
  };
}
