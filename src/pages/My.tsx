import { MenuKey } from "../routes"
import { useWallet } from "../hooks"
import Page from "../components/Page"
import Grid from "../components/Grid"
import Button from "../components/Button"
import ConnectionRequired from "../containers/ConnectionRequired"
import useMy from "./My/useMy"
import Holdings from "./My/Holdings"
import Mint from "./My/Mint"
import Pool from "./My/Pool"
import Stake from "./My/Stake"
import TotalValue from "./My/TotalValue"

const My = () => {
  const { address, disconnect } = useWallet()
  const { holdings, mint, pool, stake, total } = useMy()

  return (
    <Page title={MenuKey.MY}>
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          <Grid>
            <TotalValue {...total} />
          </Grid>

          <Grid>
            <Holdings {...holdings} />
          </Grid>

          <Grid>
            <Mint {...mint} />
          </Grid>

          <Grid>
            <Pool {...pool} />
          </Grid>

          <Grid>
            <Stake {...stake} />
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
