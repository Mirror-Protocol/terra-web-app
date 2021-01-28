import { useState } from "react"
import { useContractsAddress } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import SelectAssetButton from "./SelectAssetButton"
import Assets from "./Assets"

export interface Config {
  /** Current value */
  token: string
  /** Function to call when a value is selected */
  onSelect: (asset: string) => void
  /** Key of price to show from data */
  priceKey?: PriceKey
  /** Key of balance to show from data */
  balanceKey?: BalanceKey
  /** Include UST in the list */
  useUST?: boolean
  /** Exclude symbol in the list */
  skip?: string[]
  /** Modify token name */
  formatTokenName?: (symbol: string) => string
  /** Condition to be dimmed */
  dim?: (token: string) => boolean
}

export default (config: Config) => {
  const { token, onSelect } = config
  const { getSymbol } = useContractsAddress()
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => (isOpen ? handleSelect(token) : setIsOpen(!isOpen))

  /* select asset */
  const handleSelect = (token: string) => {
    onSelect(token)
    setIsOpen(false)
  }

  const symbol = getSymbol(token)
  const select = { ...config, isOpen, symbol, onClick: toggle }

  return {
    isOpen,
    button: <SelectAssetButton {...select} />,
    assets: isOpen ? (
      <Assets {...config} selected={token} onSelect={handleSelect} />
    ) : undefined,
  }
}
