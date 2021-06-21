import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { groupBy } from "ramda"
import BigNumber from "bignumber.js"

import { formatAsset } from "../libs/parse"
import { gt, sum } from "../libs/math"
import { toBase64 } from "../libs/formHelpers"
import useNewContractMsg from "../libs/useNewContractMsg"
import { BalanceKey, PriceKey } from "../hooks/contractKeys"
import { cdpsQuery } from "../data/stats/cdps"
import { useProtocol } from "../data/contract/protocol"
import { useFind } from "../data/contract/normalize"

import Container from "../components/Container"
import findPositions from "./modules/findPositions"
import useBurnReceipt from "./receipts/useBurnReceipt"
import FormContainer from "./modules/FormContainer"

interface Props {
  token: string
  positions: CDP[]
}

interface PositionItem extends CDP {
  collateral: string
}

const Component = ({ token, positions }: Props) => {
  /* context */
  const { contracts, getSymbol, getIsDelisted } = useProtocol()
  const find = useFind()

  const list = positions.map((item) => {
    const { mintAmount, collateralToken } = item
    const collateralPrice = find(
      getIsDelisted(collateralToken) ? PriceKey.END : PriceKey.ORACLE,
      collateralToken
    )

    const price = new BigNumber(find(PriceKey.END, token)).div(collateralPrice)
    const collateral = price
      .times(mintAmount)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString()

    return { ...item, collateral }
  })

  /* confirm */
  const contents = [
    {
      title: "Return Amount",
      content: Object.entries(byCollateralToken(list))
        .map(([collateralToken, list]) =>
          formatAsset(
            sum(list.map(({ collateral }) => collateral)),
            getSymbol(collateralToken)
          )
        )
        .join(" + "),
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const createSend = (msg: object, amount?: string) => ({
    send: { amount, contract: contracts["mint"], msg: toBase64(msg) },
  })

  const getData = ({ id, mintAmount }: CDP) => {
    const burn = { burn: { position_idx: id } }
    return newContractMsg(token, createSend(burn, mintAmount))
  }

  const data = list.map(getData)

  /* result */
  const parseTx = useBurnReceipt()
  const container = { contents, data, parseTx, label: "Burn" }

  return <FormContainer {...container} />
}

const BurnForm = () => {
  const balanceKey = BalanceKey.TOKEN

  const find = useFind()
  const { token } = useParams<{ token: string }>()
  const balance = find(balanceKey, token)

  const cdps = useRecoilValue(cdpsQuery(token))
  const positions = gt(balance, 0) && cdps && findPositions(balance, cdps)

  return (
    <Container sm>
      {token && positions && <Component token={token} positions={positions} />}
    </Container>
  )
}

export default BurnForm

/* helpers */
const byCollateralToken = groupBy<PositionItem>(
  ({ collateralToken }) => collateralToken
)
