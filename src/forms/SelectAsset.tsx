import React, { FC } from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { lookupSymbol } from "../libs/parse"
import Icon from "../components/Icon"
import { Config } from "./useSelectAsset"
import styles from "./SelectAsset.module.scss"

interface Props extends Config {
  isOpen: boolean
  asset?: string
  onClick: () => void
}

const SelectAsset: FC<Props> = ({ isOpen, asset, onClick, ...props }) => {
  const { formatTokenName } = props
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {asset
        ? formatTokenName?.(asset) ?? lookupSymbol(asset)
        : MESSAGE.Form.Button.SelectAsset}
      <Icon name={isOpen ? "arrow_drop_up" : "arrow_drop_down"} size={24} />
    </button>
  )
}

export default SelectAsset
