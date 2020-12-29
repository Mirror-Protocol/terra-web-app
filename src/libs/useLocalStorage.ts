import { useCallback, useState } from "react"

export type LocalStorage<T> = [T, (value: T | ((val: T) => T)) => void]

const useLocalStorage = <T>(key: string, initial?: T): LocalStorage<T> => {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initial
    } catch (error) {
      console.error(error)
      return initial
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const next = value instanceof Function ? value(stored) : value
        setStored(next)
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch (error) {
        console.error(error)
      }
    },
    [key, stored]
  )

  return [stored, setValue]
}

export default useLocalStorage
