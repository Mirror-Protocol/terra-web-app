import { useEffect } from "react"
import { atom, useSetRecoilState } from "recoil"

export const locationKeyState = atom({
  key: "locationKey",
  default: "",
})

export const pairPriceKeyState = atom({
  key: "pairPriceKey",
  default: 0,
})

export const usePolling = () => {
  const setPairPriceKey = useSetRecoilState(pairPriceKeyState)

  useEffect(() => {
    setInterval(() => setPairPriceKey((n) => n + 1), 3000)
  }, [setPairPriceKey])
}
