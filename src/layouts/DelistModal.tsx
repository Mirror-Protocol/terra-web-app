import { useState } from "react"
import { format } from "date-fns"
import useLocalStorage from "../libs/useLocalStorage"
import { useContractsAddress } from "../hooks"
import Card from "../components/Card"
import Button from "../components/Button"
import ExtLink from "../components/ExtLink"
import Checkbox from "../components/Checkbox"
import Modal, { useModal } from "../containers/Modal"
import styles from "./DelistModal.module.scss"

interface Props {
  tokens: string[]
}

const DelistModal = (props: Props) => {
  const { delist, getSymbol } = useContractsAddress()
  const modal = useModal(true)
  const [checked, setChecked] = useState(false)
  const state = useLocalStorage<string[]>("doNotShowAgainDelist", [])
  const [doNotShowAgain, setDoNotShowAgain] = state
  const tokens = props.tokens.filter((token) => !doNotShowAgain.includes(token))

  const submit = () => {
    checked && setDoNotShowAgain([...doNotShowAgain, ...tokens])
    modal.close()
  }

  const plural = tokens.length > 1

  return !tokens.length ? null : (
    <Modal {...modal}>
      <Card title="Stock Split / Merge Notification" center>
        <div className={styles.contents}>
          <header>
            <p className={styles.p}>
              The following {plural ? "assets" : "asset"} will be affected by a
              stock split / merge on the {plural ? "dates" : "date"} below:
            </p>
          </header>

          <section className={styles.info}>
            {tokens.map((token) => (
              <p key={token}>
                {getSymbol(token)} (
                {format(new Date(delist[token].date), "LLL dd, yyyy")})
              </p>
            ))}
          </section>

          <p className={styles.p}>
            These assets will be <strong>DELISTED</strong> as soon as the market
            closes on the last trading day before the stock split / merge.
          </p>

          <ul className={styles.list}>
            <li>
              <p>LP staking rewards will immediately stop.</p>
            </li>
            <li>
              <p>
                Delisted assets can be burned to claim UST at the last price
                before stock split / merge.
              </p>
            </li>
            <li>
              <p>
                Delisted assets can be withdrawn from liquidity pools to be
                burnt or be used to close existing mint positions.
              </p>
            </li>
            <li>
              <p>
                Delisted assets cannot be traded, minted or provided to
                liquidity pools.
              </p>
            </li>
            <li>
              <p>
                If you want to close your mint position immediately, make sure
                that you acquire a sufficient amount of mAsset before delisting.
              </p>
            </li>
          </ul>

          <footer className={styles.footer}>
            <p className={styles.italic}>
              New assets will replace delisted ones on the{" "}
              {plural ? "dates" : "date"} mentioned above.
            </p>

            <p>
              <ExtLink
                href="https://docs.mirror.finance/protocol/mirrored-assets-massets#delisting-and-migration"
                className={styles.link}
              >
                How does stock split/merge work on Mirror Protocol?
              </ExtLink>
            </p>

            <button
              type="button"
              className={styles.label}
              onClick={() => setChecked(!checked)}
            >
              <Checkbox checked={checked}>Do not show again</Checkbox>
            </button>

            <Button className={styles.submit} onClick={submit} size="lg" block>
              I understand
            </Button>
          </footer>
        </div>
      </Card>
    </Modal>
  )
}

export default DelistModal
