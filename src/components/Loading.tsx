import { CircularProgress } from "@material-ui/core"
import styles from "./Loading.module.scss"

interface Props {
  size?: number
  className?: string
}

const Loading = ({ size, className }: Props) => (
  <div className={styles.center}>
    <CircularProgress color="inherit" size={size ?? 24} className={className} />
  </div>
)

export default Loading
