import { useWallet } from "@terra-money/wallet-provider"
import MESSAGE from "../lang/MESSAGE.json"
import { UUSD } from "../constants"
import { truncate } from "../libs/text"
import { useNetwork, useAddress, useRefetch } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import { getPath, MenuKey } from "../routes"
import ConnectedInfo from "../components/ConnectedInfo"

const Wallet = ({ close }: { close: () => void }) => {
  const address = useAddress()
  const { disconnect } = useWallet()
  const { finder } = useNetwork()
  useRefetch([AccountInfoKey.UUSD])

  const info = {
    address,
    disconnect,
    truncated: truncate(address),
    link: { href: finder(address), children: MESSAGE.Wallet.TerraFinder },
    footer: {
      to: { pathname: getPath(MenuKey.SEND), state: { token: UUSD } },
      children: MenuKey.SEND,
    },
  }

  return <ConnectedInfo {...info} close={close} />
}

export default Wallet
