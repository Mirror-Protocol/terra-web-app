import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { getPath, MenuKey } from "../routes"
import { useWallet } from "../hooks"
import Page from "../components/Page"
import GlanceForm from "../forms/GlanceForm"

const Auth = () => {
  const { address } = useWallet()
  const { replace } = useHistory()

  useEffect(() => {
    address && replace(getPath(MenuKey.MY))
  }, [address, replace])

  return address ? null : (
    <Page>
      <GlanceForm />
    </Page>
  )
}

export default Auth
