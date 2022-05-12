import Modal, { useModal } from "components/Modal"
import Checkbox from "components/Checkbox"
import Button from "components/Button"
import { useEffect, useState } from "react"
import styled from "styled-components"

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
    text-align: left;
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
const Disclaimer = () => {
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)

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

  return (
    <Modal isOpen={disclaimerModal.isOpen} close={() => {}} open={() => {}}>
      <ModalContent>
        <div>
          <ModalTitle>Please read before using Terraswap</ModalTitle>
          <div>
            Terraswap is a decentralized exchange on Terra blockchain. Trading
            and providing liquidity on Terraswap is at your own risk, without
            warranties of any kind. Please read the&nbsp;
            <a
              href="https://docs.terraswap.io/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700 }}
            >
              document
            </a>
            &nbsp;carefully and understand how Terraswap works before using it.
          </div>
          <br />
          <div style={{ marginBottom: 30 }}>
            I acknowledge and agree that I am responsible for various losses of
            assets by making transactions on Terraswap, including swap,
            liquidity provision/withdrawal, etc. The entities involved in this
            site are not liable for any damages resulting from my use of
            Terraswap.
          </div>
          <div
            style={{ textAlign: "center", padding: "0 26px", marginBottom: 30 }}
          >
            <Checkbox
              onClick={() => setDisclaimerAgreed((current) => !current)}
              checked={disclaimerAgreed}
            >
              I understand the risks and would like to proceed
            </Checkbox>
          </div>
          <Button
            size="lg"
            disabled={!disclaimerAgreed}
            onClick={() => {
              window.localStorage.setItem("disclaimerAgreed", "yes")
              disclaimerModal.close()
            }}
            style={{ textTransform: "unset", maxWidth: 235, borderRadius: 10 }}
          >
            Agree and Proceed
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default Disclaimer
