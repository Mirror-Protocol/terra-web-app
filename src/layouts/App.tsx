import React from "react"
import routes from "routes"
import { ContractProvider, useContractState } from "hooks/useContract"
import { ThemeProvider } from "styled-components"
import variables from "styles/_variables.scss"
import { useAddress } from "hooks"
import Header from "./Header"
import Footer from "./Footer"
import Sidebar from "./Sidebar"
import Container from "components/Container"
import { QueryClient, QueryClientProvider } from "react-query"
import styled from "styled-components"

const queryClient = new QueryClient()

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  gap: 64px;
  overflow: hidden;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    gap: unset;
  }
`

const App = () => {
  const address = useAddress()
  const contract = useContractState(address)
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={variables}>
        <ContractProvider value={contract}>
          <div id="terra">
            <Header />
            <Container>
              <Wrapper>
                <Sidebar />
                <div style={{ flex: 1 }}>{routes()}</div>
              </Wrapper>
            </Container>
            <Footer />
          </div>
        </ContractProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
