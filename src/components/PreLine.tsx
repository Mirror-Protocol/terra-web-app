import { FC, HTMLAttributes } from "react"
import styles from "./PreLine.module.scss"

type Props = HTMLAttributes<HTMLParagraphElement>
const PreLine: FC<Props> = ({ children, ...attrs }) => (
  <p {...attrs} className={styles.component}>
    {children}
  </p>
)

export default PreLine
