import { useEffect, useState } from "react"
import useAPI from "./useAPI"

export default (symbol: string) => {
  const [gasPrice, setGasPrice] = useState<string>()
  const { loadGasPrice } = useAPI()
  useEffect(() => {
    try {
      loadGasPrice(symbol).then((result) => {
        setGasPrice(result)
      })
    } catch (e) {
      setGasPrice("0");
    }
  }, [loadGasPrice, symbol])

  return { gasPrice };
};
