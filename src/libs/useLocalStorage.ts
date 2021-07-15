import { Dispatch, SetStateAction, useCallback, useState } from "react"

export type LocalStorage<T> = [T, Dispatch<SetStateAction<T>>]

const useLocalStorage = <T>(
  key: string,
  initial: T | (() => T)
): LocalStorage<T> => {
  const init = () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initial
    } catch (error) {
      console.error(error)
      return initial
    }
  }

  const [stored, setStored] = useState<T>(init)

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const next = value instanceof Function ? value(stored) : value
        window.localStorage.setItem(key, JSON.stringify(next))
        setStored(next)
      } catch (error) {
        console.error(error)
      }
    },
    [key, stored]
  )

  return [stored, setValue]
}

export default useLocalStorage
