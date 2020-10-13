import React from "react"
import useNewContractMsg from "../terra/useNewContractMsg"
import { MIR } from "../constants"
import { plus } from "../libs/math"
import { formatAsset } from "../libs/parse"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"
import FormContainer from "./FormContainer"

interface Props {
  symbol?: string
}

const ClaimForm = ({ symbol }: Props) => {
  /* context */
  const { contracts, getListedItem } = useContractsAddress()
  const { find, rewards } = useContract()
  useRefetch([BalanceKey.TOKEN, BalanceKey.LPSTAKED, BalanceKey.REWARD])
  const balance = find(BalanceKey.TOKEN, MIR)
  const claiming = symbol ? find(BalanceKey.REWARD, symbol) : rewards

  /* confirm */
  const confirm = {
    contents: [
      {
        title: "Claiming MIR",
        content: formatAsset(claiming, MIR),
      },
      {
        title: "MIR Balance After Transaction",
        content: formatAsset(plus(balance, claiming), MIR),
      },
    ],
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { token } = getListedItem(symbol)
  const data = [
    newContractMsg(contracts["staking"], {
      withdraw: token ? { asset_token: token } : {},
    }),
  ]

  const container = { confirm, data, parserKey: "claim" }

  return <FormContainer {...container} />
}

export default ClaimForm
