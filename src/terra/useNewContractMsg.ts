import { MsgExecuteContract, Coins, Coin } from "@terra-money/terra.js"
import { useWallet } from "../hooks"

export default () => {
  const { address: sender } = useWallet()

  return (
    contract: string,
    msg: object,
    coins?: { denom: string; amount: string }[]
  ) => {
    let resCoins = new Coins()
    if (coins === undefined) {
      resCoins = new Coins([])
    } else if (coins.length === 1) {
      resCoins = new Coins([Coin.fromData(coins[0])])
    } else if (coins.length === 2) {
      resCoins = new Coins([
        Coin.fromData(coins[0]).toIntCoin(),
        Coin.fromData(coins[1]).toIntCoin(),
      ])
    }

    return new MsgExecuteContract(sender, contract, msg, resCoins)
  }

  // return (
  //   contract: string,
  //   msg: object,
  //   coin?: { denom: string; amount: string }
  // ) =>
  //   new MsgExecuteContract(
  //     sender,
  //     contract,
  //     msg,
  //     new Coins(coin ? [Coin.fromData(coin)] : [])
  //   )
}
