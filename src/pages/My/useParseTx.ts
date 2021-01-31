import { Dictionary } from "ramda"
import { ReactNode } from "react"
import { formatAsset } from "../../libs/parse"
import { truncate } from "../../libs/text"
import getLpName from "../../libs/getLpName"
import { useContractsAddress } from "../../hooks"
import * as helpers from "../../forms/receipts/receiptHelpers"

const { parseTokenText, splitTokenText } = helpers

export const getBadge = (type: string) => {
  const group: Dictionary<string[]> = {
    Terra: ["TERRA_SEND", "TERRA_RECEIVE", "TERRA_SWAP"],

    Trade: ["BUY", "SELL"],
    Mint: [
      "OPEN_POSITION",
      "DEPOSIT_COLLATERAL",
      "WITHDRAW_COLLATERAL",
      "MINT",
      "BURN",
    ],
    Pool: ["PROVIDE_LIQUIDITY", "WITHDRAW_LIQUIDITY"],
    Stake: ["STAKE", "UNSTAKE", "WITHDRAW_REWARDS"],
    Gov: ["GOV_STAKE", "GOV_UNSTAKE", "GOV_CREATE_POLL"],

    Airdrop: ["CLAIM_AIRDROP"],
  }

  const key = Object.entries(group).find(([key, value]) => value.includes(type))
  return key?.[0] ?? type
}

const useParseTx = ({ type, data, token }: Tx) => {
  const { amount, denom, from, to } = data
  const { offerAsset, offerAmount, askAsset, returnAmount } = data
  const { assetToken, positionIdx, pollId } = data

  const { getSymbol } = useContractsAddress()
  const symbol = getSymbol(token)

  const collateral = splitTokenText(data.collateralAmount)
  const deposit = splitTokenText(data.depositAmount)
  const withdraw = splitTokenText(data.withdrawAmount)
  const mint = splitTokenText(data.mintAmount)
  const burn = splitTokenText(data.burnAmount)
  const assets = parseTokenText(data.assets)
  const refund = parseTokenText(data.refundAssets)
  const offer = splitTokenText(data.offer)
  const swap = splitTokenText(data.swapCoin)

  const parser: Dictionary<ReactNode[]> = {
    /* Terra */
    TERRA_SEND: ["Sent", formatAsset(amount, denom), "to", truncate(to)],
    SEND: ["Sent", formatAsset(amount, symbol), "to", truncate(to)],
    TERRA_RECEIVE: [
      "Received",
      formatAsset(amount, denom),
      "from",
      truncate(from),
    ],
    RECEIVE: ["Received", formatAsset(amount, symbol), "from", truncate(from)],
    TERRA_SWAP: [
      "Swapped",
      formatAsset(offer.amount, getSymbol(offer.token)),
      "to",
      formatAsset(swap.amount, getSymbol(swap.token)),
    ],

    /* Trade */
    BUY: [
      "Bought",
      formatAsset(returnAmount, getSymbol(askAsset)),
      "with",
      formatAsset(offerAmount, getSymbol(offerAsset)),
    ],
    SELL: [
      "Sold",
      formatAsset(offerAmount, getSymbol(offerAsset)),
      "for",
      formatAsset(returnAmount, getSymbol(askAsset)),
    ],

    /* Mint */
    OPEN_POSITION: [
      "Minted",
      formatAsset(mint.amount, getSymbol(mint.token)),
      "with",
      formatAsset(collateral.amount, getSymbol(collateral.token)),
    ],
    DEPOSIT_COLLATERAL: [
      "Deposited",
      formatAsset(deposit.amount, getSymbol(deposit.token)),
      "to position",
      positionIdx,
    ],
    WITHDRAW_COLLATERAL: [
      "Withdrawn",
      formatAsset(withdraw.amount, getSymbol(withdraw.token)),
      "from position",
      positionIdx,
    ],
    MINT: [
      "Minted",
      formatAsset(mint.amount, getSymbol(mint.token)),
      "to position",
      positionIdx,
    ],
    BURN: [
      "Burned",
      formatAsset(burn.amount, getSymbol(burn.token)),
      "from position",
      positionIdx,
    ],
    AUCTION: ["Liquidated position", positionIdx],

    /* Pool */
    PROVIDE_LIQUIDITY: [
      "Provided liquidity",
      formatAsset(assets[0]?.amount, getSymbol(assets[0]?.token)),
      "and",
      formatAsset(assets[1]?.amount, getSymbol(assets[1]?.token)),
    ],
    WITHDRAW_LIQUIDITY: [
      "Withdrawn liquidity",
      formatAsset(refund[0]?.amount, getSymbol(refund[0]?.token)),
      "and",
      formatAsset(refund[1]?.amount, getSymbol(refund[1]?.token)),
    ],

    /* Stake */
    STAKE: ["Staked", formatAsset(amount, getLpName(getSymbol(assetToken)))],
    UNSTAKE: [
      "Unstaked",
      formatAsset(amount, getLpName(getSymbol(assetToken))),
    ],
    WITHDRAW_REWARDS: ["Withdraw rewards", formatAsset(amount, symbol)],

    /* Gov */
    GOV_STAKE: ["Staked", formatAsset(amount, symbol)],
    GOV_UNSTAKE: ["Unstaked", formatAsset(amount, symbol)],
    GOV_CREATE_POLL: ["Created poll", pollId],

    /* Airdrop */
    CLAIM_AIRDROP: ["Claimed airdrop", formatAsset(amount, symbol)],
  }

  return parser[type] ?? []
}

export default useParseTx
