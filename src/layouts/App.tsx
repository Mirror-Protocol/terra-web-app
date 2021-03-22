import routes from "../routes"
import Container from "../components/Container"
import { SettingsProvider, useSettingsState } from "../hooks/useSettings"
import { WalletProvider, useWalletState } from "../hooks/useWallet"
import { ContractProvider, useContractState } from "../hooks/useContract"
import useAssets from "../hooks/useAssets"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import MobileAlert from "./MobileAlert"
import Airdrop from "./Airdrop"
import Header from "./Header"
import Footer from "./Footer"
import "./App.scss"

const App = () => {
  const settings = useSettingsState()
  const wallet = useWalletState()
  const contract = useContractState(wallet.address)
  const stats = useStatsState()

  useAssets()

  return (
    <SettingsProvider value={settings}>
      <WalletProvider value={wallet} key={wallet.address}>
        <ContractProvider value={contract}>
          <StatsProvider value={stats}>
            <Header />
            <Container>
              <MobileAlert />
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
