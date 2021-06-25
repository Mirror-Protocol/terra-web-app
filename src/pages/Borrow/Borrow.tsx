import useHash from "../../libs/useHash"
import { MintType } from "../../types/Types"
import MintForm from "../../forms/MintForm"
import Page from "../../components/Page"
import BorrowList from "./BorrowList"

const Borrow = () => {
  const { hash: type } = useHash<MintType>()
  return (
    <Page title="Borrow" description="Mint">
      {!type ? <BorrowList /> : <MintForm type={type} />}
    </Page>
  )
}

export default Borrow
