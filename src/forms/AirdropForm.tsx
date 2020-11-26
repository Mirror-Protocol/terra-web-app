import React from "react"
import useNewContractMsg from "../terra/useNewContractMsg"
import { MIR } from "../constants"
import { formatAsset } from "../libs/parse"
import { useContractsAddress } from "../hooks"
import useAirdrops from "../statistics/useAirdrops"
import FormContainer from "./FormContainer"

const AirdropForm = () => {
  /* context */
  const airdrops = useAirdrops()
  const { contracts } = useContractsAddress()

  /* confirm */
  const contents = !airdrops?.length
    ? undefined
    : airdrops.map(({ stage, amount }) => ({
        title: `Stage ${stage}`,
        content: formatAsset(amount, MIR),
      }))

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data =
    airdrops?.map(({ amount, proof, stage }) =>
      newContractMsg(contracts["airdrop"], {
        claim: { amount, stage, proof: JSON.parse(proof) },
      })
    ) ?? []

  const messages = !airdrops?.length ? ["Airdrop not found"] : undefined
  const disabled = !airdrops?.length

  /* result */
  const parseTx = undefined
  const container = { contents, messages, disabled, data, parseTx }
  const props = {
    tab: { tabs: ["Airdrop"], current: "Airdrop" },
    label: "Claim",
  }

  return <FormContainer {...container} {...props} />
}

export default AirdropForm
