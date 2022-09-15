import React, { memo, useEffect } from "react"
import SwapPage from "../components/SwapPage"
import SwapForm from "../forms/SwapForm"
import Container from "../components/Container"
import { useSearchParams } from "react-router-dom"
import useMigration from "hooks/useMigration"
import MigrateForm from "forms/MigrateForm"

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
  const { isMigrationPage } = useMigration()
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get("type") as Type
  const tabs = {
    tabs: isMigrationPage
      ? [
          {
            name: "migration",
            title: "Migration",
          },
        ]
      : [
          { name: Type.SWAP, title: "Swap" },
          { name: Type.PROVIDE, title: "Provide" },
          { name: Type.WITHDRAW, title: "Withdraw" },
        ],
    selectedTabName: isMigrationPage ? "migration" : type,
  }

  useEffect(() => {
    if (!isMigrationPage) {
      if (
        !type ||
        !Object.keys(Type)
          .map((key) => Type[key as keyof typeof Type])
          .includes(type)
      ) {
        searchParams.set("type", Type.SWAP)
        setSearchParams(searchParams, { replace: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isMigrationPage])

  return (
    <Container>
      <SwapPage>
        {isMigrationPage ? (
          <MigrateForm />
        ) : (
          <>{type && <SwapForm type={type} tabs={tabs} />}</>
        )}
      </SwapPage>
    </Container>
  )
}

export default memo(Swap)
