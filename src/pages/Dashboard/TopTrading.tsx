import { Link } from "react-router-dom"
import { getPath, MenuKey } from "../../routes"
import Icon from "../../components/Icon"
import TopTradingTable from "./TopTradingTable"
import styles from "./TopTrading.module.scss"

const TopTrading = () => {
  return (
    <article>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <Icon name="Chart" size={22} />
          <h1 className={styles.title}>Top Trading</h1>
        </div>

        <Link to={getPath(MenuKey.TRADE)} className={styles.link}>
          View all
          <Icon name="ChevronRight" size={8} />
        </Link>
      </header>

      <TopTradingTable />
    </article>
  )
}

export default TopTrading
