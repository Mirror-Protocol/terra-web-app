import useHash from "../../libs/useHash"
import { TradeType } from "../../types/Types"
import TradeForm from "../../forms/TradeForm"
import Tab from "../../components/Tab"
import Page from "../../components/Page"
import MarketList from "./MarketList"

const Trade = () => {
  const { hash: type } = useHash<TradeType>()
  return (
    <Page title="Trade">
      {!type ? (
        <MarketList />
      ) : (
        <Tab tabs={[TradeType.BUY, TradeType.SELL]} current={type}>
          <TradeForm type={type} key={type} />
        </Tab>
      )}
    </Page>
  )
}

export default Trade
