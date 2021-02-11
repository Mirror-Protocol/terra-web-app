import { useNetwork, useTerraAssets } from "../hooks"
import { MenuKey } from "../routes"
import Page from "../components/Page"
import SendForm from "../forms/SendForm"

const Send = () => {
  const tab = { tabs: [MenuKey.SEND], current: MenuKey.SEND }
  const shuttleList = useShuttleList()

  return (
    <Page title={MenuKey.SEND}>
      {shuttleList && <SendForm tab={tab} shuttleList={shuttleList} />}
    </Page>
  )
}

export default Send

/* hook */
const useShuttleList = (): ShuttleList | undefined => {
  const { data: ethereum } = useTerraAssets("/shuttle/eth.json")
  const { data: bsc } = useTerraAssets("/shuttle/bsc.json")
  const { name } = useNetwork()

  return ethereum && bsc && { ethereum: ethereum[name], bsc: bsc[name] }
}
