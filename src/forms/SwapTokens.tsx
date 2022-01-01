import React, { useEffect, useState } from "react"
import classNames from "classnames/bind"
import { gt } from "../libs/math"
import { useContract, useCombineKeys, useContractsAddress } from "../hooks"
import { Config } from "./useSelectAsset"
import SwapToken from "./SwapToken"
import styles from "./SwapTokens.module.scss"
import { lpTokenInfos, Pair } from "../rest/usePairs"
import { Type } from "../pages/Swap"
import { tokenInfos } from "../rest/usePairs"
import Loading from "components/Loading"
import useAPI from "rest/useAPI"

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
  const { priceKey, balanceKey, formatTokenName } = props

  const { find } = useContract()
  const { loading } = useCombineKeys([priceKey, balanceKey])
  const { loadSwappableTokenAddresses } = useAPI()

  const { isNativeToken } = useContractsAddress()

  /* search */
  const [value, setValue] = useState("")

  const [addressList, setAddressList] = useState<string[]>([])

  useEffect(() => {
    let isCancelled = false
    const fetchAddressList = async () => {
      if (oppositeValue) {
        if (type === Type.SWAP) {
          const res = await loadSwappableTokenAddresses(oppositeValue)
          if (Array.isArray(res)) {
            if (!isCancelled) {
              setAddressList(res)
            }
          }
          return
        }

        const assetItemMap: Set<string> = new Set<string>()
        pairs.forEach((pair) => {
          if (
            oppositeValue === pair.pair[0].contract_addr &&
            !assetItemMap.has(pair.pair[1].contract_addr)
          ) {
            assetItemMap.add(pair.pair[1].contract_addr)
          }

          if (
            oppositeValue === pair.pair[1].contract_addr &&
            !assetItemMap.has(pair.pair[0].contract_addr)
          ) {
            assetItemMap.add(pair.pair[0].contract_addr)
          }
        })

        if (!isCancelled) {
          setAddressList(Array.from(assetItemMap.values()))
        }
      } else {
        const assetItemMap: Set<string> = new Set<string>()
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

        if (!isCancelled) {
          setAddressList(Array.from(assetItemMap.values()))
        }
      }
    }

    fetchAddressList()

    return () => {
      isCancelled = true
    }
  }, [loadSwappableTokenAddresses, oppositeValue, pairs, type])

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
        {addressList && addressList.length > 0 ? (
          addressList
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

              return [symbol].some(
                (text) => !!text?.toLowerCase().includes(value?.toLowerCase())
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
                contract_addr: "",
                icon: [""],
                verified: false,
              }

              if (type === Type.WITHDRAW) {
                const tokenInfoList = lpTokenInfos.get(item)
                swapToken = {
                  symbol: tokenInfoList
                    ? tokenInfoList[0].symbol + "-" + tokenInfoList[1].symbol
                    : "",
                  name: "",
                  contract_addr: item,
                  icon: tokenInfoList
                    ? [tokenInfoList[0].icon, tokenInfoList[1].icon]
                    : ["", ""],
                  verified: false,
                }
              } else {
                const tokenInfo = tokenInfos.get(item)

                swapToken = {
                  symbol: tokenInfo?.symbol || "",
                  name: tokenInfo?.name || "",
                  contract_addr: isNativeToken(item) ? "" : item,
                  icon: [tokenInfo ? tokenInfo.icon : ""],
                  verified: tokenInfo?.verified || false,
                }
              }

              if (!swapToken.symbol) {
                return undefined
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
