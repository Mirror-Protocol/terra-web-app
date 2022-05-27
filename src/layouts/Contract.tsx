import UnsupportedNetworkModal from "components/UnsupportedNetworkModal"
import React, { PropsWithChildren, useEffect, useState } from "react"
import {
  ContractsAddressProvider,
  useContractsAddressState,
} from "../hooks/useContractsAddress"
import { useContractsAddressTokenState } from "../hooks/useContractsAddressToken"
import { ContractsAddressTokenProvider } from "../hooks/useContractsAddressToken"

const Contract: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const contractsAddress = useContractsAddressState()
  const contractsAddressToken = useContractsAddressTokenState()

  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsModalOpen(true)
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [])

  return !contractsAddress ? (
    <UnsupportedNetworkModal isOpen={isModalOpen} />
  ) : (
    <ContractsAddressProvider value={contractsAddress}>
      <ContractsAddressTokenProvider value={contractsAddressToken}>
        {children}
      </ContractsAddressTokenProvider>
    </ContractsAddressProvider>
  )
}

export default Contract
