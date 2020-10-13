import React from "react"
import { useRouteMatch } from "react-router-dom"
import classNames from "classnames/bind"
import { LP } from "../../constants"
import { gt } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { percent } from "../../libs/num"
import { useContract } from "../../hooks"
import { BalanceKey, AssetInfoKey } from "../../hooks/contractKeys"
import Card from "../../components/Card"
import Icon from "../../components/Icon"
import Count from "../../components/Count"
import { DlFooter } from "../../components/Dl"
import CountWithResult from "../../components/CountWithResult"
import getLpName from "./getLpName"
import StakeImage from "./StakeImage"
import styles from "./StakeItem.module.scss"

const cx = classNames.bind(styles)

interface Props {
  symbol: string
  apr: string
  emphasize?: boolean
}

const StakeItem = ({ symbol, apr, emphasize }: Props) => {
  const { url } = useRouteMatch()
  const { find } = useContract()

  const staked = gt(find(BalanceKey.LPSTAKED, symbol), 0)
  const stakable = gt(find(BalanceKey.LPSTAKABLE, symbol), 0)

  const badges = [
    ...insertIf(staked, { label: "Staked", color: "blue" }),
    ...insertIf(stakable, { label: "Stakable", color: "slate" }),
  ]

  const stats = [
    {
      title: "APR",
      content: <Count format={percent}>{apr}</Count>,
    },
    {
      title: "Total Staked",
      content: (
        <CountWithResult
          keys={[AssetInfoKey.LPTOTALSTAKED]}
          symbol={LP}
          integer
        >
          {find(AssetInfoKey.LPTOTALSTAKED, symbol)}
        </CountWithResult>
      ),
    },
  ]

  return (
    <Card to={`${url}/${symbol}`} badges={badges} className={cx({ emphasize })}>
      <article className={styles.component}>
        <div className={styles.main}>
          <StakeImage symbol={symbol} />

          <header className={styles.header}>
            <h1 className={styles.title}>{getLpName(symbol)}</h1>
            <Icon name="chevron_right" size={20} />
          </header>

          <DlFooter
            list={stats}
            className={styles.stats}
            ddClassName={styles.dd}
          />
        </div>
      </article>
    </Card>
  )
}

export default StakeItem
