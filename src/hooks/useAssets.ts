import { useEffect } from "react"
import { getIcon } from "../components/TokenPair"
import { useContractsAddress } from "./useContractsAddress"

const useAssets = () => {
  const { listed, listedAll } = useContractsAddress()
  const tokens = JSON.stringify(
    listedAll.reduce((acc, { symbol, name, token, status }) => {
      const suffix = status === "DELISTED" ? " (Delisted)" : ""

      return {
        ...acc,
        [token]: {
          protocol: "Mirror",
          symbol: symbol + suffix,
          name,
          token,
          icon: getIcon(symbol),
        },
      }
    }, {})
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
