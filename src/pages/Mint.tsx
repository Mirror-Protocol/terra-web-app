import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Tooltip from "../lang/Tooltip.json"
import { MenuKey } from "../routes"
import useHash from "../libs/useHash"
import { useContractsAddress, useRefetch } from "../hooks"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import { useLazyContractQuery } from "../graphql/useContractQuery"
import Page from "../components/Page"
import MintForm from "../forms/MintForm"

export enum Type {
  "OPEN" = "open",
  "CLOSE" = "close",
  "DEPOSIT" = "deposit",
  "WITHDRAW" = "withdraw",
  "CUSTOM" = "custom",
}

const Mint = () => {
  const keys = [PriceKey.ORACLE, AssetInfoKey.MINCOLLATERALRATIO]
  useRefetch(keys)

  const { contracts } = useContractsAddress()

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
  const { result, parsed } = useLazyContractQuery<MintPosition>({
    contract: contracts["mint"],
    msg: { position: { position_idx: idx } },
  })

  const { load, refetch } = result
  useEffect(() => {
    idx && (refetch?.() ?? load())
  }, [idx, load, refetch])

  const props = { type, tab }

  return (
    <Page title={MenuKey.MINT} doc="/user-guide/getting-started/mint-and-burn">
      {(!idx || parsed) && <MintForm position={parsed} {...props} key={type} />}
    </Page>
  )
}

export default Mint
