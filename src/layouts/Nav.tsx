import { ReactComponent as Logo } from "../styles/images/Logo.svg"
import AppHeader from "../components/AppHeader"
import Connect from "./Connect"

const Nav = () => {
  return <AppHeader logo={<Logo height={24} />} connect={<Connect />} />
}

export default Nav
