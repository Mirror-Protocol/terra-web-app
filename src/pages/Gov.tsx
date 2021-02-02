import { RouteProps, useRouteMatch } from "react-router-dom"
import routes from "../routes"
import { GovProvider, useGovContext } from "../graphql/useGov"
import { GovStateProvider, useGovStateState } from "../graphql/useGov"
import GovHome from "./Gov/GovHome"
import GovStake from "./Gov/GovStake"
import Poll from "./Poll/Poll"
import CreatePoll from "./Poll/CreatePoll"
import Vote from "./Poll/Vote"

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
  const value = useGovContext()
  const { path } = useRouteMatch()
  return <GovProvider value={value}>{routes(menu, path)}</GovProvider>
}

const GovContainer = () => {
  const { parsed } = useGovStateState()
  return !parsed ? null : (
    <GovStateProvider value={parsed}>
      <Gov />
    </GovStateProvider>
  )
}

export default GovContainer
