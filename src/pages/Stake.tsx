import { RouteProps, useRouteMatch } from "react-router-dom"
import routes from "../routes"
import Claim from "./Stake/Claim"
import StakeDetails from "./Stake/StakeDetails"
import StakeHome from "./Stake/StakeHome"

export enum MenuKey {
  INDEX = "Stake",
  CLAIMALL = "Claim all rewards",
  CLAIMSYMBOL = "Claim",
  DETAILS = "Stake Details",
}

export const menu: Record<MenuKey, RouteProps> = {
  [MenuKey.INDEX]: { path: "/", exact: true, component: StakeHome },
  [MenuKey.CLAIMALL]: { path: "/claim", component: Claim },
  [MenuKey.CLAIMSYMBOL]: { path: "/:token/claim", component: Claim },
  [MenuKey.DETAILS]: { path: "/:token", component: StakeDetails },
}

export enum Type {
  "STAKE" = "stake",
  "UNSTAKE" = "unstake",
}

const Stake = () => {
  const { path } = useRouteMatch()
  return routes(menu, path)
}

export default Stake
