import React, { FC } from "react"
import { useContractsAddressState } from "../hooks/useContractsAddress"
import { ContractsAddressProvider } from "../hooks/useContractsAddress"

const Contract: FC = ({ children }) => {
  const contractsAddress = useContractsAddressState()

  return !contractsAddress ? null : (
    <ContractsAddressProvider value={contractsAddress}>
      {children}
    </ContractsAddressProvider>
  )
}

export default Contract
