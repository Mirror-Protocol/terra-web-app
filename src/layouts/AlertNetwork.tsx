import styles from "./AlertNetwork.module.scss"

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
    <path
      fill="#66ADFF"
      d="M19.43 16.9l-3.85-3.2L2.05 30l13.52 16.3 3.85-3.2L8.56 30l10.88-13.1zM17.5 32.5h5v-5h-5v5zm25-5h-5v5h5v-5zm-15 5h5v-5h-5v5zm16.93-18.8l-3.86 3.2L51.45 30 40.57 43.1l3.86 3.2L57.95 30 44.42 13.7z"
    />
  </svg>
)

const AlertNetwork = () => {
  return (
    <article className={styles.article}>
      <Icon />
      <p>
        Change Terra Station network setting to
        <br />
        "Testnet"
      </p>
    </article>
  )
}

export default AlertNetwork
