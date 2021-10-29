import React from "react"
import SwapResultContents from "./SwapResultContents"
import ConfirmDetails from "./ConfirmDetails"
import TxHash from "./SwapTxHash"
import { tokenInfos } from "../rest/usePairs"
import { formatAsset } from "../libs/parse"
import { useNetwork } from "hooks"

interface Props {
  txInfo: SwapTxInfo
  parserKey: string
}

const TxInfo = ({ txInfo, parserKey }: Props) => {
  const { txhash: hash, tx } = txInfo
  const logs = txInfo?.logs

  const { router } = useNetwork()

  let contents: Content[][] = []
  contents.push([{ title: "Tx Hash", content: <TxHash>{hash}</TxHash> }])
  if (tx) {
    contents.push([
      {
        title: "Fee",
        content: tx.value.fee.amount.map((value) => {
          return formatAsset(value.amount, tokenInfos.get(value.denom)?.symbol)
        }),
      },
    ])
  }

  return (
    <>
      {logs?.map((log, index) => {
        const event = log.events

        const fromContract = event.find(({ type }) => type === "from_contract")
          ?.attributes

        const format = (str: string) => {
          const target = str.trim()
          const idx = target.search(`[^0-9]+`)
          const amount = target.substring(0, idx).trim()
          const symbol = tokenInfos.get(
            target.substring(idx, target.length).trim()
          )?.symbol

          return formatAsset(amount, symbol)
        }

        let reconstructed: SwapAttribute[] = []
        // fromContract can be undefined if pair is not whitelisted
        if (fromContract) {
          {
            // pre-checking
            const action = fromContract.find(({ key }) => key === "action")
            if (!action) return
          }

          if (parserKey === "Swap") {
            const action = fromContract.find(
              ({ key, value }) => key === "action" && value === "swap"
            )
            if (!action) return

            const sender = fromContract.find(({ key }) => key === "sender")

            const offerAsset = fromContract.find(
              ({ key }) => key === "offer_asset"
            )
            const askAsset = fromContract.find(({ key }) => key === "ask_asset")
            const offerAmount = fromContract.find(
              ({ key }) => key === "offer_amount"
            )
            const returnAmount = fromContract.find(
              ({ key }) => key === "return_amount"
            )
            const spread = fromContract.find(
              ({ key }) => key === "spread_amount"
            )
            const commission = fromContract.find(
              ({ key }) => key === "commission_amount"
            )
            const tax = fromContract.find(({ key }) => key === "tax_amount")

            if (offerAsset && offerAmount) {
              let value = formatAsset(
                offerAmount.value,
                tokenInfos.get(offerAsset.value)?.symbol
              )
              reconstructed.push({ key: "From", value: value })
            }
            if (askAsset && returnAmount) {
              const symbol = tokenInfos.get(askAsset.value)?.symbol
              let taxAmount = BigInt(0)
              if (tax) {
                taxAmount = BigInt(tax.value)
              }
              const toAmount = BigInt(returnAmount.value) - taxAmount
              let value = formatAsset(toAmount.toString(), symbol)
              reconstructed.push({ key: "To", value: value })

              if (spread) {
                reconstructed.push({
                  key: "* Spread",
                  value: formatAsset(spread.value, symbol),
                })
              }
              if (commission) {
                reconstructed.push({
                  key: "* Commission",
                  value: formatAsset(commission.value, symbol),
                })
              }
              if (tax) {
                reconstructed.push({
                  key: "* Tax",
                  value: formatAsset(tax.value, symbol),
                })
              }

              if (sender && sender?.value === router) {
                reconstructed = []
                reconstructed.push({ key: "Info", value: "Router swap" })
              }
            }
          } else if (parserKey === "Provide") {
            const action = fromContract.find(
              ({ key, value }) =>
                key === "action" && value === "provide_liquidity"
            )
            if (!action) return

            const assets = fromContract.find(({ key }) => key === "assets")
            const share = fromContract.find(({ key }) => key === "share")

            if (assets) {
              const values = assets.value.split(",", 2)
              values.forEach((value) => {
                reconstructed.push({ key: "Provided", value: format(value) })
              })
            }

            if (share) {
              const value = formatAsset(share.value, "LP")
              reconstructed.push({ key: "Received", value: value })
            }
          } else if (parserKey === "Withdraw") {
            const action = fromContract.find(
              ({ key, value }) =>
                key === "action" && value === "withdraw_liquidity"
            )
            if (!action) return

            const refundAssets = fromContract.find(
              ({ key }) => key === "refund_assets"
            )
            const withdrawnShare = fromContract.find(
              ({ key }) => key === "withdrawn_share"
            )

            if (refundAssets) {
              const values = refundAssets.value.split(",", 2)
              values.forEach((value) => {
                reconstructed.push({ key: "Withdrew", value: format(value) })
              })
            }

            if (withdrawnShare) {
              const value = formatAsset(withdrawnShare.value, "LP")
              reconstructed.push({ key: "Burned", value: value })
            }
          }
        } else {
          reconstructed.push({ key: "Info", value: "Not whitelisted pair" })
        }

        return (
          <SwapResultContents
            parserKey={parserKey}
            results={reconstructed}
            key={index}
          />
        )
      })}

      <ConfirmDetails contents={contents} result />
    </>
  )
}

export default TxInfo
