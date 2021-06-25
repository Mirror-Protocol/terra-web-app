import { useLocation } from "react-router-dom"
import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import StakeForm from "../../forms/StakeForm"
import { StakeType } from "../../types/Types"

const Stake = () => {
  const { hash: type } = useHash<StakeType>()
  const { state } = useLocation<{ token: string }>()
  const token = state.token

  return <Page>{type && <StakeForm type={type} token={token} />}</Page>
}

export default Stake
