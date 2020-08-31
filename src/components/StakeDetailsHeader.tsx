import getLpName from "../libs/getLpName"
import TokenPair from "./TokenPair"
import styles from "./StakeDetailsHeader.module.scss"

interface Props {
  center?: boolean
  children: string
}

const StakeDetailsHeader = ({ center, children: symbol }: Props) => (
  <div className={center ? styles.center : styles.wrapper}>
    <TokenPair symbol={symbol} bg="darkblue" />
    <h1 className={styles.title}>{getLpName(symbol)}</h1>
  </div>
)

export default StakeDetailsHeader
