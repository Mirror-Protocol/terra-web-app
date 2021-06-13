import { useCallback } from "react"
import { useNetwork } from "../hooks"

const toQueryMsg = (msg: string) => {
  try {
    return JSON.stringify(JSON.parse(msg))
  } catch (error) {
    return ""
  }
}

export default () => {
  const { fcd } = useNetwork()
  const getUrl = useCallback(
    (contract: string, msg: string | object) => {
      const query_msg =
        typeof msg === "string"
          ? toQueryMsg(msg)
          : encodeURIComponent(JSON.stringify(msg))
      return `${fcd}/wasm/contracts/${contract}/store?query_msg=${query_msg}`
    },
    [fcd]
  )
  return getUrl
}
