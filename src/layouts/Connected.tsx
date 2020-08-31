import { truncate } from "../libs/text"
import { useWallet } from "../hooks"
import ConnectedButton from "../components/ConnectedButton"
import Balance from "./Balance"
import Wallet from "./Wallet"

const Connected = () => {
  const { address } = useWallet()

  return (
    <ConnectedButton
      address={truncate(address)}
      balance={<Balance />}
      info={(close) => <Wallet close={close} />}
    />
  )
}

export default Connected
