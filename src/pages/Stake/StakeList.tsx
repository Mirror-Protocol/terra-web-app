import React from "react"
import { without } from "ramda"
import { MIR } from "../../constants"
import { minus, number } from "../../libs/math"
import { useCombineKeys, useContractsAddress, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import Grid from "../../components/Grid"
import LoadingTitle from "../../components/LoadingTitle"
import StakeListTitle from "./StakeListTitle"
import StakeItem from "./StakeItem"
import styles from "./StakeList.module.scss"

const StakeList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]

  useRefetch(keys)
  const { listed, whitelist, getToken } = useContractsAddress()
  const { loading } = useCombineKeys(keys)
  const { apr } = useAssetStats()
  const mirror = whitelist[getToken(MIR)]

  const renderItem = ({ symbol, token }: ListedItem): JSX.Element => (
    <StakeItem
      token={token}
      apr={apr[token] ?? "0"}
      emphasize={symbol === MIR}
      key={symbol}
    />
  )

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <StakeListTitle />
      </LoadingTitle>

      <Grid wrap={3}>
        {renderItem(mirror)}
        {Array.from(without([mirror], listed))
          .sort(({ token: a }, { token: b }) => number(minus(apr[b], apr[a])))
          .map(renderItem)}
      </Grid>
    </article>
  )
}

export default StakeList
