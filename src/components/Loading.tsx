import styles from "./Loading.module.scss"

interface Props {
  size?: number
  className?: string
  color?: string
}

const Loading = ({
  size = 22,
  className,
  color: stroke = "#ffffff",
}: Props) => (
  <div className={styles.center}>
    <svg
      className={`loading-spinner ${className || ""}`}
      width={size}
      height={size}
      viewBox={`0 0 66 66`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="loading-path"
        fill="none"
        strokeWidth={6}
        strokeLinecap="round"
        cx={33}
        cy={33}
        r={30}
        style={{ stroke }}
      ></circle>
    </svg>
  </div>
)

export default Loading
