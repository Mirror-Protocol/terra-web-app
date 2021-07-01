import React from "react"
import routes from "routes"
import { ContractProvider, useContractState } from "hooks/useContract"
import { ThemeProvider } from "styled-components"
import variables from "styles/_variables.scss"
import { useAddress } from "hooks"

const App = () => {
  const address = useAddress()
  const contract = useContractState(address)
  return (
    <ThemeProvider theme={variables}>
      <ContractProvider value={contract}>{routes()}</ContractProvider>
    </ThemeProvider>
  )
}

export default App
