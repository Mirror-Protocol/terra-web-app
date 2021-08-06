import { useLocation } from "react-router-dom"
import useAirdrop from "../data/stats/airdrop"
import AirdropToast from "../pages/Airdrop/AirdropToast"
import { getPath, MenuKey } from "../routes"

const Airdrop = () => {
  const { isLoading, contents } = useAirdrop()
  const { pathname } = useLocation()

  if (isLoading) return null

  return !contents || pathname === getPath(MenuKey.AIRDROP) ? null : (
    <AirdropToast />
  )
}

export default Airdrop
