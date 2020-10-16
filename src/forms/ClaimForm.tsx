import React from "react"
import useNewContractMsg from "../terra/useNewContractMsg"
import { MIR } from "../constants"
import { gt, plus } from "../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"
import Count from "../components/Count"
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
  const contents = [
    {
      title: "Claiming",
      content: <Count symbol={MIR}>{claiming}</Count>,
    },
    {
      title: "MIR after Tx",
      content: <Count symbol={MIR}>{plus(balance, claiming)}</Count>,
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { token } = getListedItem(symbol)
  const data = [
    newContractMsg(contracts["staking"], {
      withdraw: token ? { asset_token: token } : {},
    }),
  ]

  const disabled = !gt(claiming, 0)
  const container = { contents, data, disabled, label: "Claim" }

  return <FormContainer {...container} parserKey="claim" />
}

export default ClaimForm
