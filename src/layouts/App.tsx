import routes from "../routes"
import { MenuKey, getPath, gnb } from "../routes"
import { useAddress } from "../hooks"
import Menu from "../components/Menu"
import Boundary from "../components/Boundary"
import { useAlertByNetwork } from "./init"
import { useInitAddress, useInitNetwork, useLocationKey } from "./init"
import Airdrop from "./Airdrop"
import DelistAlert from "./DelistAlert"
import AlertNetwork from "./AlertNetwork"
import Layout from "./Layout"
import Nav from "./Nav"
import Header from "./Header"
import Footer from "./Footer"
import "./App.scss"

const icons: Dictionary<IconNames> = {
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
  const address = useAddress()

  const menu = Object.values(gnb).map((key: MenuKey) => ({
    icon: icons[key],
    attrs: { to: getPath(key), children: key },
  }))

  return alert ? (
    <AlertNetwork />
  ) : (
    <>
      <Layout
        nav={<Nav />}
        menu={<Menu list={menu} />}
        header={<Header />}
        footer={<Footer />}
      >
        <Boundary>{routes()}</Boundary>
      </Layout>

      <Boundary>{address && <Airdrop />}</Boundary>
      <Boundary>{address && <DelistAlert />}</Boundary>
    </>
  )
}

export default App
