import { useWallet } from "@terra-money/wallet-provider"
import routes from "../routes"
import Container from "../components/Container"
import { SettingsProvider, useSettingsState } from "../hooks/useSettings"
import { ContractProvider, useContractState } from "../hooks/useContract"
import useConnectGraph from "../hooks/useConnectGraph"
import useAddress from "../hooks/useAddress"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import DelistAlert from "./DelistAlert"
import Airdrop from "./Airdrop"
import Header from "./Header"
import Footer from "./Footer"
import "./App.scss"

const App = () => {
  useRedirectByNetwork()
  const address = useAddress()
  const settings = useSettingsState()
  const contract = useContractState(address)
  const stats = useStatsState()
  useConnectGraph(address)

  return (
    <SettingsProvider value={settings}>
      <ContractProvider value={contract}>
        <StatsProvider value={stats}>
          <Header />
          <Container>
            {address && <DelistAlert />}
            {routes()}
          </Container>
          <Footer />
          {address && <Airdrop />}
        </StatsProvider>
      </ContractProvider>
    </SettingsProvider>
  )
}

export default App

/* redirect by network */
const useRedirectByNetwork = () => {
  const { network } = useWallet()

  const domain = {
    mainnet: "https://terra.mirror.finance",
    testnet: "https://terra-dev.mirror.finance",
    moonshine: "https://terra-dev.mirror.finance",
  }[network.name]

  const redirectTo = window.location.hostname !== domain ? domain : undefined

  if (process.env.NODE_ENV !== "development" && redirectTo) {
    window.location.assign(redirectTo)
  }
}
