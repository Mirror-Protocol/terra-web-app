import { useLocation } from "react-router-dom"
import { insertIf } from "../libs/utils"
import { MenuKey } from "../routes"
import { useContract, useRefetch } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import Page from "../components/Page"
import AuctionForm from "../forms/AuctionForm"

const Auction = () => {
  /* idx */
  const { search } = useLocation()
  const idx = new URLSearchParams(search).get("idx") || undefined

  /* context */
  const { [AccountInfoKey.MINTPOSITIONS]: positions } = useContract()
  const keys = [...insertIf(idx, AccountInfoKey.MINTPOSITIONS)]
  useRefetch(keys)
  const position = positions?.find((position) => position.idx === idx)

  return (
    <Page title={MenuKey.MINT}>
      {idx && position && <AuctionForm idx={idx} position={position} />}
    </Page>
  )
}

export default Auction
