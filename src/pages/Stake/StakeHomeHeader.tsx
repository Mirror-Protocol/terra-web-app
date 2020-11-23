import React from "react"
import Tooltip from "../../lang/Tooltip.json"
import { MIR, UUSD } from "../../constants"
import { format } from "../../libs/parse"
import { useContract, useContractsAddress } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import useDashboard from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import CountWithResult from "../../components/CountWithResult"
import { TooltipIcon } from "../../components/Tooltip"
import useMirrorTokenInfo from "./useMirrorTokenInfo"

const StakeHomeHeader = () => {
  const { getToken } = useContractsAddress()
  const { find } = useContract()
  const { dashboard, ...result } = useDashboard()
  const supply = useMirrorTokenInfo()

  const contents = [
    {
      title: (
        <TooltipIcon content={Tooltip.Stake.MIRprice}>{MIR} Price</TooltipIcon>
      ),
      content: (
        <CountWithResult keys={[PriceKey.PAIR]} symbol={UUSD} format={format}>
          {find(PriceKey.PAIR, getToken(MIR))}
        </CountWithResult>
      ),
    },

    {
      title: (
        <TooltipIcon content={Tooltip.Stake.MIRvolume}>
          {MIR} Volume (24hrs)
        </TooltipIcon>
      ),
      content: (
        <CountWithResult results={[result]} symbol={UUSD} integer>
          {dashboard?.latest24h?.mirVolume}
        </CountWithResult>
      ),
    },

    {
      title: (
        <TooltipIcon content={Tooltip.Stake.MIRsupply}>
          {MIR} Supply
        </TooltipIcon>
      ),
      content: (
        <CountWithResult results={[supply.result]} symbol={MIR} integer>
          {"0" || supply.value}
        </CountWithResult>
      ),
    },
  ]

  return (
    <Grid>
      {contents.map(({ title, content }, index) => (
        <Card key={index}>
          <Summary title={title}>{content}</Summary>
        </Card>
      ))}
    </Grid>
  )
}

export default StakeHomeHeader
