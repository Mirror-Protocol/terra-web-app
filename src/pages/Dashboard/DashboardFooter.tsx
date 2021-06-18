import Card from "../../components/Card"
import { bound } from "../../components/Boundary"
import TopTrading from "./TopTrading"
import Assets from "./Assets"
import styles from "./DashboardFooter.module.scss"

const DashboardFooter = () => {
  return (
    <Card className={styles.card} full lg>
      <Assets />
      <section className={styles.table}>{bound(<TopTrading />)}</section>
    </Card>
  )
}

export default DashboardFooter
