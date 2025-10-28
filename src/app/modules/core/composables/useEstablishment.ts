interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/shared/config/axios";
import { type Establishment, type EstablishmentCreate, establishmentFormSchema } from "@/app/modules/core/models/Establishment.types";
import { normalizeError, useApiErrorHandler } from "@/shared/utils/useApiErrorHandler";
import { type Ref } from "vue";
import { unrefParams } from "@/shared/utils/composableHelpers";

const { handleError } = useApiErrorHandler();

interface EstablishmentListParams {
  page?: Ref<number> | number;
  page_size?: Ref<number> | number;
  search?: Ref<string> | string | null;
}


// CREATE
const EstablishmentCreateFn = async (payload: EstablishmentCreate): Promise<any> => {
  await establishmentFormSchema.validate(payload);
  try {
    const { data } = await api.post("/core/establishments/", payload);
    return data;
  } catch (error: any) {
    throw normalizeError(error);
  }
};

const EstablishmentListFn = async (params: EstablishmentListParams = {}): Promise<PaginatedResponse<Establishment>> => {
  try {
    const resolved = unrefParams({page: params.page ?? 1, page_size: params.page_size ?? 10,  search: params.search ?? null});
    const { data } = await api.get("/core/establishments/", { params: resolved });
    return data as PaginatedResponse<Establishment>;
  } catch (error: any) {
    throw normalizeError(error);
  }
};

const EstablishmentGetFn = async (id: string | number): Promise<Establishment> => {
  try {
    const { data } = await api.get(`/core/establishments/${id}/`);
    return data;
  } catch (error: any) {
    throw normalizeError(error);
  }
};

// UPDATE
const EstablishmentUpdateFn = async ({ id, payload }: { id: string | number, payload: Partial<Establishment> }): Promise<Establishment> => {
  await establishmentFormSchema.validate(payload);
  try {
    const { data } = await api.put(`/core/establishments/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw normalizeError(error);
  }
};

// DELETE
const EstablishmentDeleteFn = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`/core/establishments/${id}/`);
  } catch (error: any) {
    throw normalizeError(error);
  }
};

export function useEstablishment() {
  const queryClient = useQueryClient();

  // CREATE
  const create = useMutation({
    mutationKey: ["establishments-create"],
    mutationFn: EstablishmentCreateFn,
    onError: handleError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
    },
  });


  // READ ALL (with pagination params)
  const list = (params: EstablishmentListParams = {}) =>
    useQuery({
      queryKey: ["establishments", params],
      queryFn: () => EstablishmentListFn(params),
    });

  // READ ONE (returns a function to fetch by id)
  const get = (id: string | number) =>
    useQuery({
      queryKey: ["establishments", id],
      queryFn: () => EstablishmentGetFn(id),
      enabled: !!id,
    });

  // UPDATE
  const update = useMutation({
    mutationKey: ["establishments-update"],
    mutationFn: EstablishmentUpdateFn,
    onError: handleError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
    },
  });

  // DELETE
  const remove = useMutation({
    mutationKey: ["establishments-delete"],
    mutationFn: EstablishmentDeleteFn,
    onError: handleError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["establishments"] });
    },
  });

  return {
    create,
    list,
    get,
    update,
    remove,
  };
}
