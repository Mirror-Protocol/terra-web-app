import styles from "./PriceChartDescription.module.scss"

const PriceChartDescription = ({ children = "" }) => {
  return !children ? null : <p className={styles.component}>{children}</p>
}

export default PriceChartDescription
