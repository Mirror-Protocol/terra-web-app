import { useEffect, useState } from "react"
import { atom, useSetRecoilState } from "recoil"
import { isNil } from "ramda"

export const locationKeyState = atom({
  key: "locationKey",
  default: "",
})

export const pairPriceKeyState = atom({
  key: "pairPriceKey",
  default: 0,
})

export const usePolling = () => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
  const setPairPriceKey = useSetRecoilState(pairPriceKeyState)

  useEffect(() => {
    const id = setInterval(() => setPairPriceKey((n) => n + 1), 30000)
    setIntervalId(id)
  }, [setPairPriceKey])

  useEffect(() => {
    return () => {
      !isNil(intervalId) && clearInterval(intervalId)
    }
  }, [intervalId])
}
