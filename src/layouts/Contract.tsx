import React, { PropsWithChildren } from "react"
import {
  ContractsAddressProvider,
  useContractsAddressState,
} from "../hooks/useContractsAddress"
import { useContractsAddressTokenState } from "../hooks/useContractsAddressToken"
import { ContractsAddressTokenProvider } from "../hooks/useContractsAddressToken"

const Contract: React.FC<PropsWithChildren<{}>> = ({ children }) => {
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
