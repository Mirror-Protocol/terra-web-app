import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { MenuKey } from "../routes"
import { insertIf } from "../libs/utils"
import useHash from "../libs/useHash"
import { useRefetch } from "../hooks"
import { useContract } from "../hooks/useContract"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import { AccountInfoKey } from "../hooks/contractKeys"
import Page from "../components/Page"
import MintForm from "../forms/MintForm"

export enum Type {
  "OPEN" = "open",
  "CLOSE" = "close",
  "DEPOSIT" = "deposit",
  "WITHDRAW" = "withdraw",
}

const Mint = () => {
  const { isClosed } = useLatest()

  /* type */
  const { hash: type } = useHash<Type>(Type.OPEN)
  const tab = [Type.DEPOSIT, Type.WITHDRAW].includes(type)
    ? { tabs: [Type.DEPOSIT, Type.WITHDRAW], current: type }
    : {
        tabs: [type],
        tooltips: type === Type.OPEN ? [Tooltip.Mint.Open] : undefined,
        current: type,
      }

  /* idx */
  const { search } = useLocation()
  const idx = new URLSearchParams(search).get("idx") || undefined

  // If idx exists, positions and prices are needed to initialize the ratio in form.
  const keys = [
    ...insertIf(idx, AccountInfoKey.MINTPOSITIONS),
    PriceKey.ORACLE,
    AssetInfoKey.MINCOLLATERALRATIO,
  ]

  useRefetch(keys)
  const { result } = useContract()

  /* latest price */
  const message = isClosed
    ? MESSAGE.Form.Validate.LastestPrice.Closed
    : undefined

  const props = { type, tab, message }

  return (
    <Page title={MenuKey.MINT} doc="/user-guide/getting-started/mint-and-burn">
      {(!idx || keys.every((key) => result[key].data)) && (
        <MintForm idx={idx} {...props} key={type} />
      )}
    </Page>
  )
}

export default Mint

/* hook */
const useLatest = () => {
  const [isClosed, setClosed] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const load = async () => {
      try {
        const url = "https://price.mirror.finance/latest"
        const response = await fetch(url)
        const json: { marketStatus: "OPEN" | "CLOSED" } = await response.json()
        setClosed(json.marketStatus === "CLOSED")
      } catch (error) {
        setError(error)
      }
    }

    load()
  }, [])

  return { isClosed, error }
}
