import { useRouteMatch } from "react-router-dom"
import { gt } from "../../libs/math"
import { useContract, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import Page from "../../components/Page"
import LinkButton from "../../components/LinkButton"
import { menu, MenuKey } from "../Stake"
import StakeHomeHeader from "./StakeHomeHeader"
import StakeList from "./StakeList"

const StakeHome = () => {
  const { url } = useRouteMatch()
  const { rewards } = useContract()
  useRefetch([BalanceKey.REWARD, BalanceKey.LPSTAKED])

  const link = {
    to: url + menu[MenuKey.CLAIMALL].path,
    children: MenuKey.CLAIMALL,
    disabled: !gt(rewards, 0),
    outline: true,
  }

  return (
    <Page
      title={MenuKey.INDEX}
      description={<StakeHomeHeader />}
      doc="/user-guide/getting-started/stake"
      action={<LinkButton {...link} />}
    >
      <StakeList />
    </Page>
  )
}

export default StakeHome
