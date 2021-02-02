import { useLocation } from "react-router-dom"
import { MenuKey } from "../routes"
import Page from "../components/Page"
import AuctionForm from "../forms/AuctionForm"
import useMintPosition from "../graphql/queries/useMintPosition"

const Auction = () => {
  /* idx */
  const { search } = useLocation()
  const idx = new URLSearchParams(search).get("idx") || undefined

  /* context */
  const { parsed: position } = useMintPosition(idx)

  return (
    <Page title={MenuKey.MINT}>
      {idx && position && <AuctionForm idx={idx} position={position} />}
    </Page>
  )
}

export default Auction
