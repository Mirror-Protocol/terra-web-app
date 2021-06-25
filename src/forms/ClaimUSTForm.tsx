import useNewContractMsg from "../libs/useNewContractMsg"
import { gt } from "../libs/math"
import { useProtocol } from "../data/contract/protocol"
import { useMyLockedUST } from "../data/my/locked"
import Formatted from "../components/Formatted"
import Container from "../components/Container"
import useClaimUSTReceipt from "./receipts/useClaimUSTReceipt"
import FormContainer from "./modules/FormContainer"

const ClaimUSTForm = () => {
  /* context */
  const { contracts } = useProtocol()
  const { totalUnlockedUST, dataSource } = useMyLockedUST()

  /* confirm */
  const contents = [
    {
      title: "Claiming",
      content: <Formatted symbol="uusd">{totalUnlockedUST}</Formatted>,
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const ids = dataSource
    .filter(({ unlocked }) => gt(unlocked, 0))
    .map(({ idx }) => idx)

  const data = ids.length
    ? [
        newContractMsg(contracts["lock"], {
          unlock_position_funds: { positions_idx: ids },
        }),
      ]
    : []

  const disabled = !gt(totalUnlockedUST, 0)

  /* result */
  const parseTx = useClaimUSTReceipt()
  const container = { contents, disabled, data, parseTx }
  const props = {
    tab: { tabs: ["Claim"], current: "Claim" },
    label: "Claim",
  }

  return (
    <Container sm>
      <FormContainer {...container} {...props} />
    </Container>
  )
}

export default ClaimUSTForm
