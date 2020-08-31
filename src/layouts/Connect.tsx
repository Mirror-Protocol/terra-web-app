import MESSAGE from "../lang/MESSAGE.json"
import { useWallet } from "../hooks"
import { useModal } from "../containers/Modal"
import ConnectButton from "../components/ConnectButton"
import Connected from "./Connected"
import SupportModal from "./SupportModal"

const Connect = () => {
  const { address, installed, connect } = useWallet()
  const modal = useModal()

  const handleClick = () => (installed ? connect() : modal.open())

  return !address ? (
    <>
      <ConnectButton onClick={handleClick}>
        {MESSAGE.Wallet.Connect}
      </ConnectButton>

      <SupportModal {...modal} />
    </>
  ) : (
    <Connected />
  )
}

export default Connect
