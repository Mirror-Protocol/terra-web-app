import React from "react"
import { DataKey } from "../hooks/useContract"
import WithResult from "./WithResult"
import Count from "./Count"

interface Props extends CountOptions {
  keys?: DataKey[]
  result?: Result
}

const CountWithResult = ({ keys, result, ...options }: Props) => (
  <WithResult keys={keys} result={result} dataOnly>
    <Count {...options} />
  </WithResult>
)

export default CountWithResult
