import { useEffect, useMemo, useState } from "react"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import SwapSelectToken from "./SwapSelectToken"
import SwapTokens from "./SwapTokens"
import Modal from "./../components/Modal"
import SwapCard from "./../components/SwapCard"
import MESSAGE from "../lang/MESSAGE.json"
import usePairs, { lpTokenInfos, Pair, tokenInfos } from "../rest/usePairs"
import { Type } from "pages/Swap"
import useAPI from "rest/useAPI"

export interface Config {
  /** Current value */
  value: string
  symbol: string
  /** Function to call when a value is selected */
  onSelect: (asset: string, isUnable?: boolean) => void
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

export type SwapTokenAsset = {
  symbol: string
  name: string
  contract_addr: string
  icon: string[]
  verified: boolean
  isUnable: boolean
}

const removeDuplicatesFilter = (
  value: string,
  index: number,
  array: string[]
) => array.indexOf(value) === index

export default (config: Config, pairs: Pair[], type: string) => {
  const { isLoading: isPairLoading } = usePairs()

  const {
    value: selected,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol,
    onSelect,
    isFrom,
    oppositeValue,
  } = config
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => (isOpen ? handleSelect(selected) : setIsOpen(!isOpen))

  /* select asset */
  const handleSelect = (asset: string, isUnable?: boolean) => {
    onSelect(asset, isUnable)
    setIsOpen(false)
  }

  const select = { ...config, isOpen, asset: selected, type, onClick: toggle }

  const [addressList, setAddressList] = useState<string[]>([])
  const [availableAddressList, setAvailableAddressList] = useState<string[]>()
  const { loadSwappableTokenAddresses } = useAPI()

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
  }, [pairs, type, isPairLoading])

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
  }, [
    addressList,
    loadSwappableTokenAddresses,
    oppositeValue,
    pairs,
    type,
    isPairLoading,
  ])

  const assetList = useMemo<SwapTokenAsset[] | undefined>(() => {
    if (!availableAddressList || !addressList) {
      return undefined
    }
    return [...availableAddressList, ...addressList]
      .filter(removeDuplicatesFilter)
      .sort((a, b) => {
        const vA = tokenInfos.get(a)?.verified
        const vB = tokenInfos.get(b)?.verified

        return vA && vB ? 0 : vB === true ? 1 : vA === true ? -1 : 0
      })
      .map((item) => {
        const isUnable = !availableAddressList?.includes(item)

        if (type === Type.WITHDRAW) {
          const tokenInfoList = lpTokenInfos.get(item)
          return {
            symbol: tokenInfoList
              ? tokenInfoList[0].symbol + "-" + tokenInfoList[1].symbol
              : "",
            name: "",
            contract_addr: item,
            icon: tokenInfoList
              ? [tokenInfoList[0].icon, tokenInfoList[1].icon]
              : ["", ""],
            verified: false,
            isUnable,
          }
        }

        const tokenInfo = tokenInfos.get(item)
        return {
          symbol: tokenInfo?.symbol || "",
          name: tokenInfo?.name || "",
          contract_addr: item,
          icon: [tokenInfo ? tokenInfo.icon : ""],
          verified: tokenInfo?.verified || false,
          isUnable,
        }
      })
      .filter((item) => !!item?.symbol) as SwapTokenAsset[]
  }, [addressList, availableAddressList, type])

  return {
    isOpen,
    button: <SwapSelectToken {...select} />,
    assets: (
      <Modal
        role="modal"
        isOpen={isOpen}
        open={() => setIsOpen(true)}
        close={() => setIsOpen(false)}
        isCloseBtn={true}
      >
        <SwapCard logoTitle={MESSAGE.Form.Button.SelectToken}>
          <SwapTokens
            {...config}
            isFrom={isFrom}
            selected={selected}
            onSelect={handleSelect}
            type={type}
            assetList={assetList}
          />
        </SwapCard>
      </Modal>
    ),
  }
}
