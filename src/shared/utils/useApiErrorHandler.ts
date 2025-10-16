import { ElNotification } from "element-plus";

export interface ApiError {
  code: number;
  codestring: string;
  message: string;
  meta?: Record<string, any>;
}

export function isApiError(error: any): error is ApiError {
  return (
    error &&
    typeof error === "object" &&
    typeof error.code === "number" &&
    typeof error.codestring === "string" &&
    typeof error.message === "string"
  );
}

export function useApiErrorHandler() {
  /**
   * Maneja cualquier error proveniente de una mutation o query
   */
  const handleError = (error: unknown) => {
    console.log('Handling error:', error);
    if (isApiError(error)) {
      ElNotification.error({
        title: error.codestring || 'Error',
        message: error.message || 'Ha ocurrido un error en el servidor.',
      })
      console.warn(`[API ERROR] ${error.codestring}: ${error.message}`, error.meta)
    } else {
      console.log('Error is not ApiError:', error);
      const err = error as Error
      ElNotification.error({
        title: 'Error inesperado',
        message: err.message || 'No se pudo conectar con el servidor.',
      })
      console.error('[UNHANDLED ERROR]', err)
    }
  }

  return {
    handleError,
  }
}

export function normalizeError(error: any): ApiError {
  if (isApiError(error?.response?.data.error)) return error?.response?.data?.error;
  if (error.response?.data) {
    const data = error.response.data
    return {
      code: data.code || error.response.status || 9999,
      codestring: data.codestring || 'API_ERROR',
      message: data.message || 'Error desconocido en el servidor',
    }
  }

  return {
    code: 9999,
    codestring: 'UNKNOWN_ERROR',
    message: error.message || 'Error inesperado en la conexión',
  }
}
