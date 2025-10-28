// src/app/modules/core/composables/useEstablishment.ts
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

// 🔹 CREATE
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

// 🔹 READ ALL (list paginada)
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

// 🔹 READ ONE
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

// 🔹 UPDATE
const EstablishmentUpdateFn = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: Partial<Establishment>;
}): Promise<Establishment> => {
  // Validación laxa (permite campos parciales)
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

// 🔹 DELETE
const EstablishmentDeleteFn = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`/core/establishments/${id}/`);
  } catch (error: unknown) {
    throw normalizeError(error);
  }
};

export function useEstablishment() {
  const queryClient = useQueryClient();

  // 🔸 CREATE
  const create = useMutation<Establishment, Error, EstablishmentCreate>({
    mutationKey: ["establishments", "create"],
    mutationFn: EstablishmentCreateFn,
    onError: handleError,
    onSuccess: (data) => {
      // Invalidar listado y cache individual
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
      queryClient.setQueryData(["establishments", data.id], data);
    },
  });

  // 🔸 READ ALL (reactivo con paginación)
  const list = (params: EstablishmentListParams = {}) =>
    useQuery<PaginatedResponse<Establishment>>({
      queryKey: computed(() => ["establishments", unrefParams(params)]),
      queryFn: () => EstablishmentListFn(params),
      staleTime: 1000 * 60, // cache fresco por 1 min (ajustable)
      refetchOnWindowFocus: false, // evita refetch molesto
    });

  // 🔸 READ ONE
  const get = (id: string | number) =>
    useQuery<Establishment>({
      queryKey: ["establishments", id],
      queryFn: () => EstablishmentGetFn(id),
      enabled: !!id,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    });

  // 🔸 UPDATE
  const update = useMutation<Establishment, Error, { id: string | number; payload: Partial<Establishment> }>({
    mutationKey: ["establishments", "update"],
    mutationFn: EstablishmentUpdateFn,
    onError: handleError,
    onSuccess: (data) => {
      // Actualiza cache y refetch de lista
      queryClient.setQueryData(["establishments", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
    },
  });

  // 🔸 DELETE
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

    // ✅ Exporta las funciones puras por si se necesitan fuera del contexto Vue Query
    EstablishmentCreateFn,
    EstablishmentListFn,
    EstablishmentGetFn,
    EstablishmentUpdateFn,
    EstablishmentDeleteFn,
  };
}
