import React, { Fragment, memo } from "react"
import SwapPage from "../components/SwapPage"
import SwapForm from "../forms/SwapForm"
import SwapHeader from "../layouts/SwapHeader"
import SwapFooter from "../layouts/SwapFooter"
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
    tabs: [Type.SWAP, Type.PROVIDE, Type.WITHDRAW],
    tooltips: ["", "", ""],
    current: type,
  }

  return (
    <Fragment>
      <div id="terra">
        <SwapHeader />
        <Container>
          <SwapPage>
            {type && <SwapForm type={type} tabs={tabs} key={type} />}
          </SwapPage>
        </Container>
        <SwapFooter />
      </div>
    </Fragment>
  )
}

export default memo(Swap)
