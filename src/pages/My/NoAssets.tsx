import Card from "../../components/Card"
import LinkButton from "../../components/LinkButton"
import { getPath, MenuKey } from "../../routes"
import styles from "./NoAssets.module.scss"

interface Props {
  description: string
  link: MenuKey
}

const NoAssets = ({ description, link }: Props) => (
  <Card className={styles.component}>
    <p className={styles.description}>{description}</p>
    <LinkButton to={getPath(link)} className={styles.button} outline>
      {link}
    </LinkButton>
  </Card>
)

export default NoAssets
