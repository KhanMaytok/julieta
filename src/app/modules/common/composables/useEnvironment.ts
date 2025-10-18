import { api } from '@/shared/config/axios'
import { useQuery } from '@tanstack/vue-query'

export function useEnvironment() {
  const fetchEnvironment = async () => {
    const { data } = await api.get('/common/environments/')
    return data
  }

  const query = useQuery({
    queryKey: ['environment'],
    queryFn: fetchEnvironment,
  })

  return query
}
