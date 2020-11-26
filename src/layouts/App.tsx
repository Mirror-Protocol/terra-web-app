import React from "react"
import routes from "../routes"
import Container from "../components/Container"
import { SettingsProvider, useSettingsState } from "../hooks/useSettings"
import { WalletProvider, useWalletState } from "../hooks/useWallet"
import { ContractProvider, useContractState } from "../hooks/useContract"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import Airdrop from "./Airdrop"
import Header from "./Header"
import Footer from "./Footer"

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
            <Airdrop />
            <Header />
            <Container>{routes()}</Container>
            <Footer />
          </StatsProvider>
        </ContractProvider>
      </WalletProvider>
    </SettingsProvider>
  )
}

export default App
