import { StrictMode } from "react"
import { render } from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"

import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import "./index.scss"
import { DSN } from "./constants"
import ScrollToTop from "./layouts/ScrollToTop"
import Network from "./layouts/Network"
import Contract from "./layouts/Contract"
import App from "./layouts/App"

process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })

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

type ServiceWorkerState =
  | "installing"
  | "installed"
  | "activating"
  | "activated"
  | "redundant"

interface ServiceWorkerEventTarget extends EventTarget {
  state: ServiceWorkerState
}

serviceWorkerRegistration.register({
  onUpdate: ({ waiting }) => {
    if (waiting) {
      waiting.addEventListener("statechange", (event) => {
        const state = (event?.target as ServiceWorkerEventTarget)?.state
        if (state === "activated") {
          alert("Mirror web app has been updated.")
          window.location.reload()
        }
      })

      waiting.postMessage({ type: "SKIP_WAITING" })
    }
  },
})
