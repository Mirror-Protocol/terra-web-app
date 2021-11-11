import { StrictMode } from "react"
import { render } from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { QueryClient, QueryClientProvider } from "react-query"

import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import "./index.scss"
import ScrollToTop from "./layouts/ScrollToTop"
import WalletConnectProvider from "./layouts/WalletConnectProvider"
import App from "./layouts/App"
import Boundary from "./components/Boundary"

const queryClient = new QueryClient()

render(
  <StrictMode>
    <RecoilRoot>
      <Boundary>
        <Router>
          <ScrollToTop />
          <QueryClientProvider client={queryClient}>
            <WalletConnectProvider>
              <App />
            </WalletConnectProvider>
          </QueryClientProvider>
        </Router>
      </Boundary>
    </RecoilRoot>
  </StrictMode>,
  document.getElementById("mirror")
)

serviceWorkerRegistration.unregister()
