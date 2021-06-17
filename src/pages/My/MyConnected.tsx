import { Fragment } from "react"
import { useWallet } from "@terra-money/wallet-provider"
import { gt } from "../../libs/math"
import useLocalStorage from "../../libs/useLocalStorage"
import { useMyHolding } from "../../data/my/holding"
import { useMyLimitOrder } from "../../data/my/limit"
import { useMyBorrowing } from "../../data/my/borrowing"
import { useMyPool } from "../../data/my/pool"
import { useMyFarming } from "../../data/my/farming"
import { useMyGov } from "../../data/my/gov"
import { useMyShortFarming } from "../../data/my/short"
import useTxs from "../../data/stats/txs"

import Tab from "../../components/Tab"
import { Gutter } from "../../components/Grid"

import TotalValue from "./TotalValue"
import Holding from "./Holding"
import Borrowing from "./Borrowing"
import Pool from "./Pool"
import Farming from "./Farming"
import ShortFarming from "./ShortFarming"
import LimitOrder from "./LimitOrder"
import Gov from "./Gov"
import HistoryList from "./HistoryList"

import styles from "./MyConnected.module.scss"

enum Tabs {
  ALL = "All",
  HOLDING = "Holding",
  LIMITORDER = "Limit Order",
  BORROWING = "Borrowing",
  POOL = "Pool",
  FARMING = "Farming",
  GOVERN = "Govern",
  HISTORY = "History",
}

const MyConnected = () => {
  const { disconnect } = useWallet()

  /* data */
  const holding = useMyHolding()
  const limitOrder = useMyLimitOrder()
  const borrowing = useMyBorrowing()
  const pool = useMyPool()
  const farming = useMyFarming()
  const short = useMyShortFarming()
  const gov = useMyGov()
  const txs = useTxs()

  /* tab */
  const [{ tab }, setTab] = useLocalStorage<{ tab: Tabs }>("myPage", {
    tab: Tabs.ALL,
  })

  const hasHolding = !!holding.dataSource.length
  const hasLimitOrder = !!limitOrder.dataSource.length
  const hasBorrowing = !!borrowing.dataSource.length
  const hasPool = !!pool.dataSource.length
  const hasFarming = !!farming.dataSource.length || !!short.dataSource.length
  const hasGov = !!gov.dataSource.length || gt(gov.staked, 0)
  const hasTxs = !!txs.data.length

  const tabs = [
    {
      label: Tabs.HOLDING,
      hidden: !hasHolding,
      component: <Holding />,
    },
    {
      label: Tabs.LIMITORDER,
      hidden: !hasLimitOrder,
      component: <LimitOrder />,
    },
    {
      label: Tabs.BORROWING,
      hidden: !hasBorrowing,
      component: <Borrowing />,
    },
    {
      label: Tabs.POOL,
      hidden: !hasPool,
      component: <Pool />,
    },
    {
      label: Tabs.FARMING,
      hidden: !hasFarming,
      component: [<Farming />, <ShortFarming />],
    },
    {
      label: Tabs.GOVERN,
      hidden: !hasGov,
      component: <Gov />,
    },
    {
      label: Tabs.HISTORY,
      hidden: !hasTxs,
      component: <HistoryList {...txs} />,
    },
  ].filter(({ hidden }) => !hidden)

  const contents = tabs.filter(({ label }) => tab === Tabs.ALL || tab === label)

  return (
    <>
      <TotalValue />

      {!!tabs.length && (
        <section className={styles.main}>
          <Tab
            tabs={[Tabs.ALL, ...tabs.map(({ label }) => label)]}
            current={tab}
            onClick={(tab) => setTab({ tab: tab as Tabs })}
          >
            {contents.map(({ component, label }) =>
              Array.isArray(component) ? (
                <Fragment key={label}>
                  {component.map((component, index) => (
                    <Gutter key={index}>{component}</Gutter>
                  ))}
                </Fragment>
              ) : (
                <Gutter key={label}>{component}</Gutter>
              )
            )}
          </Tab>
        </section>
      )}

      {disconnect && (
        <p className={styles.footer}>
          <button className={styles.disconnect} onClick={disconnect}>
            Disconnect
          </button>
        </p>
      )}
    </>
  )
}

export default MyConnected
