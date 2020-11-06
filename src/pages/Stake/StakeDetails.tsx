import React from "react"
import { useParams } from "react-router-dom"
import { useContractsAddress } from "../../hooks"
import Page from "../../components/Page"
import StakeForm from "../../forms/StakeForm"
import useHash from "../useHash"
import { Type } from "../Stake"
import StakeFormHeader from "./StakeFormHeader"

const StakeDetails = () => {
  const { token } = useParams<{ token: string }>()
  const { hash: type } = useHash<Type>(Type.STAKE)
  const { getSymbol } = useContractsAddress()
  const tab = { tabs: [Type.STAKE, Type.UNSTAKE], current: type }

  return (
    <Page title={<StakeFormHeader>{getSymbol(token)}</StakeFormHeader>}>
      {type && <StakeForm type={type} token={token} tab={tab} key={type} />}
    </Page>
  )
}

export default StakeDetails
