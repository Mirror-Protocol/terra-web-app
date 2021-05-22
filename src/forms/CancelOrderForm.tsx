import useNewContractMsg from "../terra/useNewContractMsg"
import { minus } from "../libs/math"
import { useContractsAddress } from "../hooks"
import Count from "../components/Count"
import { MenuKey } from "../pages/LimitOrder"
import FormContainer from "./FormContainer"
import useCancelOrderReceipt from "./receipts/useCancelOrderReceipt"

interface Props {
  order: Order
  contract: string
}

const CancelOrderForm = ({ order, contract }: Props) => {
  const { order_id, offer_asset, filled_offer_amount } = order

  /* context */
  const { parseToken } = useContractsAddress()
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
        <Count symbol={symbol}>{minus(amount, filled_offer_amount)}</Count>
      ),
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contract, { cancel_order: { order_id: order_id } }),
  ]

  const parseTx = useCancelOrderReceipt()

  /* result */
  const container = { contents, disabled: false, data, parseTx }
  const label = MenuKey.CANCEL
  const props = { tab: { tabs: [label], current: label }, label }

  return <FormContainer {...container} {...props} />
}

export default CancelOrderForm
