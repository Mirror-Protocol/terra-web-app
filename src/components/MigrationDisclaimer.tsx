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

const Content = styled.div`
  width: 100%;
  height: auto;
  position: relative;

  padding: 9px 1px 15px 12px;
  border-radius: 12px;
  border: solid 1px #b5b5b5;

  max-height: 234px;
  overflow-y: auto;
  margin-bottom: 25px;

  & > div {
    padding-left: 11px;
    padding-right: 11px;
    position: relative;

    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    margin-bottom: 10px;

    &::before {
      content: "";
      display: inline-block;
      position: absolute;
      left: 0;
      top: 10px;
      width: 4px;
      height: 4px;
      background-color: #5c5c5c;
      border-radius: 50%;
    }
  }
`

const Disclaimer = () => {
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)

  const disclaimerModal = useModal()

  useEffect(() => {
    const agreed = window.localStorage.getItem("migrationDisclaimerAgreed")
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
          <ModalTitle>Disclaimer</ModalTitle>
          <Content>
            <div>
              PLEASE BE AWARE THE ADDRESS OF THE MIGRATION APPLICATION AGAINST
              THE SCAMMED SITE.
            </div>
            <div>
              IN THE RIGHT AFTER THE MIGRATION, THE SWAP RATE ON THE NEW
              CONTRACT COULD BE POOR DUE TO THE LOW LIQUIDITY AND IT MAY CAUSE
              YOUR LOSS.{" "}
            </div>
            <div>
              IF YOU DON’T EXECUTE MIGRATION YOUR ASSETS IN THE OLD CONTRACT,
              YOU MAY SUFFER FROM THE LOSS DUE TO ACTIVATION OF THE PROPOSAL
              4661. ANY WORKING BOT ON THE OLD CONTRACT CAN EXECUTE SWAP AND IT
              CAN BURN YOUR LIQUIDITY.{" "}
            </div>
          </Content>
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
              window.localStorage.setItem("migrationDisclaimerAgreed", "yes")
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
