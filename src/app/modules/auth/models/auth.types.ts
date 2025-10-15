import * as yup from "yup";

export const LoginSchema = yup
  .object({
    username: yup.string().required("El nombre de usuario es obligatorio").default(""),
    password: yup.string().required("La contraseña es obligatoria").default(""),
  })
  .required();

export type LoginType = yup.InferType<typeof LoginSchema>;
