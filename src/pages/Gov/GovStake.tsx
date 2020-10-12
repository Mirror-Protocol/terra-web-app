import React from "react"
import { MIR } from "../../constants"
import { useWallet } from "../../hooks"
import Page from "../../components/Page"
import StakeForm from "../../forms/StakeForm"
import useHash from "../useHash"
import { Type } from "../Stake"
import StakeDetailsContents from "../Stake/StakeDetailsContents"
import { MenuKey } from "../Gov"

const GovStake = () => {
  const { address } = useWallet()
  const { hash: type } = useHash<Type>(Type.STAKE)
  const tab = { tabs: [Type.STAKE, Type.UNSTAKE], current: type }

  return (
    <Page title={MenuKey.STAKE}>
      {address && <StakeDetailsContents symbol={MIR} gov />}
      {type && <StakeForm type={type} symbol={MIR} tab={tab} key={type} gov />}
    </Page>
  )
}

export default GovStake
