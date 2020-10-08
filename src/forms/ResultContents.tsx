import React from "react"
import useResults from "../helpers/useResults"
import ConfirmDetails from "./ConfirmDetails"

interface Props {
  parserKey: string
  results: Attribute[]
}

const ResultContents = ({ parserKey, results }: Props) => {
  const parsed = useResults(parserKey, results)
  return !parsed.length ? null : <ConfirmDetails contents={parsed} result />
}

export default ResultContents
