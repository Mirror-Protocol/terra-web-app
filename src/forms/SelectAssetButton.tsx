import { FC } from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { lookupSymbol } from "../libs/parse"
import Icon from "../components/Icon"
import { Config } from "./useSelectAsset"
import styles from "./SelectAsset.module.scss"

interface Props extends Config {
  isOpen: boolean
  symbol?: string
  onClick: () => void
}

const SelectAsset: FC<Props> = ({ isOpen, symbol, onClick, ...props }) => {
  const { formatTokenName = lookupSymbol } = props
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {symbol ? formatTokenName(symbol) : MESSAGE.Form.Button.SelectAsset}
      <Icon name={isOpen ? "arrow_drop_up" : "arrow_drop_down"} size={24} />
    </button>
  )
}

export default SelectAsset
