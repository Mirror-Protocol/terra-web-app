import classNames from "classnames"
import { DOCS } from "../constants"
import ExtLink from "../components/ExtLink"
import Icon from "../components/Icon"
import styles from "./DocsLink.module.scss"

const DocsLink = () => {
  return (
    <ExtLink href={DOCS} className={classNames(styles.link, "desktop")}>
      <Icon name="Docs" size={22} />
      Mirror Docs
    </ExtLink>
  )
}

export default DocsLink
