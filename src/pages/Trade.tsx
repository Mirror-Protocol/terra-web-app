import React from "react"
import { MenuKey } from "../routes"
import Page from "../components/Page"
import TradeForm from "../forms/TradeForm"
import useHash from "./useHash"

export enum Type {
  "BUY" = "buy",
  "SELL" = "sell",
}

const Trade = () => {
  const { hash: type } = useHash<Type>(Type.BUY)
  const tab = { tabs: [Type.BUY, Type.SELL], current: type }

  return (
    <Page title={MenuKey.TRADE}>
      <TradeForm type={type} tab={tab} key={type} />
    </Page>
  )
}

export default Trade
