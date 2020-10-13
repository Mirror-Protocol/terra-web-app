import React from "react"
import useNewContractMsg from "../terra/useNewContractMsg"
import { lookupSymbol } from "../libs/parse"
import { useContract, useContractsAddress } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import { toBase64 } from "./formHelpers"
import FormContainer from "./FormContainer"

const AuctionForm = ({ idx }: { idx: string }) => {
  const { contracts, getListedItem, parseToken } = useContractsAddress()
  const { [AccountInfoKey.MINTPOSITIONS]: positions } = useContract()
  const position = positions?.find((position) => position.idx === idx)
  const prevAsset = position && parseToken(position.asset)
  const amount = prevAsset?.amount
  const symbol = prevAsset?.symbol

  /* confirm */
  const confirm = {
    contents: [
      { title: "idx", content: idx },
      { title: "symbol", content: lookupSymbol(symbol) },
    ],
  }

  /* submit */
  const { token } = getListedItem(symbol)
  const newContractMsg = useNewContractMsg()
  const auction = { auction: { position_idx: idx } }

  const data = [
    newContractMsg(token, {
      send: { contract: contracts["mint"], amount, msg: toBase64(auction) },
    }),
  ]

  const container = { data, confirm }
  return <FormContainer {...container} />
}

export default AuctionForm
