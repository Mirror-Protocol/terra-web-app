import React from "react"
import ResultContents from "./ResultContents"
import ConfirmDetails from "./ConfirmDetails"
import TxHash from "./TxHash"

interface Props {
  txInfo: TxInfo
  parserKey: string
}

const TxInfo = ({ txInfo, parserKey }: Props) => {
  const { TxHash: hash } = txInfo
  const logs = txInfo?.Logs

  return (
    <>
      {logs?.map((log, index) => {
        const results = log.Events.find(({ Type }) => Type === "from_contract")
          ?.Attributes

        return (
          results && (
            <ResultContents
              parserKey={parserKey}
              results={results}
              key={index}
            />
          )
        )
      })}

      <ConfirmDetails
        contents={[{ title: "Tx Hash", content: <TxHash>{hash}</TxHash> }]}
        result
      />
    </>
  )
}

export default TxInfo
