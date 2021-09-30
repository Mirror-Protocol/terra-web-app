import { useAddress } from "../hooks"
import { usePollingPrices } from "../data/app"
import routes from "../routes"
import { MenuKey, getPath } from "../routes"
import Menu from "../components/Menu"
import Boundary, { bound } from "../components/Boundary"
import { useInitAddress, useInitNetwork, useLocationKey } from "./init"
import Airdrop from "./Airdrop"
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
  usePollingPrices()
  useLocationKey()
  useInitAddress()
  useInitNetwork()
  const address = useAddress()

  const menu = Object.entries(icons).map(([key, icon]) => ({
    icon,
    attrs: { to: getPath(key as MenuKey), children: key },
    style: { order: Number(key === MenuKey.MY) },
  }))

  return (
    <Layout
      nav={<Nav />}
      menu={<Menu list={menu} />}
      header={<Header />}
      banner={address && bound(<Airdrop />)}
      footer={<Footer />}
    >
      <Boundary>{routes()}</Boundary>
    </Layout>
  )
}

export default App
