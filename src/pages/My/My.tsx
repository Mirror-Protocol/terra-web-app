import { MenuKey } from "../../routes"
import { useAddress } from "../../hooks"

import Page from "../../components/Page"
import ConnectionRequired from "../../containers/ConnectionRequired"

import MyConnected from "./MyConnected"

const My = () => {
  const address = useAddress()

  return (
    <Page title={MenuKey.MY} doc="/user-guide/getting-started/sending-tokens">
      {!address ? <ConnectionRequired /> : <MyConnected />}
    </Page>
  )
}

export default My
