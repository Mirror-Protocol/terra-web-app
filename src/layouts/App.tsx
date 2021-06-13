import React from "react"
import routes from "routes"
import { WalletProvider, useWalletState } from "hooks/useWallet"
import { ContractProvider, useContractState } from "hooks/useContract"
import { ThemeProvider } from "styled-components"
import variables from "styles/_variables.scss"

const App = () => {
  const wallet = useWalletState()
  const contract = useContractState(wallet.address)

  return (
    <ThemeProvider theme={variables}>
      <WalletProvider value={wallet} key={wallet.address}>
        <ContractProvider value={contract}>{routes()}</ContractProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}

export default App
