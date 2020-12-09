import { MenuKey } from "../routes"
import { useWallet } from "../hooks"
import Page from "../components/Page"
import Grid from "../components/Grid"
import Button from "../components/Button"
import ConnectionRequired from "../containers/ConnectionRequired"
import Holdings from "./My/Holdings"
import Mint from "./My/Mint"
import Pool from "./My/Pool"
import Stake from "./My/Stake"

const My = () => {
  const { address, disconnect } = useWallet()

  return (
    <Page title={MenuKey.MY} noBreak>
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          <Grid>
            <Holdings />
          </Grid>

          <Grid>
            <Mint />
          </Grid>

          <Grid>
            <Pool />
          </Grid>

          <Grid>
            <Stake />
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
