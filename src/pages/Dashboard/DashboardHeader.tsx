import React from "react"
import { MIR, UUSD } from "../../constants"
import { div } from "../../libs/math"
import { percent } from "../../libs/num"
import { format } from "../../libs/parse"
import { useContract } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Dl from "../../components/Dl"
import Summary from "../../components/Summary"
import Count from "../../components/Count"

const DashboardHeader = (props: Partial<Dashboard>) => {
  const { find } = useContract()
  const { latest24h, assetMarketCap, totalValueLocked, collateralRatio } = props

  return (
    <>
      <Grid>
        <Dl
          list={[
            {
              title: "MIR Price",
              content: (
                <Count format={format} symbol={UUSD}>
                  {find(PriceKey.PAIR, MIR)}
                </Count>
              ),
            },
            {
              title: "Transactions(24hrs)",
              content: <Count>{latest24h?.transactions}</Count>,
            },
            {
              title: "Fee(24hrs)",
              content: (
                <Count symbol={UUSD} integer>
                  {latest24h?.feeVolume}
                </Count>
              ),
            },
          ]}
        />
      </Grid>

      <Grid>
        <Card>
          <Summary title="mAssets Market Cap">
            <Count symbol={UUSD} integer>
              {assetMarketCap}
            </Count>
          </Summary>
        </Card>

        <Card>
          <Summary title="Total Value Locked">
            <Count symbol={UUSD} integer>
              {totalValueLocked}
            </Count>
          </Summary>
        </Card>

        <Card>
          <Summary title="Collateral Ratio">
            <Count format={(value) => percent(value, 0)}>
              {div(collateralRatio, 100)}
            </Count>
          </Summary>
        </Card>
      </Grid>
    </>
  )
}

export default DashboardHeader
