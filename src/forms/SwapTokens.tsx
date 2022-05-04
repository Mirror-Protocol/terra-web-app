import React, { useEffect, useState } from "react"
import classNames from "classnames/bind"
import { useCombineKeys } from "../hooks"
import { Config } from "./useSelectAsset"
import SwapToken from "./SwapToken"
import styles from "./SwapTokens.module.scss"
import { lpTokenInfos, Pair } from "../rest/usePairs"
import { Type } from "../pages/Swap"
import { tokenInfos } from "../rest/usePairs"
import Loading from "components/Loading"
import useAPI from "rest/useAPI"
import { useContractsAddress } from "hooks/useContractsAddress"

const cx = classNames.bind(styles)

interface Props extends Config {
  isFrom: boolean
  selected?: string
  onSelect: (asset: string, isUnable?: boolean) => void
  oppositeValue?: string
  onSelectOpposite: (symbol: string) => void
  pairs: Pair[]
  type: string
}

const removeDuplicatesFilter = (
  value: string,
  index: number,
  array: string[]
) => array.indexOf(value) === index

const SwapTokens = ({
  isFrom,
  selected,
  onSelect: handleSelect,
  oppositeValue,
  onSelectOpposite,
  pairs,
  type,
  ...props
}: Props) => {
  const { priceKey, balanceKey, formatTokenName } = props

  const { loading } = useCombineKeys([priceKey, balanceKey])
  const { loadSwappableTokenAddresses } = useAPI()

  const { isNativeToken } = useContractsAddress()

  /* search */
  const [searchKeyword, setSearchKeyword] = useState("")

  const [addressList, setAddressList] = useState<string[]>([])
  const [availableAddressList, setAvailableAddressList] = useState<string[]>()

  useEffect(() => {
    if (type === Type.SWAP || type === Type.PROVIDE) {
      setAddressList(
        pairs
          .flatMap((pair) => pair.pair)
          .map((tokenInfo) => tokenInfo.contract_addr)
          .filter(removeDuplicatesFilter)
      )
    } else {
      setAddressList(
        (
          pairs
            .map((pair) => tokenInfos.get(pair.liquidity_token)?.contract_addr)
            .filter((item) => !!item) as string[]
        ).filter(removeDuplicatesFilter)
      )
    }
  }, [pairs, type])

  useEffect(() => {
    let isAborted = false
    setAvailableAddressList([])

    const fetchAvailableAddressList = async () => {
      if (!oppositeValue) {
        setAvailableAddressList(addressList)
        return
      }

      if (type === Type.SWAP) {
        const res = await loadSwappableTokenAddresses(oppositeValue)
        if (Array.isArray(res)) {
          if (!isAborted) {
            setAvailableAddressList(res)
          }
        }
        return
      }

      if (type === Type.PROVIDE) {
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

        if (!isAborted) {
          setAvailableAddressList(Array.from(assetItemMap.values()))
        }
        return
      }
      setAvailableAddressList(addressList)
    }

    fetchAvailableAddressList()

    return () => {
      isAborted = true
    }
  }, [addressList, loadSwappableTokenAddresses, oppositeValue, pairs, type])

  return (
    <div className={styles.component}>
      <section className={styles.search}>
        <input
          id="search"
          name="search"
          onChange={(e) => setSearchKeyword(e.target.value)}
          autoComplete="off"
          autoFocus
          placeholder="Search name or address"
        />
      </section>

      <ul className={classNames(styles.list, { loading })}>
        {addressList &&
        addressList.length > 0 &&
        availableAddressList &&
        availableAddressList?.length > 0 ? (
          [...availableAddressList, ...addressList]
            .filter(removeDuplicatesFilter)
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

              return (
                symbol.toLowerCase().indexOf(searchKeyword.toLowerCase()) >=
                  0 ||
                contractAddr
                  .toLowerCase()
                  .indexOf(searchKeyword.toLowerCase()) >= 0
              )
            })
            .sort((a, b) => {
              const vA = tokenInfos.get(a)?.verified
              const vB = tokenInfos.get(b)?.verified

              return vA && vB ? 0 : vB === true ? 1 : vA === true ? -1 : 0
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

              const isUnable = !availableAddressList?.includes(item)

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
                    className={cx(styles.button, {
                      disabled: isUnable,
                      selected: isSelected,
                    })}
                    onClick={() => handleSelect(item, isUnable)}
                  >
                    <SwapToken
                      {...swapToken}
                      formatTokenName={formatTokenName}
                      highlightString={searchKeyword}
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
