import { useChainOptions } from "@terra-money/wallet-provider"
import { AVAILABLE_CHAIN_ID } from "constants/networks"
import { useNetwork } from "hooks"
import { useMemo } from "react"
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

const UnsupportedNetworkModal: React.FC<{ isOpen?: boolean }> = ({
  isOpen = false,
}) => {
  const network = useNetwork()
  const chainOptions = useChainOptions()
  const availableNetworks = useMemo(() => {
    if (chainOptions?.walletConnectChainIds) {
      const keys = Object.keys(chainOptions?.walletConnectChainIds).map(Number)
      return keys
        .filter((key) =>
          AVAILABLE_CHAIN_ID.includes(
            chainOptions?.walletConnectChainIds[key]?.chainID
          )
        )
        .map((key) => chainOptions?.walletConnectChainIds[key])
    }
    return []
  }, [chainOptions])
  return (
    <Modal isOpen={isOpen} close={() => {}} open={() => {}}>
      <ModalContent>
        <div>
          <ModalTitle>Wrong network connection</ModalTitle>
          <div style={{ marginBottom: 20 }}>
            Your wallet is connected to{" "}
            <b>
              {network.name}({network.chainID})
            </b>
            . <br />
            Please change your network setting of the wallet to
            <div
              style={{
                border: "1px solid #eeeeee",
                borderRadius: 8,
                padding: 10,
                marginTop: 10,
                fontWeight: 700,
              }}
            >
              {availableNetworks
                .map(
                  (availableNetwork) =>
                    `${availableNetwork.name}(${
                      availableNetwork.chainID?.split("-")?.[0]
                    })`
                )
                .reverse()
                .join(", ")}
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            style={{
              textTransform: "unset",
              maxWidth: 235,
              borderRadius: 10,
              marginBottom: 4,
            }}
          >
            Reload
          </Button>
          {network?.name !== "classic" && (
            <div style={{ color: "#aaaaaa", fontSize: 12 }}>
              Or
              <br />
              <a
                href="https://app.terraswap.io"
                style={{ fontWeight: 500, fontSize: 13 }}
              >
                Go to{" "}
                <b style={{ textDecoration: "underline" }}>app.terraswap.io</b>
              </a>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  )
}

export default UnsupportedNetworkModal
