import React, { memo, useEffect } from "react"
import SwapPage from "../components/SwapPage"
import SwapForm from "../forms/SwapForm"
import Container from "../components/Container"
import useQueryString from "hooks/useQueryString"

export enum Type {
  "SWAP" = "swap",
  "PROVIDE" = "provide",
  "WITHDRAW" = "withdraw",
}

// const tabs = [
//   { type: Type.SWAP, slang: "swap", name: "Swap" },
//   { type: Type.PROVIDE, slang: "provide", name: "Provide" },
//   { type: Type.WITHDRAW, slang: "withdraw", name: "Withdraw" },
// ];

const Swap = () => {
  const [type, setType] = useQueryString<Type>("type", Type.SWAP)
  const tabs = {
    tabs: [
      { name: Type.SWAP, title: "Swap" },
      { name: Type.PROVIDE, title: "Provide" },
      { name: Type.WITHDRAW, title: "Withdraw" },
    ],
    selectedTabName: type,
  }

  useEffect(() => {
    console.log(
      `Object.keys(Type).map((key) => Type[key as keyof typeof Type])`
    )
    console.log(Object.keys(Type).map((key) => Type[key as keyof typeof Type]))
    console.log(type)
    console.log(
      type &&
        Object.keys(Type)
          .map((key) => Type[key as keyof typeof Type])
          .includes(type)
    )
    if (
      !type ||
      !Object.keys(Type)
        .map((key) => Type[key as keyof typeof Type])
        .includes(type)
    ) {
      setType(Type.SWAP)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return (
    <Container>
      <SwapPage>{type && <SwapForm type={type} tabs={tabs} />}</SwapPage>
    </Container>
  )
}

export default memo(Swap)
