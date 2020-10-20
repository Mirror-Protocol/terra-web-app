import React from "react"
import Page from "../components/Page"
import { MenuKey } from "../routes"
import Investment from "./My/Investment"
import Minted from "./My/Minted"
import Pool from "./My/Pool"
import Staked from "./My/Staked"
import ConnectionRequired from "../components/ConnectionRequired"
import { useWallet } from "../hooks"
import Grid from "../components/Grid"

const My = () => {
  const { address } = useWallet()

  return (
    <Page title={MenuKey.MY} noBreak>
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          <Grid>
            <Investment />
          </Grid>

          <Grid>
            <Minted />
          </Grid>

          <Grid>
            <Pool />
          </Grid>

          <Grid>
            <Staked />
          </Grid>
        </>
      )}
    </Page>
  )
}

export default My
