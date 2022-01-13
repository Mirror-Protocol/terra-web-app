import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"

import Swap from "./pages/Swap"
import Dashboard from "./pages/Dashboard"
import PairPage from "./pages/Dashboard/Pair"

export default () => (
  <Switch>
    <Route exact path="/" component={Dashboard} />
    <Route exact path="/swap" component={Swap} />
    <Route exact path="/pairs/:address" component={PairPage} />
    <Redirect to="/" />
  </Switch>
)
