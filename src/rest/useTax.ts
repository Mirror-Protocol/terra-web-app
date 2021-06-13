import { useEffect, useState } from "react"
import { hasTaxToken, getSymbol } from "../helpers/token"
import useAPI from "./useAPI"

interface TaxResponse {
  height: string
  result: string
}

export default (symbol: string) => {
  const [taxCap, setTaxCap] = useState<string>()
  const [taxRate, setTaxRate] = useState<string>()

  const symbolName = getSymbol(symbol)
  const { loadTaxInfo, loadTaxRate } = useAPI()

  useEffect(() => {
    try {
      if (!hasTaxToken(symbolName)) {
        setTaxCap("0")
        return
      }

      loadTaxInfo(symbolName).then((val) => {
        setTaxCap(val)
      })
    } catch (error) {
      setTaxCap("0")
    }
  }, [loadTaxInfo, symbolName])

  useEffect(() => {
    try {
      if (!hasTaxToken(symbolName)) {
        setTaxRate("0")
        return
      }
      loadTaxRate().then((val) => {
        setTaxRate(val)
      })
    } catch (error) {
      setTaxRate("0")
    }
  }, [loadTaxRate, symbolName])

  return { taxCap, taxRate }
}
