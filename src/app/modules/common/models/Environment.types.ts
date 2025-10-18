import * as yup from "yup";

const locationSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  children: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        name: yup.string().required(),
        children: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required(),
              name: yup.string().required(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export const environmentsSchema = yup.object({
  location: yup.array().of(yup.string()).min(1, 'La ubicación es obligatoria').required('La ubicación es obligatoria').default([]),
});

export type Environment = yup.InferType<typeof environmentsSchema>;
export type Location = yup.InferType<typeof locationSchema>;
