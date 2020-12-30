import Tooltip from "../lang/Tooltip.json"
import useHash from "../libs/useHash"
import { MenuKey } from "../routes"
import Page from "../components/Page"
import TradeForm from "../forms/TradeForm"

export enum Type {
  "BUY" = "buy",
  "SELL" = "sell",
}

const Trade = () => {
  const { hash: type } = useHash<Type>(Type.BUY)
  const tab = {
    tabs: [Type.BUY, Type.SELL],
    tooltips: [Tooltip.Trade.General, Tooltip.Trade.General],
    current: type,
  }

  return (
    <Page title={MenuKey.TRADE} doc="/user-guide/getting-started/trade">
      <TradeForm type={type} tab={tab} key={type} />
    </Page>
  )
}

export default Trade
