import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import MESSAGE from "../lang/MESSAGE.json"
import { getPath, MenuKey } from "../routes"
import { useAddress } from "../hooks"
import Page from "../components/Page"
import Button from "../components/Button"

const Auth = () => {
  const address = useAddress()
  const { connect } = useWallet()
  const { replace } = useHistory()

  useEffect(() => {
    address && replace(getPath(MenuKey.MY))
  }, [address, replace])

  return address ? null : (
    <Page>
      <Button size="lg" onClick={() => connect(ConnectType.READONLY)}>
        {MESSAGE.Form.Button.ConnectWallet}
      </Button>
    </Page>
  )
}

export default Auth
