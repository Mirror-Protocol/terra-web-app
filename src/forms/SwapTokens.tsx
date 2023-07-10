import { FC, useEffect, useMemo, useRef, useState } from "react"
import classNames from "classnames/bind"
import { useCombineKeys } from "../hooks"
import { Config } from "./useSelectAsset"
import SwapToken from "./SwapToken"
import styles from "./SwapTokens.module.scss"
import { lpTokenInfos } from "../rest/usePairs"
import { Type } from "../pages/Swap"
import { tokenInfos } from "../rest/usePairs"
import Loading from "components/Loading"
import { SwapTokenAsset } from "./useSwapSelectToken"
import { VariableSizeList, ListChildComponentProps } from "react-window"
import { useContractsAddress } from "hooks/useContractsAddress"
import { isMobile } from "@terra-money/wallet-controller/utils/browser-check"

const cx = classNames.bind(styles)

interface Props extends Config {
  isFrom: boolean
  selected?: string
  onSelect: (asset: string, isUnable?: boolean) => void
  type: string
  assetList?: SwapTokenAsset[]
}

const SwapTokens = ({
  selected,
  onSelect: handleSelect,
  type,
  assetList,
  priceKey,
  balanceKey,
  formatTokenName,
}: Props) => {
  const listRef = useRef<HTMLUListElement>(null)
  const { loading } = useCombineKeys([priceKey, balanceKey])
  const { isNativeToken } = useContractsAddress()

  /* search */
  const [searchKeyword, setSearchKeyword] = useState("")
  const [listHeight, setListHeight] = useState(250)

  const filteredAssetList = useMemo(
    () =>
      assetList?.filter(({ contract_addr: contractAddr }) => {
        let symbol = ""
        if (type === Type.WITHDRAW) {
          const tokenInfoList = lpTokenInfos.get(contractAddr)
          symbol = tokenInfoList
            ? tokenInfoList[0].symbol + "-" + tokenInfoList[1].symbol
            : ""
        } else {
          const tokenInfo = tokenInfos.get(contractAddr)
          symbol = tokenInfo ? tokenInfo.symbol : ""
        }

        return (
          symbol.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0 ||
          contractAddr.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0
        )
      }),
    [assetList, searchKeyword, type]
  )
  const assetElements = useMemo(() => {
    return filteredAssetList?.map((asset) => {
      const { contract_addr, isUnable } = asset
      const isSelected = selected === contract_addr || selected === asset.symbol
      return (
        <li key={`${contract_addr}-${asset.name}-${asset.symbol}`}>
          <button
            type="button"
            className={cx(styles.button, {
              disabled: isUnable,
              selected: isSelected,
            })}
            onClick={() => handleSelect(contract_addr, isUnable)}
          >
            <SwapToken
              {...asset}
              formatTokenName={formatTokenName}
              highlightString={searchKeyword}
            />
          </button>
        </li>
      )
    })
  }, [
    filteredAssetList,
    formatTokenName,
    handleSelect,
    searchKeyword,
    selected,
  ])

  const Row: FC<ListChildComponentProps> = ({ index, style }) => (
    <div style={style}>{assetElements?.[index]}</div>
  )

  useEffect(() => {
    const handleWindowResize = () => {
      setListHeight(listRef.current?.clientHeight || 250)
    }

    window.addEventListener("resize", handleWindowResize)
    handleWindowResize()

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <div className={styles.component}>
      <section className={styles.search}>
        <input
          id="search"
          name="search"
          onChange={(e) => setSearchKeyword(e.target.value)}
          autoComplete="off"
          autoFocus={!isMobile()}
          placeholder="Search name or address"
        />
      </section>

      <ul ref={listRef} className={classNames(styles.list, { loading })}>
        {assetElements ? (
          <VariableSizeList
            height={listHeight}
            width="100%"
            itemSize={(index) =>
              isNativeToken(filteredAssetList?.[index].contract_addr || "")
                ? 75
                : 75
            }
            itemCount={assetElements.length}
          >
            {Row}
          </VariableSizeList>
        ) : (
          <div
            style={{
              position: "absolute",
              width: "100%",
              top: "50%",
              left: 0,
            }}
          >
            <Loading />
          </div>
        )}
      </ul>
    </div>
  )
}

export default SwapTokens
