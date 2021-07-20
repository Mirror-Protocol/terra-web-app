import useNewContractMsg from "../libs/useNewContractMsg"
import { minus } from "../libs/math"
import { useProtocol } from "../data/contract/protocol"
import Formatted from "../components/Formatted"
import Container from "../components/Container"
import { MenuKey } from "../pages/Txs/LimitOrder"
import FormContainer from "./modules/FormContainer"
import useCancelOrderReceipt from "./receipts/useCancelOrderReceipt"

interface Props {
  order: Order
}

const CancelOrderForm = ({ order }: Props) => {
  const { order_id, offer_asset, filled_offer_amount } = order

  /* context */
  const { contracts, parseToken } = useProtocol()
  const { amount, symbol } = parseToken(offer_asset)

  /* confirm */
  const contents = [
    {
      title: "Order ID",
      content: order_id,
    },
    {
      title: "Returned Assets",
      content: (
        <Formatted symbol={symbol}>
          {minus(amount, filled_offer_amount)}
        </Formatted>
      ),
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contracts["limitOrder"], {
      cancel_order: { order_id: order_id },
    }),
  ]

  const parseTx = useCancelOrderReceipt()

  /* result */
  const container = { contents, disabled: false, data, parseTx }

  return (
    <Container sm>
      <FormContainer {...container} label={MenuKey.CANCEL} />
    </Container>
  )
}

export default CancelOrderForm
