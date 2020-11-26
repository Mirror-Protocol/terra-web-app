import getLpName from "./getLpName"
import StakeImage from "./StakeImage"
import styles from "./StakeFormHeader.module.scss"

const StakeFormHeader = ({ children: symbol }: { children: string }) => (
  <div className={styles.wrapper}>
    <StakeImage symbol={symbol} bg="darkblue" />
    <h1 className={styles.title}>{getLpName(symbol)}</h1>
  </div>
)

export default StakeFormHeader
