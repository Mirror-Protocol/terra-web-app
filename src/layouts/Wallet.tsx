import React, { useState } from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { UUSD } from "../constants"
import { truncate } from "../libs/text"
import { getPath, MenuKey } from "../routes"
import { useNetwork, useWallet, useRefetch } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import Icon from "../components/Icon"
import Button from "../components/Button"
import ExtLink from "../components/ExtLink"
import Tooltip from "../components/Tooltip"
import LinkButton from "../components/LinkButton"
import styles from "./Wallet.module.scss"

const Wallet = ({ close }: { close: () => void }) => {
  /* context */
  const { address, disconnect } = useWallet()
  const { finder } = useNetwork()
  useRefetch([AccountInfoKey.UUSD])

  /* copy address */
  const { copy, copied, reset } = useCopyAddress(address)

  return (
    <div className={styles.wallet}>
      <header className={styles.header}>
        <span className={styles.address}>
          <Icon name="account_balance_wallet" />
          {truncate(address)}
        </span>

        <Button onClick={disconnect} size="xs" color="secondary" outline>
          {MESSAGE.Wallet.Disconnect}
        </Button>
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
              {MESSAGE.Wallet.CopyAddress}
            </>
          </Tooltip>
        </div>

        <ExtLink href={finder(address)} className={styles.button}>
          <Icon name="launch" />
          {MESSAGE.Wallet.TerraFinder}
        </ExtLink>
      </section>

      <LinkButton
        to={{ pathname: getPath(MenuKey.SEND), state: { symbol: UUSD } }}
        onClick={close}
        className={styles.send}
        color="aqua"
        size="sm"
        outline
        block
      >
        {MenuKey.SEND}
      </LinkButton>
    </div>
  )
}

export default Wallet

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
