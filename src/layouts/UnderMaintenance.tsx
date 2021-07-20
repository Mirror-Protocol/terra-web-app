import Icon from "../components/Icon"
import Button from "../components/Button"
import ExtLinkButton from "../components/ExtLinkButton"
import styles from "./UnderMaintenance.module.scss"

const TWITTER = "https://twitter.com/mirror_protocol/status/1408074072232062989"

enum Status {
  UNAVAILABLE,
  AVAILABLE,
}

const current: Status = Status.AVAILABLE

const UnderMaintenance = ({ onHide }: { onHide: () => void }) => {
  const content = {
    [Status.UNAVAILABLE]: "Mirror Web App is being upgraded to v2.",
    [Status.AVAILABLE]:
      "Mirror Web App is being tested now. Use at your own risk.",
  }[current]

  const button = {
    [Status.UNAVAILABLE]: (
      <ExtLinkButton href={TWITTER} className={styles.button} size="sm">
        Learn more
      </ExtLinkButton>
    ),
    [Status.AVAILABLE]: (
      <Button className={styles.button} onClick={onHide} size="sm">
        Enter anyway
      </Button>
    ),
  }[current]

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <section className={styles.image}>
          <Cog />
          <Icon name="Mirror" className={styles.mirror} size={30} />
        </section>

        <h1 className={styles.title}>Under Maintenance</h1>
        <p className={styles.content}>{content}</p>

        {button}
      </article>
    </div>
  )
}

export default UnderMaintenance

/* icon */
const Cog = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={80}
    height={80}
    className={styles.cogs}
  >
    <path
      fill="#373738"
      d="M39.655.002h.757c2.266.024 4.513.245 6.718.648a1.22 1.22 0 011.13.783l.038.12 2.04 8.754 3.954 1.66 7.35-4.523c.2-.171.45-.273.712-.29.377-.034.748.108 1.005.386a39.755 39.755 0 019.518 9.685c.25.252.379.6.352.953a1.211 1.211 0 01-.187.58l-.091.126-4.632 7.35 1.608 3.977 8.413 2.063c.5.045.915.392 1.059.875l.035.148a39.762 39.762 0 01-.083 13.842c.001.524-.332.99-.828 1.159l-.116.035-8.701 1.933-1.688 3.94 4.508 7.492c.185.219.286.496.287.783.01.304-.097.6-.293.829l-.092.097a39.754 39.754 0 01-9.585 9.424c-.36.4-.936.513-1.415.292l-.141-.075-7.514-4.735-3.976 1.606-2.058 8.413c-.025.3-.159.579-.378.785-.234.232-.552.36-.882.353a39.758 39.758 0 01-13.47-.091 1.218 1.218 0 01-1.026-.444 1.22 1.22 0 01-.297-.635l-.012-.142-1.954-8.455-3.952-1.662-7.358 4.49a1.217 1.217 0 01-.895.326 1.216 1.216 0 01-.886-.401 39.76 39.76 0 01-9.197-9.229L7 62.609a1.22 1.22 0 01-.009-1.39l.085-.11 4.632-7.335L10.1 49.8l-8.434-2.056a1.219 1.219 0 01-.784-.378 1.22 1.22 0 01-.349-.867 39.752 39.752 0 01.102-13.555c-.015-.4.167-.783.488-1.024.156-.124.34-.208.535-.244l.148-.02 8.45-1.886 1.689-3.942-4.471-7.427a1.22 1.22 0 01-.292-1.12c.05-.24.17-.457.345-.626a39.782 39.782 0 019.9-9.676 1.215 1.215 0 011.398-.001l.104.082 7.343 4.652 3.975-1.607 2.06-8.367c.01-.41.226-.79.574-1.006.206-.138.45-.21.696-.207a39.91 39.91 0 016.08-.523zm.726 16.001a23.99 23.99 0 00-9.374 1.746C18.722 22.716 12.79 36.703 17.755 48.99c4.967 12.288 18.95 18.222 31.238 13.254C61.278 57.277 67.21 43.29 62.245 31.003a23.993 23.993 0 00-21.864-15z"
    />
  </svg>
)
