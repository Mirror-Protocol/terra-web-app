import { useRouteMatch } from "react-router-dom"

import { MIR, UUSD } from "../../constants"
import { minus, gt, number } from "../../libs/math"
import { useRefetch } from "../../hooks"
import { useContract, useContractsAddress } from "../../hooks"
import { BalanceKey, AssetInfoKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"

import Grid from "../../components/Grid"
import StakeItemCard from "../../components/StakeItemCard"
import LoadingTitle from "../../components/LoadingTitle"
import CountWithResult from "../../containers/CountWithResult"
import usePool from "../../forms/usePool"

import StakeListTitle from "./StakeListTitle"
import styles from "./StakeList.module.scss"

const StakeList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]
  const { url } = useRouteMatch()
  const { loading } = useRefetch(keys)

  /* context */
  const { listed, getSymbol } = useContractsAddress()
  const { find } = useContract()
  const stats = useAssetStats()
  const { apr } = stats
  const getPool = usePool()

  const getItem = ({ token }: ListedItem) => {
    const apy = stats["apy"][token] ?? "0"
    const apr = stats["apr"][token] ?? "0"
    const symbol = getSymbol(token)

    const totalStakedLP = find(AssetInfoKey.LPTOTALSTAKED, token)
    const { fromLP } = getPool({ amount: totalStakedLP, token })

    return {
      token,
      symbol,
      staked: gt(find(BalanceKey.LPSTAKED, token), 0),
      stakable: gt(find(BalanceKey.LPSTAKABLE, token), 0),
      apr,
      apy,
      totalStaked: (
        <CountWithResult
          keys={[AssetInfoKey.LPTOTALSTAKED]}
          symbol={UUSD}
          integer
        >
          {fromLP.value}
        </CountWithResult>
      ),
      to: `${url}/${token}`,
      emphasize: symbol === MIR,
    }
  }

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <StakeListTitle />
      </LoadingTitle>

      <Grid wrap={3}>
        {listed
          .map(getItem)
          .sort(({ token: a }, { token: b }) => number(minus(apr[b], apr[a])))
          .sort(
            ({ symbol: a }, { symbol: b }) =>
              Number(b === "MIR") - Number(a === "MIR")
          )
          .map((item) => (
            <StakeItemCard {...item} key={item.token} />
          ))}
      </Grid>
    </article>
  )
}

export default StakeList
