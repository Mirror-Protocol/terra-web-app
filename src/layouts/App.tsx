import React, { useEffect, useState } from "react"
import routes from "routes"
import { ContractProvider, useContractState } from "hooks/useContract"
import { ThemeProvider } from "styled-components"
import variables from "styles/_export.module.scss"
import { useAddress } from "hooks"
import Header from "./Header"
import Footer from "./Footer"
import container from "components/Container"
import { QueryClient, QueryClientProvider } from "react-query"
import styled from "styled-components"
import usePairs from "rest/usePairs"
import Modal, { useModal } from "components/Modal"
import Checkbox from "components/Checkbox"
import Button from "components/Button"

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

const Container = styled(container)`
  padding: 0;
`

const ModalContent = styled.div`
  width: calc(100% - 32px);
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.35);
  background-color: #fff;
  padding: 30px 0px;

  color: #5c5c5c;
  & > div {
    position: relative;
    width: 100%;
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
    padding: 0 30px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    padding: 16px 0px;
    & > div {
      padding: 0 16px;
    }
  }
`

const ModalTitle = styled.div`
  display: block;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: center;
  color: #0222ba;
  margin-bottom: 30px;
`

const App = () => {
  const address = useAddress()
  const contract = useContractState(address)
  const { isLoading: isPairsLoading } = usePairs()

  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const disclaimerModal = useModal()

  useEffect(() => {
    const agreed = window.localStorage.getItem("disclaimerAgreed")
    if (!agreed) {
      disclaimerModal.open()
    }
    if (agreed) {
      setDisclaimerAgreed(true)
    }
  }, [disclaimerModal])

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
          <Modal
            isOpen={disclaimerModal.isOpen}
            close={() => {}}
            open={() => {}}
          >
            <ModalContent>
              <div>
                <ModalTitle>Before you enter Terraswap</ModalTitle>
                <div>
                  Terraswap is a decentralized exchange on Terra blockchain.
                  Trading and providing liquidity on Terraswap is at your own
                  risk, without warranties of any kind. Please read the
                  document(link) carefully and understand how Terraswap works
                  before using it.
                </div>
                <br />
                <div>
                  I acknowledge and agree that I am responsible for various
                  losses of assets by making transactions on Terraswap,
                  including swap, liquidity provision/withdrawal, etc. The
                  entities involved in this site are not liable for any damages
                  resulting from my use of Terraswap.
                </div>
                <br />
                <div style={{ textAlign: "center" }}>
                  <Checkbox
                    onClick={() => setDisclaimerAgreed((current) => !current)}
                    checked={disclaimerAgreed}
                  >
                    I understand the risks and would like to proceed
                  </Checkbox>
                </div>
                <br />
                <Button
                  size="lg"
                  disabled={!disclaimerAgreed}
                  onClick={() => {
                    window.localStorage.setItem("disclaimerAgreed", "yes")
                    disclaimerModal.close()
                  }}
                >
                  Agree and Proceed
                </Button>
              </div>
            </ModalContent>
          </Modal>
        </ContractProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
