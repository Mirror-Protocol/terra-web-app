import useNewContractMsg from "../terra/useNewContractMsg"
import { formatAsset } from "../libs/parse"
import { toBase64 } from "../libs/formHelpers"
import { useContractsAddress } from "../hooks"
import FormContainer from "./FormContainer"

interface Props {
  idx: string
  position: MintPosition
}

const AuctionForm = ({ idx, position }: Props) => {
  const { contracts, getSymbol, parseToken } = useContractsAddress()
  const { amount, token } = parseToken(position.asset)
  const symbol = getSymbol(token)

  /* confirm */
  const contents = [
    { title: "ID", content: idx },
    { title: "Amount", content: formatAsset(amount, symbol) },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const auction = { auction: { position_idx: idx } }

  const data = [
    newContractMsg(token, {
      send: { contract: contracts["mint"], amount, msg: toBase64(auction) },
    }),
  ]

  const container = { contents, data, label: "Auction" }
  return <FormContainer {...container} />
}

export default AuctionForm
