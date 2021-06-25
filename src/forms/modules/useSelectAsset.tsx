import { useState } from "react"
import { useProtocol } from "../../data/contract/protocol"
import { PriceKey } from "../../hooks/contractKeys"
import SelectAssetButton from "./SelectAssetButton"
import Assets from "./Assets"

export interface Config {
  /** Current value */
  token: string
  /** Function to call when a value is selected */
  onSelect: (asset: string) => void

  /** Key of price to show from data */
  priceKey?: PriceKey
  getPriceKey?: (token: string) => PriceKey

  /** Include native denoms in the list */
  native?: string[]
  /** Include external tokens in the list */
  showExternal?: boolean
  /** Show delisted token if balance exists */
  showDelisted?: boolean

  /** Exclude asset in the list */
  validate?: (params: ListedItem | ListedItemExternal) => boolean
  /** Modify token name */
  formatTokenName?: (symbol: string) => string
  /** Condition to be dimmed */
  dim?: (token: string) => boolean
}

export default (config: Config) => {
  const { token, onSelect } = config
  const { getSymbol } = useProtocol()
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
