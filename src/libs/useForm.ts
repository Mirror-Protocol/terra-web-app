import { useState, ChangeEvent, FocusEvent } from "react"
import { FormGroupInterface } from "../components/FormGroup"
import { record } from "./utils"

export type Values<T extends string> = Record<T, string>
export type Touched<T extends string> = Record<T, boolean>

const useForm = <Key extends string>(
  initial: Values<Key>,
  validate: (values: Values<Key>) => Values<Key>
) => {
  const touch = record(initial, false)
  const [values, setValues] = useState<Values<Key>>(initial)
  const [touched, setTouched] = useState<Touched<Key>>(touch)
  const [focused, setFocused] = useState<Key>()
  const [changed, setChanged] = useState<Key>()

  const setValue = (key: Key, value: string) => {
    setTouched({ ...touched, [key]: true })
    setValues({ ...values, [key]: value })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setChanged(name as Key)
    setValue(name as Key, value)
  }

  const reset = () => {
    setValues(initial)
    setTouched(touch)
    setFocused(undefined)
  }

  const onFocus = (e: FocusEvent<HTMLFormElement>) => {
    setFocused(e.target.name as Key)
  }

  const onBlur = () => {
    setFocused(undefined)
  }

  const errors = validate(values)
  const invalid = Object.values(errors).some((v) => v)

  const getFields = (fields: Partial<Record<Key, FormGroupInterface>>) =>
    Object.entries<FormGroupInterface>({
      ...record(initial, {}),
      ...fields,
    }).reduce((acc, [key, field]) => {
      const defaultAttributes = {
        id: key,
        name: key,
        value: values[key as Key],
        onChange: handleChange,
        autoComplete: "off",
      }

      return {
        ...acc,
        [key]: Object.assign(
          {
            ...field,
            focused: focused === key || field.focused,
            error: touched[key as Key] ? errors[key as Key] : "",
          },
          field.input && {
            input: { ...defaultAttributes, ...field.input },
          },
          field.textarea && {
            textarea: { ...defaultAttributes, rows: 3, ...field.textarea },
          },
          field.select && {
            select: { ...defaultAttributes, ...field.select },
          }
        ),
      }
    }, {} as Record<Key, FormGroupInterface>)

  return {
    values,
    setValue,
    setValues,
    setChanged,
    handleChange,

    getFields,
    touched,
    changed,
    errors,

    invalid,
    reset,

    attrs: { onFocus, onBlur },
  }
}

export default useForm
