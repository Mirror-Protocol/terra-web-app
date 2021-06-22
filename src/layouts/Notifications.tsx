import { useAddress } from "../hooks"
import { bound } from "../components/Boundary"
import DelistAlert from "./DelistAlert"

const Notifications = () => {
  const address = useAddress()
  return !address ? null : bound(<DelistAlert />)
}

export default Notifications
