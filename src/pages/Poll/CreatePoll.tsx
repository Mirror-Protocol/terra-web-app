import React from "react"
import Page from "../../components/Page"
import CreatePollForm from "../../forms/CreatePollForm"
import { MenuKey } from "../Gov"
import useHash from "../useHash"

export enum Type {
  "WHITELIST" = "whitelist",
  "PARAMS" = "parameter change",
}

const CreatePoll = () => {
  const { hash: type } = useHash<Type>(Type.WHITELIST)
  const tab = { tabs: [Type.WHITELIST, Type.PARAMS], current: type }

  return (
    <Page title={MenuKey.CREATE}>
      {type && <CreatePollForm type={type} tab={tab} key={type} />}
    </Page>
  )
}

export default CreatePoll
