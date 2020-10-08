import React from "react"
import { MenuKey } from "../routes"
import Page from "../components/Page"
import PoolForm from "../forms/PoolForm"
import useHash from "./useHash"

export enum Type {
  "PROVIDE" = "provide",
  "WITHDRAW" = "withdraw",
}

const Pool = () => {
  const { hash: type } = useHash<Type>(Type.PROVIDE)
  const tab = { tabs: [Type.PROVIDE, Type.WITHDRAW], current: type }

  return (
    <Page title={MenuKey.POOL}>
      {type && <PoolForm type={type} tab={tab} key={type} />}
    </Page>
  )
}

export default Pool
