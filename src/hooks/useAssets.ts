import { useEffect } from "react"
import { useProtocol } from "../data/contract/protocol"

const useAssets = () => {
  const { listed, listedAll, getIcon } = useProtocol()
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
          icon: getIcon(token).replace("images", "icon"),
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
