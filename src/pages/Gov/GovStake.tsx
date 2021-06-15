import useHash from "../../libs/useHash"
import { useProtocol } from "../../data/contract/protocol"
import Tab from "../../components/Tab"
import StakeForm from "../../forms/StakeForm"
import { StakeType } from "../../types/Types"
import Page from "../../components/Page"

const GovStake = () => {
  const { getToken } = useProtocol()
  const token = getToken("MIR")
  const { hash: type } = useHash<StakeType>(StakeType.STAKE)

  return (
    <Page>
      <Tab tabs={[StakeType.STAKE, StakeType.UNSTAKE]} current={type}>
        <StakeForm type={type} token={token} key={type} gov />
      </Tab>
    </Page>
  )
}

export default GovStake
