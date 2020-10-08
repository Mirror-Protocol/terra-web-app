import React from "react"
import { MIR } from "../../constants"
import { useContractsAddress } from "../../hooks"
import useContractQuery from "../../graphql/useContractQuery"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import CountWithResult from "../../components/CountWithResult"

const MIRSupplyCard = () => {
  const supply = useMirrorTokenInfo()

  return (
    <Card>
      <Summary title={`${MIR} Supply`}>
        <CountWithResult result={supply.result} symbol={MIR} integer>
          {supply.value}
        </CountWithResult>
      </Summary>
    </Card>
  )
}

export default MIRSupplyCard

/* hooks */
const useMirrorTokenInfo = () => {
  const { contracts } = useContractsAddress()
  const { result, parsed } = useContractQuery<{ total_supply: string }>({
    contract: contracts["mirrorToken"],
    msg: { token_info: {} },
  })

  return { result, value: parsed?.total_supply }
}
