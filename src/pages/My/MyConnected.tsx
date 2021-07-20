import { Fragment, useCallback, useEffect, useMemo } from "react"
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
  /* data */
  const holding = useMyHolding()
  const limitOrder = useMyLimitOrder()
  const borrowing = useMyBorrowing()
  const pool = useMyPool()
  const farming = useMyFarming()
  const short = useMyShortFarming()
  const gov = useMyGov()
  const txs = useTxs()

  const isLoading = [
    holding,
    limitOrder,
    borrowing,
    pool,
    farming,
    short,
    gov,
    txs,
  ].some(({ isLoading }) => isLoading)

  /* tab */
  const [{ tab }, setMyPage] = useLocalStorage<{ tab: Tabs }>("myPage", {
    tab: Tabs.ALL,
  })

  const setTab = useCallback((tab: Tabs) => setMyPage({ tab }), [setMyPage])

  const hasHolding = !!holding.dataSource.length
  const hasLimitOrder = !!limitOrder.dataSource.length
  const hasBorrowing = !!borrowing.dataSource.length
  const hasPool = !!pool.dataSource.length
  const hasFarming = !!farming.dataSource.length || !!short.dataSource.length
  const hasGov = !!gov.dataSource.length || gt(gov.staked, 0)
  const hasTxs = !!txs.data.length

  const tabs = useMemo(
    () =>
      [
        { label: Tabs.HOLDING, hidden: !hasHolding },
        { label: Tabs.LIMITORDER, hidden: !hasLimitOrder },
        { label: Tabs.BORROWING, hidden: !hasBorrowing },
        { label: Tabs.POOL, hidden: !hasPool },
        { label: Tabs.FARMING, hidden: !hasFarming },
        { label: Tabs.GOVERN, hidden: !hasGov },
        { label: Tabs.HISTORY, hidden: !hasTxs },
      ].filter(({ hidden }) => !hidden),
    [
      hasBorrowing,
      hasFarming,
      hasGov,
      hasHolding,
      hasLimitOrder,
      hasPool,
      hasTxs,
    ]
  )

  const components = {
    [Tabs.HOLDING]: [<Holding />],
    [Tabs.LIMITORDER]: [<LimitOrder />],
    [Tabs.BORROWING]: [<Borrowing />],
    [Tabs.POOL]: [<Pool />],
    [Tabs.FARMING]: [<Farming />, <ShortFarming />],
    [Tabs.GOVERN]: [<Gov />],
    [Tabs.HISTORY]: [<HistoryList {...txs} />],
  }

  // set tab as all if stored tab is invalid
  useEffect(() => {
    if (!isLoading) {
      const isValid = !!tabs.find(({ label }) => tab === label)
      !isValid && tab !== Tabs.ALL && setTab(Tabs.ALL)
    }
  }, [isLoading, setTab, tab, tabs])

  const contents = Object.entries(components).filter(
    ([label]) => tab === Tabs.ALL || label === tab
  )

  return (
    <>
      <TotalValue />

      {!!tabs.length && (
        <section className={styles.main}>
          <Tab
            tabs={[Tabs.ALL, ...tabs.map(({ label }) => label)]}
            current={tab}
            onClick={(tab) => setTab(tab as Tabs)}
          >
            {contents.map(([label, component]) =>
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
    </>
  )
}

export default MyConnected
