import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"

import Swap from "./pages/Swap"

export default () => (
  <Switch>
    <Route exact path="/" component={Swap} />
    <Redirect to="/" />
  </Switch>
)
