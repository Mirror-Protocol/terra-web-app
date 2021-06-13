import React from "react"
import useSwapResults from "../hooks/useSwapResults"
import ConfirmDetails from "./ConfirmDetails"

interface Props {
  parserKey: string
  results: SwapAttribute[]
}

const SwapResultContents = ({ parserKey, results }: Props) => {
  const parsed = useSwapResults(parserKey, results)
  return !parsed.length ? null : <ConfirmDetails contents={parsed} result />
}

export default SwapResultContents
