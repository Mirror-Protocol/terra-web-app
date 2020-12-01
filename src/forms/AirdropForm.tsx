import { sum } from "../libs/math"
import useNewContractMsg from "../terra/useNewContractMsg"
import { MIR } from "../constants"
import { formatAsset } from "../libs/parse"
import { useContractsAddress } from "../hooks"
import useAirdrops from "../statistics/useAirdrops"
import FormContainer from "./FormContainer"

const AirdropForm = () => {
  /* context */
  const { airdrop, loading } = useAirdrops()
  const { contracts } = useContractsAddress()

  /* confirm */
  const amount = sum(airdrop?.map(({ amount }) => amount) ?? [])
  const contents = !airdrop?.length
    ? undefined
    : [{ title: "Amount", content: formatAsset(amount, MIR) }]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data =
    airdrop?.map(({ amount, proof, stage }) =>
      newContractMsg(contracts["airdrop"], {
        claim: { amount, stage, proof: JSON.parse(proof) },
      })
    ) ?? []

  const messages =
    !loading && !airdrop?.length ? ["Airdrop not found"] : undefined
  const disabled = !airdrop?.length

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
