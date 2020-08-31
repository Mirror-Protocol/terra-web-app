import { MIR } from "../../constants"
import useHash from "../../libs/useHash"
import { useContractsAddress } from "../../hooks"
import Page from "../../components/Page"
import StakeForm from "../../forms/StakeForm"
import { Type } from "../Stake"
import { MenuKey } from "../Gov"

const GovStake = () => {
  const { getToken } = useContractsAddress()
  const token = getToken(MIR)
  const { hash: type } = useHash<Type>(Type.STAKE)
  const tab = { tabs: [Type.STAKE, Type.UNSTAKE], current: type }

  return (
    <Page title={MenuKey.STAKE}>
      {type && <StakeForm type={type} token={token} tab={tab} key={type} gov />}
    </Page>
  )
}

export default GovStake
