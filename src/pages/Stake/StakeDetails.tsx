import React from "react"
import { useParams } from "react-router-dom"
import { useWallet } from "../../hooks"
import Page from "../../components/Page"
import StakeForm from "../../forms/StakeForm"
import useHash from "../useHash"
import { Type } from "../Stake"
import StakeFormHeader from "./StakeFormHeader"
import StakeDetailsContents from "./StakeDetailsContents"

const StakeDetails = () => {
  const { address } = useWallet()
  const { symbol } = useParams<{ symbol: string }>()
  const { hash: type } = useHash<Type>(Type.STAKE)
  const tab = { tabs: [Type.STAKE, Type.UNSTAKE], current: type }

  return (
    <Page title={<StakeFormHeader>{symbol}</StakeFormHeader>}>
      {address && <StakeDetailsContents symbol={symbol} />}
      {type && <StakeForm type={type} symbol={symbol} tab={tab} key={type} />}
    </Page>
  )
}

export default StakeDetails
