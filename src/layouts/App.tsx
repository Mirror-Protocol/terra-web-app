import React, { useEffect, useState } from "react"
import routes from "routes"
import { ContractProvider, useContractState } from "hooks/useContract"
import { ThemeProvider } from "styled-components"
import variables from "styles/_export.module.scss"
import { useAddress } from "hooks"
import Header from "./Header"
import Footer from "./Footer"
import Container from "components/Container"
import { QueryClient, QueryClientProvider } from "react-query"
import styled from "styled-components"
import usePairs from "rest/usePairs"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
})

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  gap: 64px;
  overflow: hidden;
  margin-top: 76px;
  padding-top: 50px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    gap: unset;
    margin-top: 64px;
    padding-top: 24px;
  }
`

const App = () => {
  const address = useAddress()
  const contract = useContractState(address)
  const { isLoading: isPairsLoading } = usePairs()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      if (!isPairsLoading) {
        setIsLoading(false)
      }
    }, 100)
  }, [isPairsLoading])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={variables}>
        <ContractProvider value={contract}>
          <Header />
          {!isLoading && (
            <div>
              <Container>
                <Wrapper>
                  <div style={{ flex: 1, maxWidth: 150 }}>&nbsp;</div>
                  <div style={{ flex: 1 }}>{routes()}</div>
                </Wrapper>
              </Container>
            </div>
          )}
          <Footer />
        </ContractProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
