import { format } from "../../libs/parse"
import { MenuKey } from "../../routes"
import Button from "../../components/Button"
import styles from "./AssetItem.module.scss"

const AssetItem = ({ symbol, token }: { symbol: string; token: string }) => (
  <article className={styles.component}>
    <h1>{symbol}</h1>
    <footer className={styles.component}>
      <p>{format(token, symbol)}</p>
      <Button className={styles.button} outline>
        {MenuKey.SEND}
      </Button>
    </footer>
  </article>
)

export default AssetItem
