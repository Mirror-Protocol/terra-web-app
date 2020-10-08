import React from "react"
import { minus, number } from "../../libs/math"
import { useCombineResult, useContractsAddress, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import Grid from "../../components/Grid"
import LoadingTitle from "../../components/LoadingTitle"
import StakeItem from "./StakeItem"
import styles from "./StakeList.module.scss"

const StakeList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]
  const { listed } = useContractsAddress()
  const { loading } = useCombineResult(keys)
  const { apr } = useAssetStats()
  useRefetch(keys)

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <p>Earn MIR tokens by staking LP Tokens!</p>
      </LoadingTitle>

      <Grid wrap={3}>
        {Array.from(listed)
          .sort(({ token: a }, { token: b }) => number(minus(apr[b], apr[a])))
          // .sort(({ symbol: a }, { symbol: b }) => {
          //   const stakedA = gt(find(BalanceKey.LPSTAKED, a), 0) ? 1 : 0
          //   const stakedB = gt(find(BalanceKey.LPSTAKED, b), 0) ? 1 : 0
          //   const stakableA = gt(find(BalanceKey.LPSTAKABLE, a), 0) ? 1 : 0
          //   const stakableB = gt(find(BalanceKey.LPSTAKABLE, b), 0) ? 1 : 0
          //   return stakedB - stakedA || stakableB - stakableA
          // })
          .map(({ symbol, token }) => (
            <StakeItem symbol={symbol} apr={apr[token] ?? "0"} key={symbol} />
          ))}
      </Grid>
    </article>
  )
}

export default StakeList
