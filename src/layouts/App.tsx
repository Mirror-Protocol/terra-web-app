import routes from "../routes"
import MESSAGE from "../lang/MESSAGE.json"
import Container from "../components/Container"
import Alert from "../components/Alert"
import { SettingsProvider, useSettingsState } from "../hooks/useSettings"
import { WalletProvider, useWalletState } from "../hooks/useWallet"
import { ContractProvider, useContractState } from "../hooks/useContract"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import Airdrop from "./Airdrop"
import Header from "./Header"
import Footer from "./Footer"
import "./App.scss"

const App = () => {
  const settings = useSettingsState()
  const wallet = useWalletState()
  const contract = useContractState(wallet.address)
  const stats = useStatsState()

  return (
    <SettingsProvider value={settings}>
      <WalletProvider value={wallet} key={wallet.address}>
        <ContractProvider value={contract}>
          <StatsProvider value={stats}>
            <Header />
            <Container>
              <Alert>{MESSAGE.App.Mobile}</Alert>
              {routes()}
            </Container>
            <Footer />
            <Airdrop />
          </StatsProvider>
        </ContractProvider>
      </WalletProvider>
    </SettingsProvider>
  )
}

export default App
