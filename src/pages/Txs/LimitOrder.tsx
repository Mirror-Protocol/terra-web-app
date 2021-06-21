import { RouteProps, useRouteMatch } from "react-router-dom"
import Page from "../../components/Page"
import CancelOrderForm from "../../forms/CancelOrderForm"
import { useLimitOrder } from "../../data/contract/order"
import routes from "../../routes"

export enum MenuKey {
  CANCEL = "Cancel order",
}

const CancelOrder = () => {
  const { params } = useRouteMatch<{ id: string }>()
  const { id } = params

  const parsed = useLimitOrder(Number(id))

  return !parsed ? null : (
    <Page>
      <CancelOrderForm order={parsed} />
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
