import { MintType } from "../../types/Types"
import MintForm from "../../forms/MintForm"
import Page from "../../components/Page"

const Borrow = () => {
  return (
    <Page title="Borrow">
      <MintForm type={MintType.BORROW} />
    </Page>
  )
}

export default Borrow