/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormRules } from 'element-plus'
import * as yup from 'yup'
import type { InternalRuleItem } from 'async-validator'

export const createYupValidator = (field: string, schema: yup.ObjectSchema<any>, item: any) => {
  return (_: InternalRuleItem, value: any, callback: (error?: string | Error) => void) => {
    // Validate with the current value for the field
    Promise.resolve()
      .then(() => schema.validateAt(field, { ...item.value, [field]: value }))
      .then(() => callback())
      .catch((error) => {
        if (error instanceof yup.ValidationError) {
          callback(new Error(error.message))
        } else {
          callback(new Error('Validation error'))
        }
      })
  }
}

export const createFormRules = <T extends yup.ObjectSchema<any>>(
  schema: T,
  item: any,
  options: {
    trigger?: string[]
    additionalRules?: Record<keyof yup.InferType<T>, InternalRuleItem[]>
  } = {},
) => {
  const { trigger = ['blur', 'change', 'input'], additionalRules = {} as any } = options
  return Object.keys(schema.fields).reduce((acc, field) => {
    acc[field] = [
      {
        validator: createYupValidator(field, schema, item),
        trigger,
      },
      ...(additionalRules[field] || []),
    ]
    return acc
  }, {} as FormRules)
}
