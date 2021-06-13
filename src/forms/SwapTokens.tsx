import React, { useState } from "react"
import classNames from "classnames/bind"
import { gt } from "../libs/math"
import { useContract, useCombineKeys } from "../hooks"
import { Config } from "./useSelectAsset"
import SwapToken from "./SwapToken"
import styles from "./SwapTokens.module.scss"
import { lpTokenInfos, Pair } from "../rest/usePairs"
import { Type } from "../pages/Swap"
import { tokenInfos } from "../rest/usePairs"
import Loading from "components/Loading"

const cx = classNames.bind(styles)

interface Props extends Config {
  isFrom: boolean
  selected?: string
  onSelect: (asset: string) => void
  oppositeValue?: string
  onSelectOpposite: (symbol: string) => void
  pairs: Pair[]
  type: string
}

const SwapTokens = ({
  isFrom,
  selected,
  onSelect,
  oppositeValue,
  onSelectOpposite,
  pairs,
  type,
  ...props
}: Props) => {
  const { priceKey, balanceKey } = props
  const { formatTokenName } = props

  const { find } = useContract()
  const { loading } = useCombineKeys([priceKey, balanceKey])

  /* search */
  const [value, setValue] = useState("")

  const selectedList = (value: string | undefined) => {
    let assetItemMap: Set<string> = new Set<string>()

    pairs.forEach((pair) => {
      if (
        value === pair.pair[0].contract_addr &&
        !assetItemMap.has(pair.pair[1].contract_addr)
      ) {
        assetItemMap.add(pair.pair[1].contract_addr)
      }

      if (
        value === pair.pair[1].contract_addr &&
        !assetItemMap.has(pair.pair[0].contract_addr)
      ) {
        assetItemMap.add(pair.pair[0].contract_addr)
      }
    })

    return Array.from(assetItemMap.values())
  }

  const allList = () => {
    let assetItemMap: Set<string> = new Set<string>()
    pairs.forEach((pair) => {
      if (type === Type.WITHDRAW) {
        const tokeninfo = tokenInfos.get(pair.liquidity_token)
        if (tokeninfo !== undefined) {
          assetItemMap.add(tokeninfo.contract_addr)
        }
      } else {
        pair.pair.forEach((tokenInfo) => {
          if (!assetItemMap.has(tokenInfo.symbol)) {
            assetItemMap.add(tokenInfo.contract_addr)
          }
        })
      }
    })

    return Array.from(assetItemMap.values())
  }

  const list: string[] = !(oppositeValue === undefined || oppositeValue === "")
    ? selectedList(oppositeValue)
    : allList()

  const handleSelect = (contractAddr: string) => {
    onSelect(contractAddr)
  }

  return (
    <div className={styles.component}>
      <section className={styles.search}>
        <input
          id="search"
          name="search"
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoFocus
          placeholder="Search name or address"
        />
      </section>

      <ul className={classNames(styles.list, { loading })}>
        {list && list.length > 0 ? (
          list
            .filter((contractAddr) => {
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

              return [symbol].some((text) =>
                text.toLowerCase().includes(value.toLowerCase())
              )
            })
            .sort((a, b) => {
              const hasA = balanceKey && gt(find(balanceKey, a), 0) ? 1 : 0
              const hasB = balanceKey && gt(find(balanceKey, b), 0) ? 1 : 0
              return hasB - hasA
            })
            .map((item) => {
              const isSelected = item === selected

              let swapToken = {
                symbol: "",
                name: "",
              }

              if (type === Type.WITHDRAW) {
                const tokenInfoList = lpTokenInfos.get(item)
                swapToken = {
                  symbol: tokenInfoList
                    ? tokenInfoList[0].symbol + "-" + tokenInfoList[1].symbol
                    : "",
                  name: "",
                }
              } else {
                const tokenInfo = tokenInfos.get(item)

                swapToken = {
                  symbol: tokenInfo?.symbol || "",
                  name: tokenInfo?.name || "",
                }
              }

              return (
                <li key={item}>
                  <button
                    type="button"
                    className={cx(styles.button, { disabled: isSelected })}
                    onClick={() => handleSelect(item)}
                  >
                    <SwapToken
                      {...swapToken}
                      formatTokenName={formatTokenName}
                    />
                  </button>
                </li>
              )
            })
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
