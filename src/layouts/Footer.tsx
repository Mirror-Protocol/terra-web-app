import { useNetwork } from "../hooks"
import AppFooter from "../components/AppFooter"

const Footer = () => {
  const { name } = useNetwork()
  return <AppFooter network={name} project="mirror-web-app" />
}

export default Footer
