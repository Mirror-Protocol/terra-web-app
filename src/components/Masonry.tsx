import { ReactNode } from "react"
import styles from "./Masonry.module.scss"

interface Item {
  flex: number | "none"
  component: ReactNode
}

const Masonry = ({ children }: { children: [Item[], Item[]] }) => {
  const [column1, column2] = children

  return (
    <div className={styles.masonry}>
      <div className={styles.column}>
        {column1.map(({ flex = 1, component }, index) => (
          <div className={styles.row} style={{ flex }} key={index}>
            {component}
          </div>
        ))}
      </div>

      <div className={styles.column}>
        {column2.map(({ flex = 1, component }, index) => (
          <div className={styles.row} style={{ flex }} key={index}>
            {component}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Masonry
