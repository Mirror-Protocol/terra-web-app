import { ChangeEvent, useState } from "react"
import { Dictionary } from "ramda"
import useNewContractMsg from "../terra/useNewContractMsg"
import { MIR } from "../constants"
import { gt } from "../libs/math"
import { format } from "../libs/parse"
import { useContractsAddress } from "../hooks"
import FormCheck from "../components/FormCheck"
import { Type } from "../pages/Reward"
import FormContainer from "./FormContainer"

interface Props {
  balances: Dictionary<string>
  type: Type
  tab: Tab
}

const RewardForm = ({ balances, type, tab }: Props) => {
  /* context */
  const { contracts, listed } = useContractsAddress()

  /* form */
  const init = () =>
    listed.reduce((acc, { symbol, token }) => {
      const shouldCheck = type === Type.COLLECTOR && symbol === MIR
      return { ...acc, [token]: shouldCheck || gt(balances[token], 0) }
    }, {})

  const [checked, setChecked] = useState<Dictionary<boolean>>(init)

  /* submit */
  const createConvert = (token: string) => ({ convert: { asset_token: token } })
  const newContractMsg = useNewContractMsg()
  const checkedTokens = Object.entries(checked)
    .filter(([, checked]) => checked)
    .map(([token]) => token)

  const data = {
    [Type.FACTORY]: checkedTokens.map((token) =>
      newContractMsg(contracts["factory"], { mint: { asset_token: token } })
    ),

    [Type.COLLECTOR]: [
      ...checkedTokens.map((token) =>
        newContractMsg(contracts["collector"], createConvert(token))
      ),
      newContractMsg(contracts["collector"], { send: {} }),
    ],
  }[type]

  const label = { [Type.FACTORY]: "Staked", [Type.COLLECTOR]: "Total" }[type]
  const list = listed.map(({ symbol, token }) => {
    const balance = balances[token]
    const suffix =
      type === Type.COLLECTOR
        ? ` (Collected)`
        : ` (${label}: ${format(balance, symbol)})`

    return {
      attrs: {
        type: "checkbox",
        id: token,
        name: token,
        checked: checked[token],
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          setChecked({ ...checked, [e.target.name]: !checked[token] }),
      },

      label: (
        <>
          {symbol}
          {gt(balance, 0) && suffix}
        </>
      ),
    }
  })

  const container = { data, tab }

  return (
    <FormContainer {...container}>
      <FormCheck list={list} />
    </FormContainer>
  )
}

export default RewardForm
