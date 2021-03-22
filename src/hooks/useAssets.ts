import { useEffect } from "react"
import { getIcon } from "../components/TokenPair"
import { useContractsAddress } from "./useContractsAddress"

const useAssets = () => {
  const { listed } = useContractsAddress()
  const tokens = JSON.stringify(
    listed.reduce(
      (acc, { symbol, token }) => ({
        ...acc,
        [token]: { symbol, token, icon: getIcon(symbol) },
      }),
      {}
    )
  )

  const pairs = JSON.stringify(
    listed.reduce(
      (acc, { token, pair }) => ({
        ...acc,
        [pair]: ["uusd", token],
      }),
      {}
    )
  )

  useEffect(() => {
    ;[tokens, pairs].forEach((str) => console.log(str))
  }, [tokens, pairs])
}

export default useAssets
