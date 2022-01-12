import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"

import Swap from "./pages/Swap"
import Dashboard from "./pages/Dashboard"
import PairPage from "./pages/Dashboard/Pair"

export default () => (
  <Switch>
    <Route exact path="/" component={Swap} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/pairs/:address" component={PairPage} />
    <Redirect to="/" />
  </Switch>
)
