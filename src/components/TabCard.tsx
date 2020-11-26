import { ReactNode, useState } from "react"
import classNames from "classnames"
import MESSAGE from "../lang/MESSAGE.json"
import Card from "./Card"
import styles from "./TabCard.module.scss"

type Tab = string

interface Props {
  tabs: Tab[]
  children: (current?: Tab) => ReactNode
}

const TabCard = ({ tabs, children }: Props) => {
  const [current, setCurrent] = useState<Tab>()

  const renderItem = (tab?: Tab) => (
    <li key={tab}>
      <button
        className={classNames(styles.button, tab === current && styles.active)}
        onClick={() => setCurrent(tab)}
      >
        {tab ?? MESSAGE.Component.Tab.All}
      </button>
    </li>
  )

  const header = (
    <ul className={styles.list}>
      {renderItem()}
      {tabs.map(renderItem)}
    </ul>
  )

  return (
    <Card header={header} full>
      {children(current)}
    </Card>
  )
}

export default TabCard
