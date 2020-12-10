import WithAbsolute from "../components/WithAbsolute"
import Icon from "../components/Icon"
import BuyLinks from "../components/BuyLinks"
import styles from "./WhereToBuy.module.scss"

const WhereToBuy = () => (
  <WithAbsolute
    content={({ close }) => (
      <BuyLinks className={styles.card} onClick={close} />
    )}
  >
    {({ toggle }) => (
      <button className={styles.button} onClick={toggle}>
        Buy UST
        <Icon name="chevron_right" />
      </button>
    )}
  </WithAbsolute>
)

export default WhereToBuy
