import { FC, PropsWithChildren } from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { lookupSymbol } from "../libs/parse"
import Icon from "../components/Icon"
import { Config } from "./useSelectAsset"
import styles from "./SwapSelectToken.module.scss"
import { GetTokenSvg } from "../helpers/token"
import { lpTokenInfos, tokenInfos } from "../rest/usePairs"
import { Type } from "../pages/Swap"

interface Props extends Config {
  isOpen: boolean
  asset?: string
  type: string
  onClick: () => void
}

const SwapSelectToken: FC<PropsWithChildren<Props>> = ({
  isOpen,
  asset,
  type,
  onClick,
  ...props
}) => {
  const { formatTokenName } = props

  let symbol = ""
  let icon = ""
  if (asset !== undefined) {
    if (type === Type.WITHDRAW) {
      const tokenInfoList = lpTokenInfos.get(asset)
      symbol = tokenInfoList
        ? tokenInfoList[0].symbol + "-" + tokenInfoList[1].symbol
        : ""
    } else {
      const tokenInfo = tokenInfos.get(asset)
      symbol = tokenInfo ? tokenInfo.symbol : ""
      icon = tokenInfo ? tokenInfo.icon : ""
    }
  }

  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {asset && (
        <div className={styles.logo}>
          <img src={GetTokenSvg(icon, symbol)} width={20} height={20} alt="" />
        </div>
      )}
      <div className={styles.name}>
        {asset
          ? formatTokenName?.(symbol) ?? lookupSymbol(symbol)
          : MESSAGE.Form.Button.SelectToken}
      </div>
      <Icon name={isOpen ? "expand_less" : "expand_more"} size={24} />
    </button>
  )
}

export default SwapSelectToken
