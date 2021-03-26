import { Switch, Route, RouteProps, Redirect } from "react-router-dom"
import { Dictionary } from "ramda"

import Dashboard from "./pages/Dashboard"
import Info from "./pages/Info"
import Auth from "./pages/Auth"
import My from "./pages/My/My"
import Send from "./pages/Send"
import Airdrop from "./pages/Airdrop"
import Trade from "./pages/Trade"
import Mint from "./pages/Mint"
import Pool from "./pages/Pool"
import Stake from "./pages/Stake"
import Gov from "./pages/Gov"

import Auction from "./pages/Auction"
import Reward from "./pages/Reward"
import Caution from "./forms/Caution"
import Data from "./tools/Data"
import Tool from "./tools/Tool"
import LimitOrder from "./pages/LimitOrder"

export enum MenuKey {
  DASHBOARD = "Dashboard",
  INFO = "Info",
  AUTH = "Auth",
  MY = "My Page",
  SEND = "Send",
  AIRDROP = "Airdrop",
  TRADE = "Trade",
  MINT = "Mint",
  POOL = "Pool",
  STAKE = "Stake",
  GOV = "Governance",
  LIMIT = "Limit order",
}

export const omit = [
  MenuKey.DASHBOARD,
  MenuKey.AUTH,
  MenuKey.INFO,
  MenuKey.SEND,
  MenuKey.AIRDROP,
  MenuKey.LIMIT,
]

export const menu: Dictionary<RouteProps> = {
  // Not included in navigation bar
  [MenuKey.DASHBOARD]: { path: "/", exact: true, component: Dashboard },
  [MenuKey.AUTH]: { path: "/auth", component: Auth },
  [MenuKey.INFO]: { path: "/info", component: Info },
  [MenuKey.SEND]: { path: "/send", component: Send },
  [MenuKey.AIRDROP]: { path: "/airdrop", component: Airdrop },
  [MenuKey.LIMIT]: { path: "/limit", component: LimitOrder },

  // Menu
  [MenuKey.MY]: { path: "/my", component: My },
  [MenuKey.TRADE]: { path: "/trade", component: Trade },
  [MenuKey.MINT]: { path: "/mint", component: Mint },
  [MenuKey.POOL]: { path: "/pool", component: Pool },
  [MenuKey.STAKE]: { path: "/stake", component: Stake },
  [MenuKey.GOV]: { path: "/gov", component: Gov },

  // For test
  auction: { path: "/auction", component: Auction },
  reward: { path: "/reward", component: Reward },
  caution: { path: "/caution", component: Caution },

  // For developers
  data: { path: "/data", component: Data },
  tool: { path: "/tool", component: Tool },
}

export const getPath = (key: MenuKey) => menu[key].path as string

export default (routes: Dictionary<RouteProps> = menu, path: string = "") => (
  <Switch>
    {Object.entries(routes).map(([key, route]) => (
      <Route {...route} path={path + route.path} key={key} />
    ))}

    <Redirect to="/" />
  </Switch>
)
