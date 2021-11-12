import { ReactComponent as External } from "./External.svg"
import styles from "./Links.module.scss"

const LINKS = ["https://mirrorprotocol.app", "https://mirrorprotocol.is"]

const Links = () => {
  return (
    <ul>
      {LINKS.map((link) => (
        <li className={styles.item} key={link}>
          <a
            className={styles.link}
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {link}
            <External />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default Links
