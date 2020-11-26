import { MenuKey } from "../../routes"
import TabCard from "../../components/TabCard"
import HistoryList from "./HistoryList"

const History = () => {
  const types = [
    MenuKey.TRADE,
    MenuKey.MINT,
    MenuKey.POOL,
    MenuKey.STAKE,
    MenuKey.GOV,
  ]

  return <TabCard tabs={types}>{(tab) => <HistoryList type={tab} />}</TabCard>
}

export default History
