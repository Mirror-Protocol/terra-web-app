import { useEffect, useState } from "react"
import routes from "routes"
import { ContractProvider, useContractState } from "hooks/useContract"
import { ThemeProvider } from "styled-components"
import variables from "styles/_export.module.scss"
import { useAddress } from "hooks"
import Header from "./Header"
import Footer from "./Footer"
import container from "components/Container"
import styled from "styled-components"
import usePairs from "rest/usePairs"
import useMigration from "hooks/useMigration"
import Modal from "components/Modal"

const ModalContent = styled.div`
  width: 100%;
  max-width: calc(100vw - 32px);
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

    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #5c5c5c;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    padding: 30px 0px;
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

const App = () => {
  const { isMigrationPage } = useMigration()
  const address = useAddress()
  const contract = useContractState(address)
  const { isLoading: isV2PairsLoading } = usePairs("v2")
  const { isLoading: isV1PairsLoading } = usePairs("v1")

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      if (!isV2PairsLoading && !isV1PairsLoading) {
        setIsLoading(false)
      }
    }, 100)
  }, [isV2PairsLoading, isV1PairsLoading])

  useEffect(() => {
    if (isMigrationPage) {
      document.body.style.backgroundImage =
        "linear-gradient(to right, #0222ba 0%, #01115d 100%)"
    } else {
      document.body.style.backgroundImage = ""
    }
  }, [isMigrationPage])

  return (
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
  )
}

export default App
