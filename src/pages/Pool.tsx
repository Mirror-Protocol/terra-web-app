import Tooltip from "../lang/Tooltip.json"
import useHash from "../libs/useHash"
import { MenuKey } from "../routes"
import Page from "../components/Page"
import PoolForm from "../forms/PoolForm"

export enum Type {
  "PROVIDE" = "provide",
  "WITHDRAW" = "withdraw",
}

const Pool = () => {
  const { hash: type } = useHash<Type>(Type.PROVIDE)
  const tab = {
    tabs: [Type.PROVIDE, Type.WITHDRAW],
    tooltips: [Tooltip.Pool.Provide, Tooltip.Pool.Withdraw],
    current: type,
  }

  return (
    <Page title={MenuKey.POOL} doc="/user-guide/getting-started/pool">
      {type && <PoolForm type={type} tab={tab} key={type} />}
    </Page>
  )
}

export default Pool
