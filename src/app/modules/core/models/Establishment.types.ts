import * as yup from 'yup'


export const establishmentFormSchema = yup
  .object({
    id: yup.number().optional().notRequired(),
    name: yup.string().required('El nombre es obligatorio').default(''),
    address: yup.string().required('La dirección es obligatoria').default(''),
    email: yup.string().email('Formato inválido').nullable().notRequired().default(null),
    telephone: yup.string().nullable().optional().notRequired().default(null),
    location: yup.string().required('La ubicación es obligatoria').default(''),
    has_internet_sales: yup.boolean().required().default(true),
    has_courier: yup.boolean().required().default(false),
    code: yup.string().nullable().notRequired().default(null),
  })
  .required()

export type Establishment = yup.InferType<typeof establishmentFormSchema>
export type EstablishmentCreate = Establishment & {
  department?: string
  province?: string
  district?: string
}
