import { ReactComponent as Logo } from "../images/Logo.svg"
import AppHeader from "../components/AppHeader"
import { MenuKey, getPath, omit } from "../routes"
import Connect from "./Connect"

const Header = () => {
  const menuKeys = Object.values(MenuKey).filter((key) => !omit.includes(key))
  const menu = menuKeys.map((key: MenuKey) => ({
    attrs: { to: getPath(key), children: key },
    desktopOnly: key === MenuKey.MY,
  }))

  return (
    <AppHeader logo={<Logo height={24} />} menu={menu} connect={<Connect />} />
  )
}

export default Header
