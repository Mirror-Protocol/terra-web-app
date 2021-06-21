import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { groupBy } from "ramda"
import BigNumber from "bignumber.js"

import { formatAsset } from "../libs/parse"
import { gt, sum } from "../libs/math"
import { toBase64 } from "../libs/formHelpers"
import useNewContractMsg from "../libs/useNewContractMsg"
import { PriceKey } from "../hooks/contractKeys"
import { cdpsQuery } from "../data/stats/cdps"
import { useProtocol } from "../data/contract/protocol"
import { useFindBalanceStore } from "../data/contract/normalize"
import { useFindPriceStore } from "../data/contract/normalize"

import Container from "../components/Container"
import findPositions from "./modules/findPositions"
import useBurnReceipt from "./receipts/useBurnReceipt"
import FormContainer from "./modules/FormContainer"

interface PositionItem extends CDP {
  collateral: string
}

const BurnForm = () => {
  const { token } = useParams<{ token: string }>()

  /* context */
  const { contracts, getSymbol, getIsDelisted } = useProtocol()
  const cdps = useRecoilValue(cdpsQuery(token))
  const { contents: findBalance } = useFindBalanceStore()
  const findPrice = useFindPriceStore()

  const balance = findBalance(token)
  const positions = gt(balance, 0) && cdps ? findPositions(balance, cdps) : []

  const list = positions.map((item) => {
    const { mintAmount, collateralToken } = item
    const collateralPrice = findPrice(
      getIsDelisted(collateralToken) ? PriceKey.END : PriceKey.ORACLE,
      collateralToken
    )

    const price = new BigNumber(findPrice(PriceKey.END, token)).div(
      collateralPrice
    )
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

  return (
    <Container sm>
      <FormContainer {...container} />
    </Container>
  )
}

export default BurnForm

/* helpers */
const byCollateralToken = groupBy<PositionItem>(
  ({ collateralToken }) => collateralToken
)
