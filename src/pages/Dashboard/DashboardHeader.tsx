import { MIR, UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { percent } from "../../libs/num"
import { format } from "../../libs/parse"
import { useContract, useContractsAddress, useRefetch } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import { StatsNetwork } from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Dl from "../../components/Dl"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import { TooltipIcon } from "../../components/Tooltip"
import useCommunityBalance from "./useCommunityBalance"

interface Props extends Partial<Dashboard> {
  network: StatsNetwork
}

const DashboardHeader = ({ network, ...props }: Props) => {
  const { getToken } = useContractsAddress()
  const { find } = useContract()
  const { latest24h, assetMarketCap, totalValueLocked, collateralRatio } = props
  const communityBalance = useCommunityBalance()
  useRefetch([PriceKey.PAIR])

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
              title: "Transactions",
              content: (
                <TooltipIcon content={Tooltip.Dashboard.Transactions}>
                  <Count integer>{latest24h?.transactions}</Count>
                </TooltipIcon>
              ),
            },
            {
              title: "Fee",
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
              <TooltipIcon
                content={
                  [StatsNetwork.COMBINE, StatsNetwork.TERRA].includes(network)
                    ? Tooltip.Dashboard.TVL
                    : Tooltip.Dashboard.TVLETH
                }
              >
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
              {collateralRatio}
            </Count>
          </Summary>
        </Card>

        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.CommunityPoolBalance}>
                Community Pool Balance
              </TooltipIcon>
            }
          >
            <Count symbol={MIR}>{communityBalance}</Count>
          </Summary>
        </Card>
      </Grid>
    </>
  )
}

export default DashboardHeader
