import React, { useState } from "react"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import SelectAsset from "./SelectAsset"
import Assets from "./Assets"

export interface Config {
  /** Current value */
  value: string
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
}

export default (config: Config) => {
  const { value, onSelect } = config
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => (isOpen ? handleSelect(value) : setIsOpen(!isOpen))

  /* select asset */
  const handleSelect = (asset: string) => {
    onSelect(asset)
    setIsOpen(false)
  }

  const select = { ...config, isOpen, asset: value, onClick: toggle }

  return {
    isOpen,
    button: <SelectAsset {...select} />,
    assets: isOpen ? (
      <Assets {...config} selected={value} onSelect={handleSelect} />
    ) : undefined,
  }
}
