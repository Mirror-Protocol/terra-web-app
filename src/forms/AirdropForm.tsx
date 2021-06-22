import useNewContractMsg from "../libs/useNewContractMsg"
import { formatAsset } from "../libs/parse"
import { useProtocol } from "../data/contract/protocol"
import useAirdrop from "../data/stats/airdrop"
import Container from "../components/Container"
import FormContainer from "./modules/FormContainer"

const AirdropForm = () => {
  /* context */
  const { contracts } = useProtocol()
  const airdrop = useAirdrop()

  /* confirm */
  const contents = !airdrop
    ? undefined
    : [{ title: "Amount", content: formatAsset(airdrop.amount, "MIR") }]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const getMsg = ({ amount, proof, stage }: Airdrop) =>
    newContractMsg(contracts["airdrop"], {
      claim: { amount, stage, proof: JSON.parse(proof) },
    })

  const data = airdrop ? [getMsg(airdrop)] : []

  const messages = !airdrop ? ["Airdrop not found"] : undefined
  const disabled = !airdrop

  /* result */
  const parseTx = undefined
  const container = { contents, messages, disabled, data, parseTx }

  return (
    <Container sm>
      <FormContainer {...container} label="Claim" />
    </Container>
  )
}

export default AirdropForm
