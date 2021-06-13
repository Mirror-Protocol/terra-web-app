import React, { useState } from "react"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import SwapSelectToken from "./SwapSelectToken"
import SwapTokens from "./SwapTokens"
import Modal from "./../components/Modal"
import SwapCard from "./../components/SwapCard"
import MESSAGE from "../lang/MESSAGE.json"
import Container from "../components/Container"
import { Pair } from "../rest/usePairs"

export interface Config {
  /** Current value */
  value: string
  symbol: string
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
  isFrom: boolean
  oppositeValue: string
  onSelectOpposite: (symbol: string) => void
}

export default (config: Config, pairs: Pair[], type: string) => {
  const {
    value,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol,
    onSelect,
    isFrom,
    oppositeValue,
    onSelectOpposite,
  } = config
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => (isOpen ? handleSelect(value) : setIsOpen(!isOpen))

  /* select asset */
  const handleSelect = (asset: string) => {
    onSelect(asset)
    setIsOpen(false)
  }

  const select = { ...config, isOpen, asset: value, type, onClick: toggle }

  return {
    isOpen,
    button: <SwapSelectToken {...select} />,
    assets: isOpen ? (
      <Modal
        isOpen={isOpen}
        open={() => setIsOpen(true)}
        close={() => setIsOpen(false)}
        isCloseBtn={true}
      >
        <Container>
          <SwapCard logoTitle={MESSAGE.Form.Button.SelectToken}>
            <SwapTokens
              {...config}
              isFrom={isFrom}
              selected={value}
              onSelect={handleSelect}
              oppositeValue={oppositeValue}
              onSelectOpposite={onSelectOpposite}
              pairs={pairs}
              type={type}
            />
          </SwapCard>
        </Container>
      </Modal>
    ) : undefined,
  }
}
