import { gt } from "../libs/math"
import useLocalStorage from "../libs/useLocalStorage"
import { MenuKey } from "../routes"
import { useWallet } from "../hooks"
import Page from "../components/Page"
import Grid from "../components/Grid"
import Button from "../components/Button"
import ConnectionRequired from "../containers/ConnectionRequired"
import useMy from "./My/useMy"
import Header from "./My/Header"
import TotalValue from "./My/TotalValue"
import HideEmptySections from "./My/HideEmptySections"
import Holdings from "./My/Holdings"
import Mint from "./My/Mint"
import Pool from "./My/Pool"
import Stake from "./My/Stake"

const My = () => {
  const { address, disconnect } = useWallet()
  const { holdings, mint, pool, stake, total } = useMy()
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
  ]

  return (
    <Page title={MenuKey.MY}>
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
