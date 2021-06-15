import useNewContractMsg from "../libs/useNewContractMsg"
import { gt } from "../libs/math"
import { useProtocol } from "../data/contract/protocol"
import { useMyLockedUST } from "../data/my/locked"
import Count from "../components/Count"
import Container from "../components/Container"
import useClaimUSTReceipt from "./receipts/useClaimUSTReceipt"
import FormContainer from "./FormContainer"

const ClaimUSTForm = () => {
  /* context */
  const { contracts } = useProtocol()
  const { totalUnlockedUST, dataSource } = useMyLockedUST()

  /* confirm */
  const contents = [
    {
      title: "Claiming",
      content: <Count symbol="uusd">{totalUnlockedUST}</Count>,
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = gt(totalUnlockedUST, 0)
    ? dataSource
        .filter(({ unlocked }) => gt(unlocked, 0))
        .map(({ idx }) =>
          newContractMsg(contracts["lock"], {
            unlock_position_funds: { position_idx: idx },
          })
        )
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
