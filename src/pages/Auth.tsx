import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import MESSAGE from "../lang/MESSAGE.json"
import { useAddress } from "../hooks"
import Page from "../components/Page"
import Button from "../components/Button"

const Auth = () => {
  const address = useAddress()
  const { connect, disconnect } = useWallet()

  return (
    <Page title="Auth">
      {address ? (
        <Button onClick={disconnect} color="red" outline>
          Disconnect
        </Button>
      ) : (
        <Button onClick={() => connect(ConnectType.READONLY)} outline>
          {MESSAGE.Form.Button.ConnectWallet}
        </Button>
      )}
    </Page>
  )
}

export default Auth
