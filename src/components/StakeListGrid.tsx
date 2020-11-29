import { ReactNode } from "react"
import classNames from "classnames/bind"
import { insertIf } from "../libs/utils"
import getLpName from "../libs/getLpName"
import Grid from "./Grid"
import Card from "./Card"
import Icon from "./Icon"
import TokenPair from "./TokenPair"
import { DlFooter } from "./Dl"
import styles from "./StakeListGrid.module.scss"

const cx = classNames.bind(styles)

interface Item {
  token: string
  symbol: string
  staked: boolean
  stakable: boolean
  apr: ReactNode
  totalStaked: ReactNode
  to: string
  emphasize?: boolean
}

const StakeListGrid = ({ list }: { list: Item[] }) => (
  <Grid wrap={3}>
    {list
      .sort(
        ({ symbol: a }, { symbol: b }) =>
          Number(b === "MIR") - Number(a === "MIR")
      )
      .map(({ token, symbol, to, emphasize, ...item }) => {
        const { staked, stakable, apr, totalStaked } = item
        const badges = [
          ...insertIf(staked, { label: "Staked", color: "blue" }),
          ...insertIf(stakable, { label: "Stakable", color: "slate" }),
        ]

        const stats = [
          { title: "APR", content: apr },
          { title: "Total Staked", content: totalStaked },
        ]

        return (
          <Card
            to={to}
            badges={badges}
            className={cx({ emphasize })}
            key={token}
          >
            <article className={styles.component}>
              <div className={styles.main}>
                <TokenPair symbol={symbol} />

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
      })}
  </Grid>
)

export default StakeListGrid
