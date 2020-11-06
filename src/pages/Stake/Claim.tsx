import React from "react"
import { useRouteMatch } from "react-router-dom"
import Page from "../../components/Page"
import ClaimForm from "../../forms/ClaimForm"
import { useContractsAddress } from "../../hooks"
import { MenuKey } from "../Stake"
import StakeFormHeader from "./StakeFormHeader"

const Claim = () => {
  const { params } = useRouteMatch<{ token?: string }>()
  const { token } = params

  const { getSymbol } = useContractsAddress()
  const symbol = getSymbol(token)
  const title = symbol ? (
    <StakeFormHeader>{symbol}</StakeFormHeader>
  ) : (
    MenuKey.CLAIMALL
  )

  return (
    <Page title={title}>
      <ClaimForm token={token} />
    </Page>
  )
}

export default Claim
