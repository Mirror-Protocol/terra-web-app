import React from "react"
import { without } from "ramda"
import Tooltip from "../../lang/Tooltip.json"
import { MIR } from "../../constants"
import { minus, number } from "../../libs/math"
import { useCombineKeys, useContractsAddress, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import Grid from "../../components/Grid"
import LoadingTitle from "../../components/LoadingTitle"
import { TooltipIcon } from "../../components/Tooltip"
import StakeItem from "./StakeItem"
import styles from "./StakeList.module.scss"

const StakeList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]

  useRefetch(keys)
  const { listed, getListedItem } = useContractsAddress()
  const { loading } = useCombineKeys(keys)
  const { apr } = useAssetStats()
  const mirror = getListedItem(MIR)

  const renderItem = ({ symbol, token }: ListedItem): JSX.Element => (
    <StakeItem
      symbol={symbol}
      apr={apr[token] ?? "0"}
      emphasize={symbol === MIR}
      key={symbol}
    />
  )

  const tooltip = (
    <section>
      <article>
        <p>{Tooltip.Stake.Title}</p>
      </article>

      <article>
        <h1>APR</h1>
        <p>{Tooltip.Stake.APR}</p>
      </article>

      <article>
        <h1>Total Staked</h1>
        <p>{Tooltip.Stake.TotalStaked}</p>
      </article>
    </section>
  )

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <TooltipIcon content={tooltip}>
          <p>Earn MIR tokens by staking LP Tokens!</p>
        </TooltipIcon>
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
