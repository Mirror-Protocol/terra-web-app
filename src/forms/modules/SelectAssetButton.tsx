import { FC } from "react"
import MESSAGE from "../../lang/MESSAGE.json"
import { lookupSymbol } from "../../libs/parse"
import Icon from "../../components/Icon"
import AssetIcon from "../../components/AssetIcon"
import { Config } from "./useSelectAsset"
import styles from "./SelectAssetButton.module.scss"

interface Props extends Config {
  isOpen: boolean
  symbol?: string
  onClick: () => void
}

const SelectAssetButton: FC<Props> = ({
  isOpen,
  symbol,
  onClick,
  ...props
}) => {
  const { formatTokenName = lookupSymbol } = props
  const renderAsset = (symbol: string) => (
    <>
      <AssetIcon symbol={symbol} className={styles.icon} size="sm" />
      {formatTokenName(symbol)}
    </>
  )

  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {symbol ? renderAsset(symbol) : MESSAGE.Form.Button.SelectAsset}
      <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={8} />
    </button>
  )
}

export default SelectAssetButton
