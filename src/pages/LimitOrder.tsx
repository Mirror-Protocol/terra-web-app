import { RouteProps, useRouteMatch } from "react-router-dom"
import Page from "../components/Page"
import CancelOrderForm from "../forms/CancelOrderForm"
import { useNetwork } from "../hooks"
import routes from "../routes"
import { useQueryOrder } from "./My/useMyOrders"

export enum MenuKey {
  CANCEL = "Cancel order",
}

const CancelOrder = () => {
  const { params } = useRouteMatch<{ id: string }>()
  const { id } = params

  const { limitOrder } = useNetwork()
  const { parsed } = useQueryOrder(Number(id))

  return (
    <Page title={MenuKey.CANCEL}>
      {limitOrder && parsed && (
        <CancelOrderForm order={parsed} contract={limitOrder} />
      )}
    </Page>
  )
}

export const menu: Record<MenuKey, RouteProps> = {
  [MenuKey.CANCEL]: { path: "/:id", component: CancelOrder },
}

const LimitOrder = () => {
  const { path } = useRouteMatch()
  return routes(menu, path)
}

export default LimitOrder
