import { useCallback, useEffect, useMemo, useState } from "react"
import { isAssetInfo, isNativeInfo, tokenInfos } from "./usePairs"
import { div, gt, times, plus, minus, floor } from "../libs/math"
import { Type } from "../pages/Swap"
import useAPI from "./useAPI"
import { calcTax } from "../forms/formHelpers"

interface Pool {
  assets: Token[]
  total_share: string
}

interface PoolResult {
  estimated: string
  price1: string
  price2: string
  afterPool: string
  LP: string
  poolAmount1: string
  poolAmount2: string
  totalShare: string
  // fromLP: Asset[]
  // text: string
}

export default (
  contract?: string,
  symbol?: string,
  amount?: string,
  type?: string,
  balance?: string
) => {
  const [poolLoading, setLoading] = useState(true)
  const { loadTaxInfo, loadTaxRate, loadPool } = useAPI()

  const [result, setResult] = useState<PoolResult>()

  const getTaxes = useCallback(
    async (assets: { info: AssetInfo | NativeInfo; amount: string }[]) => {
      const taxes = await Promise.all(
        assets.map((asset) =>
          loadTaxRate().then((rate) =>
            isNativeInfo(asset.info)
              ? loadTaxInfo(asset.info.native_token.denom).then((cap) =>
                  cap ? calcTax(asset.amount, cap, rate) : "0"
                )
              : "0"
          )
        )
      )
      return taxes
    },
    [loadTaxInfo, loadTaxRate]
  )

  useEffect(() => {
    if (contract) {
      setResult(undefined)
      setLoading(true)
      loadPool(contract)
        .then(async (res: Pool) => {
          let fromValue = "0"
          let fromDecimal = 6
          let toValue = "0"
          let toDecimal = 6
          let asset0Decimal = 6
          let asset1Decimal = 6
          if (
            !(contract === undefined || contract === "" || res === undefined)
          ) {
            if (isAssetInfo(res.assets[0].info)) {
              const tokenInfo = tokenInfos.get(
                res.assets[0].info.token.contract_addr
              )
              if (tokenInfo) {
                asset0Decimal = tokenInfo.decimals
              }
            }

            if (isAssetInfo(res.assets[1].info)) {
              const tokenInfo = tokenInfos.get(
                res.assets[1].info.token.contract_addr
              )
              if (tokenInfo) {
                asset1Decimal = tokenInfo.decimals
              }
            }

            if (isAssetInfo(res.assets[1].info)) {
              if (
                tokenInfos.get(res.assets[1].info.token.contract_addr)
                  ?.symbol === symbol
              ) {
                fromValue = res.assets[1].amount
                fromDecimal = asset1Decimal
                toValue = res.assets[0].amount
                toDecimal = asset0Decimal
              } else {
                fromValue = res.assets[0].amount
                fromDecimal = asset0Decimal
                toValue = res.assets[1].amount
                toDecimal = asset1Decimal
              }
            } else {
              if (
                tokenInfos.get(res.assets[1].info.native_token.denom)
                  ?.symbol === symbol
              ) {
                fromValue = res.assets[1].amount
                fromDecimal = asset1Decimal
                toValue = res.assets[0].amount
                toDecimal = asset0Decimal
              } else {
                fromValue = res.assets[0].amount
                fromDecimal = asset0Decimal
                toValue = res.assets[1].amount
                toDecimal = asset1Decimal
              }
            }
          }

          const calculatedAmount = times(amount, Math.pow(10, fromDecimal))

          const rateFromDecimal = Math.pow(10, fromDecimal - 6)
          const rateToDecimal = Math.pow(10, toDecimal - 6)
          const rateDiffDecimal = Math.pow(10, toDecimal - fromDecimal)

          const rate1 = res
            ? div(div(fromValue, res.total_share), rateFromDecimal)
            : "0"
          const rate2 = res
            ? div(div(toValue, res.total_share), rateToDecimal)
            : "0"

          let price1 = "0"
          let price2 = "0"
          let estimated = "0"
          let LP = "0"
          let afterPool = "0"
          if (type === Type.WITHDRAW) {
            // withdraw
            LP = times(calculatedAmount, rateDiffDecimal)
            if (res && gt(res.total_share, 0) && gt(calculatedAmount, 0)) {
              const asset0Amount = floor(
                times(times(rate1, LP), rateFromDecimal)
              )
              const asset1Amount = floor(times(times(rate2, LP), rateToDecimal))
              const taxes = await getTaxes([
                { info: res.assets[0].info, amount: asset0Amount },
                { info: res.assets[1].info, amount: asset1Amount },
              ])
              estimated =
                minus(asset0Amount, taxes[0]) +
                "-" +
                minus(asset1Amount, taxes[1])
            }
            price1 =
              res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(times(rate1, LP), LP)
                : "0"
            price2 =
              res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(times(rate2, LP), LP)
                : "0"
            LP = times(
              minus(div(balance, rateDiffDecimal), calculatedAmount),
              rateDiffDecimal
            )
            afterPool =
              res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(LP, plus(res.total_share, LP))
                : "0"
          } else {
            // provide
            LP =
              res && gt(calculatedAmount, 0)
                ? div(div(calculatedAmount, rate1), rateFromDecimal)
                : "0"
            estimated =
              res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? floor(times(times(LP, rate2), rateToDecimal))
                : "0"
            price1 =
              res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(div(calculatedAmount, LP), rateFromDecimal)
                : "0"
            price2 =
              res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(div(estimated, LP), rateToDecimal)
                : "0"
            afterPool =
              res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(LP, plus(LP, res.total_share))
                : "0"
          }

          setResult({
            price1,
            price2,
            estimated,
            LP,
            afterPool,
            poolAmount1: res.assets[0].amount,
            poolAmount2: res.assets[1].amount,
            totalShare: res.total_share,
          })
        })
        .catch(() => {
          setResult(undefined)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [contract, amount, symbol, loadPool, type, balance, getTaxes])

  return useMemo(() => ({ result, poolLoading }), [poolLoading, result])
}
