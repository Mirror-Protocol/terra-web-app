import { MenuKey } from "../routes"
import Page from "../components/Page"
import SendForm from "../forms/SendForm"

const Send = () => (
  <Page title={MenuKey.SEND}>
    <SendForm tab={{ tabs: [MenuKey.SEND], current: MenuKey.SEND }} />
  </Page>
)

export default Send
