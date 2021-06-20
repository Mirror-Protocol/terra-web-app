import { useAddress } from "../hooks"
import { bound } from "../components/Boundary"
import Airdrop from "./Airdrop"
import DelistAlert from "./DelistAlert"

const Notifications = () => {
  const address = useAddress()
  return (
    <>
      {address && bound(<Airdrop />)}
      {address && bound(<DelistAlert />)}
    </>
  )
}

export default Notifications
