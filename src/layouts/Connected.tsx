import { gt } from "../libs/math"
import { truncate } from "../libs/text"
import { useContract, useRefetch, useWallet } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import ConnectedButton from "../components/ConnectedButton"
import Balance from "./Balance"
import Wallet from "./Wallet"
import WhereToBuy from "./WhereToBuy"

const Connected = () => {
  const { address } = useWallet()
  const { uusd } = useContract()
  const { data } = useRefetch([AccountInfoKey.UUSD])
  const shouldBuyUST = !!data && !gt(uusd, 0)

  return (
    <>
      <ConnectedButton
        address={truncate(address)}
        balance={<Balance />}
        info={(close) => <Wallet close={close} />}
      />
      {shouldBuyUST && <WhereToBuy />}
    </>
  )
}

export default Connected
