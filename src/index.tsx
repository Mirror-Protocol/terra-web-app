import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import "./index.scss"
import "hooks/useContractsAddress"
import ScrollToTop from "./layouts/ScrollToTop"
import Network from "./layouts/Network"
import Contract from "./layouts/Contract"
import App from "./layouts/App"
import WalletConnectProvider from "./layouts/WalletConnectProvider"

const container = document.getElementById("terraswap")
const root = createRoot(container!)
root.render(
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
  </StrictMode>
)
