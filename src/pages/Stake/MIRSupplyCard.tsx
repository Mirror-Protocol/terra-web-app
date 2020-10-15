import React from "react"
import Tooltip from "../../lang/Tooltip.json"
import { MIR } from "../../constants"
import { useContractsAddress } from "../../hooks"
import useContractQuery from "../../graphql/useContractQuery"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import CountWithResult from "../../components/CountWithResult"
import { TooltipIcon } from "../../components/Tooltip"

const MIRSupplyCard = () => {
  const supply = useMirrorTokenInfo()

  return (
    <Card>
      <Summary
        title={
          <TooltipIcon content={Tooltip.Stake.MIRsupply}>
            {MIR} Supply
          </TooltipIcon>
        }
      >
        <CountWithResult results={[supply.result]} symbol={MIR} integer>
          {supply.value}
        </CountWithResult>
      </Summary>
    </Card>
  )
}

export default MIRSupplyCard

/* hooks */
export const useMirrorTokenInfo = () => {
  const { contracts } = useContractsAddress()
  const { result, parsed } = useContractQuery<{ total_supply: string }>({
    contract: contracts["mirrorToken"],
    msg: { token_info: {} },
  })

  return { result, value: parsed?.total_supply }
}
