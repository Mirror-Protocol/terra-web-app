import { useEffect, useState } from "react"
import { hasTaxToken, getSymbol } from "../helpers/token"
import useAPI from "./useAPI"

interface TaxResponse {
  height: string
  result: string
}

export default (contract_addr: string) => {
  const [taxCap, setTaxCap] = useState<string>()
  const [taxRate, setTaxRate] = useState<string>()

  const { loadTaxInfo, loadTaxRate } = useAPI()

  useEffect(() => {
    try {
      if (!hasTaxToken(contract_addr)) {
        setTaxCap("0")
        return
      }

      loadTaxInfo(contract_addr).then((val) => {
        setTaxCap(val)
      })
    } catch (error) {
      setTaxCap("")
    }
  }, [loadTaxInfo, contract_addr])

  useEffect(() => {
    try {
      if (!hasTaxToken(contract_addr)) {
        setTaxRate("0")
        return
      }
      loadTaxRate().then((val) => {
        setTaxRate(val)
      })
    } catch (error) {
      setTaxRate("0")
    }
  }, [loadTaxRate, contract_addr])

  return { taxCap, taxRate }
}
