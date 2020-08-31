import { useState } from "react"
import { LinkProps } from "react-router-dom"
import Icon from "./Icon"
import Button from "./Button"
import Tooltip from "./Tooltip"
import ExtLink from "./ExtLink"
import LinkButton from "./LinkButton"
import styles from "./ConnectedInfo.module.scss"

interface Props {
  address: string
  truncated: string
  link: { href: string; children: string }
  footer?: LinkProps
  disconnect?: () => void
  close: () => void
}

const ConnectedInfo = (props: Props) => {
  const { address, truncated, link, footer, disconnect, close } = props
  const { copy, copied, reset } = useCopyAddress(address)

  return (
    <div className={styles.wallet}>
      <header className={styles.header}>
        <span className={styles.address}>
          <Icon name="account_balance_wallet" />
          {truncated}
        </span>

        {disconnect && (
          <Button onClick={disconnect} size="xs" color="secondary" outline>
            Disconnect
          </Button>
        )}
      </header>

      <section className={styles.actions}>
        <div id="parent">
          <Tooltip
            content="Copied!"
            visible={copied}
            onClick={copy}
            onClickOutside={reset}
            className={styles.button}
          >
            <>
              <Icon name="content_paste" />
              Copy Address
            </>
          </Tooltip>
        </div>

        <ExtLink href={link.href} className={styles.button}>
          <Icon name="launch" />
          View on {link.children}
        </ExtLink>
      </section>

      {footer && (
        <LinkButton
          to={footer.to}
          onClick={close}
          className={styles.send}
          color="aqua"
          size="sm"
          outline
          block
        >
          {footer.children}
        </LinkButton>
      )}
    </div>
  )
}

export default ConnectedInfo

/* hooks */
const useCopyAddress = (address: string) => {
  const [copied, setCopied] = useState(false)
  const reset = () => setCopied(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch (error) {
      console.error(error)
    }
  }

  return { copy, copied, reset }
}
