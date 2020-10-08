import React from "react"
import { useLocation } from "react-router-dom"
import { insertIf } from "../libs/utils"
import { MenuKey } from "../routes"
import { useRefetch } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import Page from "../components/Page"
import AuctionForm from "../forms/AuctionForm"

const Auction = () => {
  const { search } = useLocation()
  const idx = new URLSearchParams(search).get("idx") || undefined
  const keys = [...insertIf(idx, AccountInfoKey.MINTPOSITIONS)]
  useRefetch(keys)
  return <Page title={MenuKey.MINT}>{idx && <AuctionForm idx={idx} />}</Page>
}

export default Auction
