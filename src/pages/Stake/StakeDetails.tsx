import React from "react"
import { useParams } from "react-router-dom"
import Page from "../../components/Page"
import StakeForm from "../../forms/StakeForm"
import useHash from "../useHash"
import { Type } from "../Stake"
import StakeFormHeader from "./StakeFormHeader"

const StakeDetails = () => {
  const { symbol } = useParams<{ symbol: string }>()
  const { hash: type } = useHash<Type>(Type.STAKE)
  const tab = { tabs: [Type.STAKE, Type.UNSTAKE], current: type }

  return (
    <Page title={<StakeFormHeader>{symbol}</StakeFormHeader>}>
      {type && <StakeForm type={type} symbol={symbol} tab={tab} key={type} />}
    </Page>
  )
}

export default StakeDetails
