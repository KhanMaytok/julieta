import { useMutation } from '@tanstack/vue-query'
import {api} from '@/shared/config/axios'
import {LoginSchema, type LoginType } from '../models/auth.types'


const loginFn = async (payload: LoginType): Promise<any> => {
  await LoginSchema.validate(payload)
  const { data } = await api.post('/login/', payload)
  return data
}

export function useLogin() {
  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: loginFn,
  })

  return {
    ...mutation,
  }
}
