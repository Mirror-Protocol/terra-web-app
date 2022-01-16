import React, { FC } from "react"
import {
  ContractsAddressProvider,
  useContractsAddressState,
} from "../hooks/useContractsAddress"
import { useContractsAddressTokenState } from "../hooks/useContractsAddressToken"
import { ContractsAddressTokenProvider } from "../hooks/useContractsAddressToken"

const Contract: FC = ({ children }) => {
  const contractsAddress = useContractsAddressState()
  const contractsAddressToken = useContractsAddressTokenState()

  return !contractsAddress ? null : (
    <ContractsAddressProvider value={contractsAddress}>
      <ContractsAddressTokenProvider value={contractsAddressToken}>
        {children}
      </ContractsAddressTokenProvider>
    </ContractsAddressProvider>
  )
}

export default Contract
