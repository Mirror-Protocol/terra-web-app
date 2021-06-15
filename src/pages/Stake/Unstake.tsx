import { useLocation } from "react-router-dom"
import Page from "../../components/Page"
import StakeForm from "../../forms/StakeForm"
import { StakeType } from "../../types/Types"

const Unstake = () => {
  const { state } = useLocation<{ token: string }>()
  const token = state.token

  return (
    <Page>
      <StakeForm type={StakeType.UNSTAKE} token={token} />
    </Page>
  )
}

export default Unstake
