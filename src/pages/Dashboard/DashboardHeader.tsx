import React from "react"
import { MIR, UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { div } from "../../libs/math"
import { percent } from "../../libs/num"
import { format } from "../../libs/parse"
import { useContract, useContractsAddress } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Dl from "../../components/Dl"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import { TooltipIcon } from "../../components/Tooltip"

const DashboardHeader = (props: Partial<Dashboard>) => {
  const { getToken } = useContractsAddress()
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
                  {find(PriceKey.PAIR, getToken(MIR))}
                </Count>
              ),
            },
            {
              title: "Transactions (24hrs)",
              content: (
                <TooltipIcon content={Tooltip.Dashboard.Transactions}>
                  <Count integer>{latest24h?.transactions}</Count>
                </TooltipIcon>
              ),
            },
            {
              title: "Fee (24hrs)",
              content: (
                <TooltipIcon content={Tooltip.Dashboard.Fee}>
                  <Count symbol={UUSD} integer>
                    {latest24h?.feeVolume}
                  </Count>
                </TooltipIcon>
              ),
            },
          ]}
        />
      </Grid>

      <Grid>
        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.MarketCap}>
                mAssets Market Cap
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {assetMarketCap}
            </Count>
          </Summary>
        </Card>

        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.TVL}>
                Total Value Locked
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {totalValueLocked}
            </Count>
          </Summary>
        </Card>

        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.CollateralRatio}>
                Total Collateral Ratio
              </TooltipIcon>
            }
          >
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
