import { useParams } from "react-router-dom"
import useHash from "../../libs/useHash"
import { useContractsAddress } from "../../hooks"
import Page from "../../components/Page"
import StakeDetailsHeader from "../../components/StakeDetailsHeader"
import StakeForm from "../../forms/StakeForm"
import { Type } from "../Stake"

const StakeDetails = () => {
  const { token } = useParams<{ token: string }>()
  const { getSymbol, getIsDelisted } = useContractsAddress()
  const initial = getIsDelisted(token) ? Type.UNSTAKE : Type.STAKE
  const { hash: type } = useHash<Type>(initial)

  const tab = getIsDelisted(token)
    ? undefined
    : { tabs: [Type.STAKE, Type.UNSTAKE], current: type }

  return (
    <Page title={<StakeDetailsHeader>{getSymbol(token)}</StakeDetailsHeader>}>
      {type && <StakeForm type={type} token={token} tab={tab} key={type} />}
    </Page>
  )
}

export default StakeDetails
