import { MsgExecuteContract, Coins, Coin } from "@terra-money/terra.js"
import { useWallet } from "../hooks"

export default () => {
  const { address: sender } = useWallet()

  return (
    contract: string,
    msg: object,
    coin?: { denom: string; amount: string }
  ) =>
    new MsgExecuteContract(
      sender,
      contract,
      msg,
      new Coins(coin ? [Coin.fromData(coin)] : [])
    )
}
