import { ReactComponent as Logo } from "../styles/images/Logo.svg"
import AppHeader from "../components/AppHeader"

const Nav = () => {
  return <AppHeader logo={<Logo height={24} />} />
}

export default Nav
