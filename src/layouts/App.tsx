import routes from "../routes"
import { MenuKey, getPath } from "../routes"

import Menu from "../components/Menu"
import Boundary from "../components/Boundary"
import { useAlertByNetwork } from "./init"
import { useInitAddress, useInitNetwork, useLocationKey } from "./init"
import AlertNetwork from "./AlertNetwork"
import Layout from "./Layout"
import Nav from "./Nav"
import Header from "./Header"
import Footer from "./Footer"
import "./App.scss"

const icons: Dictionary<IconNames> = {
  [MenuKey.MY]: "MyPage",
  [MenuKey.TRADE]: "Trade",
  [MenuKey.BORROW]: "Borrow",
  [MenuKey.FARM]: "Farm",
  [MenuKey.GOV]: "Governance",
}

const App = () => {
  useLocationKey()
  useInitAddress()
  useInitNetwork()
  const alert = useAlertByNetwork()

  const menu = Object.entries(icons).map(([key, icon]) => ({
    icon,
    attrs: { to: getPath(key as MenuKey), children: key },
  }))

  return alert ? (
    <AlertNetwork />
  ) : (
    <Layout
      nav={<Nav />}
      menu={<Menu list={menu} />}
      header={<Header />}
      footer={<Footer />}
    >
      <Boundary>{routes()}</Boundary>
    </Layout>
  )
}

export default App
