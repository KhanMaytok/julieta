import { unref, type Ref } from "vue";

export const unrefParams = <T extends Record<string, any>>(obj: T): {
  [K in keyof T]: T[K] extends Ref<infer U> ? U : T[K];
} => {
  const result = {} as any;
  for (const key in obj) {
    result[key] = unref(obj[key]);
  }
  return result;
};
