import MESSAGE from "../lang/MESSAGE.json"
import useAddress from "../hooks/useAddress"
import { useModal } from "../containers/Modal"
import ConnectButton from "../components/ConnectButton"
import Connected from "./Connected"
import ConnectListModal from "./ConnectListModal"

const Connect = () => {
  const address = useAddress()
  const modal = useModal()

  return !address ? (
    <>
      <ConnectButton onClick={() => modal.open()}>
        {MESSAGE.Wallet.Connect}
      </ConnectButton>

      <ConnectListModal {...modal} />
    </>
  ) : (
    <Connected />
  )
}

export default Connect
