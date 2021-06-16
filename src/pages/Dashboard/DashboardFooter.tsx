import Card, { CardMain } from "../../components/Card"
import { bound } from "../../components/Boundary"
import TopTrading from "./TopTrading"
import Summary from "./Summary"
import styles from "./DashboardFooter.module.scss"

const DashboardFooter = () => {
  return (
    <Card className={styles.card} full lg>
      {bound(<Summary />, <CardMain />)}
      <section className={styles.table}>{bound(<TopTrading />)}</section>
    </Card>
  )
}

export default DashboardFooter
