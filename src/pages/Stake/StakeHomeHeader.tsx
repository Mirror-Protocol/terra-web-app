import React from "react"
import { MIR, UUSD } from "../../constants"
import { format } from "../../libs/parse"
import { useContract } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import useDashboard from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import CountWithResult from "../../components/CountWithResult"
import MIRSupplyCard from "./MIRSupplyCard"

const StakeHomeHeader = () => {
  const { find } = useContract()
  const { dashboard, ...result } = useDashboard()

  return (
    <Grid>
      <Card>
        <Summary title={`${MIR} Price`}>
          <CountWithResult keys={[PriceKey.PAIR]} symbol={UUSD} format={format}>
            {find(PriceKey.PAIR, MIR)}
          </CountWithResult>
        </Summary>
      </Card>

      <Card>
        <Summary title={`${MIR} Volume(24hrs)`}>
          <CountWithResult result={result} symbol={UUSD} integer>
            {dashboard?.latest24h?.mirVolume}
          </CountWithResult>
        </Summary>
      </Card>

      <MIRSupplyCard />
    </Grid>
  )
}

export default StakeHomeHeader
