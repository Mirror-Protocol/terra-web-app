import { useEffect, useState } from "react"
import { useContractsAddress } from "hooks/useContractsAddress"
import { useAddress } from "../hooks"
import useAPI from "./useAPI"

export default (contract_addr: string, symbol: string) => {
  const address = useAddress()
  const { getSymbol } = useContractsAddress()

  const { loadDenomBalance, loadContractBalance } = useAPI()

  const localContractAddr = contract_addr
  const localSymbol = symbol

  const [balance, setBalance] = useState<string>()
  useEffect(() => {
    let isAborted = false
    try {
      if (address === "" || address === undefined) {
        setBalance("")
        return
      }
      if (
        localContractAddr === "" ||
        localContractAddr === undefined ||
        !localContractAddr.startsWith("terra")
      ) {
        loadDenomBalance().then((denomInfos) => {
          let hasDenom: boolean = false
          if (denomInfos !== undefined) {
            denomInfos.forEach((denomInfo) => {
              if (denomInfo.denom === localContractAddr) {
                if (!isAborted) {
                  setBalance(denomInfo.amount)
                }
                hasDenom = true
              }
            })
          }
          if (hasDenom === false) {
            if (!isAborted) {
              setBalance("")
            }
          }
        })
      } else {
        loadContractBalance(localContractAddr).then((tokenBalance) => {
          if (!isAborted) {
            tokenBalance ? setBalance(tokenBalance.balance) : setBalance("")
          }
        })
      }
    } catch (error) {
      setBalance("")
    }

    return () => {
      isAborted = true
    }
  }, [
    address,
    contract_addr,
    getSymbol,
    loadContractBalance,
    loadDenomBalance,
    localContractAddr,
    localSymbol,
    symbol,
  ])

  return { balance }
}
