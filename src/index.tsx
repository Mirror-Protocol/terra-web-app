import { StrictMode } from "react"
import { render } from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import * as Sentry from "@sentry/react"

import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import "./index.scss"
import { DSN } from "./constants"
import ScrollToTop from "./layouts/ScrollToTop"
import Network from "./layouts/Network"
import Contract from "./layouts/Contract"
import App from "./layouts/App"
import WalletConnectProvider from "./layouts/WalletConnectProvider"

process.env.NODE_ENV === "production" &&
  Sentry.init({ dsn: DSN, tracesSampleRate: 1.0 })

render(
  <StrictMode>
    <WalletConnectProvider>
      <Network>
        <Contract>
          <Router>
            <ScrollToTop />
            <App />
          </Router>
        </Contract>
      </Network>
    </WalletConnectProvider>
  </StrictMode>,
  document.getElementById("mirror")
)

serviceWorkerRegistration.unregister()
