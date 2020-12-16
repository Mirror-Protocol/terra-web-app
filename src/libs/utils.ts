import { is } from "ramda"

/* object */
export const record = <T, V>(
  object: T,
  value: V,
  skip?: (keyof T)[]
): Record<keyof T, V> =>
  Object.keys(object).reduce(
    (acc, cur) =>
      Object.assign({}, acc, {
        [cur]: skip?.includes(cur as keyof T) ? object[cur as keyof T] : value,
      }),
    {} as Record<keyof T, V>
  )

export const omitEmpty = (object: object): object =>
  Object.entries(object).reduce((acc, [key, value]) => {
    const next = is(Object, value) ? omitEmpty(value) : value
    const valid = Number.isFinite(value) || value
    return Object.assign({}, acc, valid && { [key]: next })
  }, {})

/* array */
export const insertIf = <T>(condition?: any, ...elements: T[]) =>
  condition ? elements : []

/* string */
export const getLength = (text: string) => new Blob([text]).size
export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.slice(1)
