import { FC, ReactNode } from "react"
import classNames from "classnames/bind"
import Card from "./Card"
import Icon from "./Icon"
import Loading from "./Loading"
import Button from "./Button"
import LinkButton, { LinkProps } from "./LinkButton"
import styles from "./Wait.module.scss"

const cx = classNames.bind(styles)

export enum STATUS {
  SUCCESS = "success",
  LOADING = "loading",
  FAILURE = "failure",
}

interface Props {
  status: STATUS
  hash?: ReactNode
  link?: LinkProps
  button?: ButtonProps
}

const Wait: FC<Props> = ({ status, hash, link, button, children }) => {
  const title = {
    [STATUS.SUCCESS]: "Complete!",
    [STATUS.LOADING]: "Wait for receipt...",
    [STATUS.FAILURE]: "Failed",
  }[status]

  const iconName = {
    [STATUS.SUCCESS]: "check_circle_outline",
    [STATUS.LOADING]: null,
    [STATUS.FAILURE]: "highlight_off",
  }[status]

  const icon = iconName ? (
    <Icon name={iconName} className={cx(status)} size={50} />
  ) : (
    <Loading size={40} />
  )

  return (
    <Card icon={icon} title={title} lg>
      <section className={styles.contents}>
        {hash && <div className={styles.hash}>{hash}</div>}

        {status === STATUS.FAILURE ? (
          <p className={styles.feedback}>{children}</p>
        ) : (
          children
        )}
      </section>

      {(link || button) && (
        <footer>
          {link ? (
            <LinkButton {...link} size="lg" submit />
          ) : (
            <Button {...button} size="lg" submit />
          )}
        </footer>
      )}
    </Card>
  )
}

export default Wait
