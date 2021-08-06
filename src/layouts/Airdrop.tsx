import { useLocation } from "react-router-dom"
import useAirdrop from "../data/stats/airdrop"
import AirdropToast from "../pages/Airdrop/AirdropToast"
import { getPath, MenuKey } from "../routes"

const Airdrop = () => {
  const airdrop = useAirdrop()
  const { pathname } = useLocation()

  return !airdrop || pathname === getPath(MenuKey.AIRDROP) ? null : (
    <AirdropToast />
  )
}

export default Airdrop
