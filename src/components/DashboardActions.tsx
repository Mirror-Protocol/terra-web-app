import { Link, LinkProps } from "react-router-dom"
import Tippy, { TippyProps } from "@tippyjs/react"
import { DefaultTippyProps } from "./Tooltip"
import Icon from "./Icon"
import styles from "./DashboardActions.module.scss"

const DropdownTippyProps: TippyProps = {
  ...DefaultTippyProps,
  placement: "bottom-end",
  trigger: "click",
}

const DashboardActions = ({ list }: { list: LinkProps[] }) => {
  const renderList = () => (
    <ul className={styles.dropdown}>{list.map(renderItem)}</ul>
  )

  const renderItem = (item: LinkProps, index: number) =>
    item.to && (
      <li key={index}>
        <Link {...item} className={styles.link} />
      </li>
    )

  return (
    <Tippy {...DropdownTippyProps} render={renderList}>
      <button className={styles.trigger}>
        <Icon name="more_horiz" size={18} />
      </button>
    </Tippy>
  )
}

export default DashboardActions
