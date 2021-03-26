import { gt } from "../../libs/math"
import useLocalStorage from "../../libs/useLocalStorage"
import { MenuKey } from "../../routes"
import { useWallet } from "../../hooks"
import Page from "../../components/Page"
import Grid from "../../components/Grid"
import Button from "../../components/Button"
import ConnectionRequired from "../../containers/ConnectionRequired"
import useMy from "./useMy"
import Header from "./Header"
import TotalValue from "./TotalValue"
import HideEmptySections from "./HideEmptySections"
import Holdings from "./Holdings"
import Mint from "./Mint"
import Pool from "./Pool"
import Stake from "./Stake"
import Orders from "./Orders"
import HistoryList from "./HistoryList"

const My = () => {
  const { address, disconnect } = useWallet()
  const { holdings, mint, pool, stake, total, orders } = useMy()
  const [hide, setHide] = useLocalStorage("hideEmptySections", false)
  const toggle = () => setHide(!hide)

  const header = {
    total: <TotalValue {...total} />,
    hide: gt(total.value, 0) && (
      <HideEmptySections hide={hide} toggle={toggle} />
    ),
  }

  const contents = [
    {
      key: "holdings",
      dataSource: holdings.dataSource,
      component: <Holdings {...holdings} />,
    },
    {
      key: "mint",
      dataSource: mint.dataSource,
      component: <Mint {...mint} />,
    },
    {
      key: "pool",
      dataSource: pool.dataSource,
      component: <Pool {...pool} />,
    },
    {
      key: "stake",
      dataSource: stake.dataSource,
      component: <Stake {...stake} />,
    },
    {
      key: "orders",
      dataSource: orders.dataSource,
      component: <Orders {...orders} />,
    },
  ]

  return (
    <Page title={MenuKey.MY} doc="/user-guide/getting-started/sending-tokens">
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          <Grid>
            <Header {...header} />
          </Grid>

          {contents.map(
            ({ dataSource, component, key }) =>
              (!hide || !!dataSource.length) && (
                <Grid key={key}>{component}</Grid>
              )
          )}

          <Grid>
            <HistoryList />
          </Grid>

          {disconnect && (
            <Button
              className="mobile"
              onClick={disconnect}
              color="secondary"
              outline
              block
              submit
            >
              Disconnect
            </Button>
          )}
        </>
      )}
    </Page>
  )
}

export default My
