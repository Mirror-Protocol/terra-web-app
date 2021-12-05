import React, { memo } from "react"
import SwapPage from "../components/SwapPage"
import SwapForm from "../forms/SwapForm"
import Container from "../components/Container"
import useHash from "./useHash"

export enum Type {
  "SWAP" = "Swap",
  "PROVIDE" = "Provide",
  "WITHDRAW" = "Withdraw",
}

// const tabs = [
//   { type: Type.SWAP, slang: "swap", name: "Swap" },
//   { type: Type.PROVIDE, slang: "provide", name: "Provide" },
//   { type: Type.WITHDRAW, slang: "withdraw", name: "Withdraw" },
// ];

const Swap = () => {
  const { hash: type } = useHash<Type>(Type.SWAP)
  const tabs = {
    tabs: [
      { name: Type.SWAP },
      { name: Type.PROVIDE },
      { name: Type.WITHDRAW },
    ],
    selectedTabName: type,
  }

  return (
    <Container>
      <SwapPage>{type && <SwapForm type={type} tabs={tabs} />}</SwapPage>
    </Container>
  )
}

export default memo(Swap)
