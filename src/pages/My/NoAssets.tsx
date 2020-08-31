import LinkButton from "../../components/LinkButton"
import { getPath, MenuKey } from "../../routes"
import styles from "./NoAssets.module.scss"

interface Props {
  description: string
  link: MenuKey
}

const NoAssets = ({ description, link }: Props) => (
  <article className={styles.component}>
    <p className={styles.description}>{description}</p>
    <LinkButton to={getPath(link)} className={styles.button} outline>
      {link}
    </LinkButton>
  </article>
)

export default NoAssets
