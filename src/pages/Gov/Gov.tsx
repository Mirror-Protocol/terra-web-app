import { RouteProps, useRouteMatch } from "react-router-dom"
import routes from "../../routes"
import Poll from "../Poll/Poll"
import CreatePoll from "../Poll/CreatePoll"
import Vote from "../Poll/Vote"
import GovHome from "./GovHome"
import GovStake from "./GovStake"

export enum MenuKey {
  INDEX = "Gov",
  STAKE = "Stake",
  CREATE = "Create Poll",
  POLL = "Poll details",
  VOTE = "Vote",
}

export const menu: Record<MenuKey, RouteProps> = {
  [MenuKey.INDEX]: { path: "/", exact: true, component: GovHome },
  [MenuKey.STAKE]: { path: "/stake", component: GovStake },
  [MenuKey.CREATE]: { path: "/poll/create", component: CreatePoll },
  [MenuKey.VOTE]: { path: "/poll/:id/vote", component: Vote },
  [MenuKey.POLL]: { path: "/poll/:id", component: Poll },
}

const Gov = () => {
  const { path } = useRouteMatch()
  return <>{routes(menu, path)}</>
}

export default Gov
