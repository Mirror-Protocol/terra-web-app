import { FC } from "react"
import styles from "./Banner.module.scss"

const Banner: FC = ({ children }) => {
  return <article className={styles.component}>{children}</article>
}

export default Banner
