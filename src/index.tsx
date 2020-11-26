import { StrictMode } from "react"
import { render } from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import "./index.scss"
import ScrollToTop from "./layouts/ScrollToTop"
import Network from "./layouts/Network"
import Contract from "./layouts/Contract"
import App from "./layouts/App"

render(
  <StrictMode>
    <Network>
      <Contract>
        <Router>
          <ScrollToTop />
          <App />
        </Router>
      </Contract>
    </Network>
  </StrictMode>,
  document.getElementById("mirror")
)
