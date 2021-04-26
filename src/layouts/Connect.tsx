import MESSAGE from "../lang/MESSAGE.json"
import Modal, { useModal } from "../containers/Modal"
import ConnectList from "./ConnectList"
import ConnectButton from "../components/ConnectButton"
import Connected from "./Connected"
import useAddress from "../hooks/useAddress"

const Connect = () => {
  const address = useAddress()
  const modal = useModal()

  return !address ? (
    <>
      <ConnectButton onClick={() => modal.open()}>
        {MESSAGE.Wallet.Connect}
      </ConnectButton>

      <Modal {...modal}>
        <ConnectList />
      </Modal>
    </>
  ) : (
    <Connected />
  )
}

export default Connect
