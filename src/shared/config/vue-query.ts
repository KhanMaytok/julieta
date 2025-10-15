// src/shared/config/vue-query.ts
import { QueryClient } from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // tus tiempos de caché preferidos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export { queryClient }
