import routes from "../routes"
import Container from "../components/Container"
import { SettingsProvider, useSettingsState } from "../hooks/useSettings"
import { ContractProvider, useContractState } from "../hooks/useContract"
import useConnectGraph from "../hooks/useConnectGraph"
import useAddress from "../hooks/useAddress"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import MobileAlert from "./MobileAlert"
import DelistAlert from "./DelistAlert"
import Airdrop from "./Airdrop"
import Header from "./Header"
import Footer from "./Footer"
import "./App.scss"

const App = () => {
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
            <MobileAlert />
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
