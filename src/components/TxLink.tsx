import { truncate } from "../libs/text"
import ExtLink from "./ExtLink"
import styles from "./TxLink.module.scss"

const TxLink = ({ hash, link }: { hash: string; link: string }) => (
  <ExtLink href={link} className={styles.link}>
    {truncate(hash, [10, 10])}
  </ExtLink>
)

export default TxLink
