import React from "react"
import { useRouteMatch } from "react-router-dom"
import Page from "../../components/Page"
import ClaimForm from "../../forms/ClaimForm"
import { MenuKey } from "../Stake"
import StakeFormHeader from "./StakeFormHeader"

const Claim = () => {
  const { params } = useRouteMatch<{ symbol?: string }>()
  const { symbol } = params
  return (
    <Page
      title={
        symbol ? <StakeFormHeader>{symbol}</StakeFormHeader> : MenuKey.CLAIMALL
      }
    >
      <ClaimForm symbol={symbol} />
    </Page>
  )
}

export default Claim
