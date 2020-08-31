import { FC } from "react"
import classNames from "classnames"
import Loading from "./Loading"
import styles from "./LoadingTitle.module.scss"

interface Props {
  loading?: boolean
  size?: number
  className?: string
}

const LoadingTitle: FC<Props> = ({ loading, size, className, children }) => (
  <div className={classNames(styles.wrapper, className)}>
    {children}
    {loading && <Loading className={styles.loading} size={size} />}
  </div>
)

export default LoadingTitle
