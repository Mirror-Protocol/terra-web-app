import styled from "styled-components"
import Button from "./Button"
import Modal from "./Modal"

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

const UnsupportedNetworkModal: React.FC<{ isOpen?: boolean }> = ({
  isOpen = false,
}) => {
  return (
    <Modal isOpen={isOpen} close={() => {}} open={() => {}}>
      <ModalContent>
        <div>
          <ModalTitle>Wrong network connection</ModalTitle>
          <div style={{ marginBottom: 30 }}>
            Your wallet is connected to the wrong network. Please check your
            network to access {window.location.host}
          </div>
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            style={{ textTransform: "unset", maxWidth: 235, borderRadius: 10 }}
          >
            Reload
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default UnsupportedNetworkModal
