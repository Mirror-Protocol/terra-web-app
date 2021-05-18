import { format } from "date-fns"
import { useContractsAddress } from "../hooks"
import Card from "../components/Card"
import Button from "../components/Button"
import ExtLink from "../components/ExtLink"
import Modal, { useModal } from "../containers/Modal"
import styles from "./DelistModal.module.scss"

const DelistModal = ({ tokens }: { tokens: string[] }) => {
  const { delist, getSymbol } = useContractsAddress()
  const modal = useModal(true)

  return (
    <Modal {...modal}>
      <Card title="Stock Split / Merge Notification" center>
        <div className={styles.contents}>
          <header className={styles.header}>
            The following {tokens.length === 1 ? "asset" : "assets"} will be{" "}
            <strong>delisted</strong> due to a stock split / merge on the dates
            below:
          </header>

          <section className={styles.info}>
            {tokens.map((token) => (
              <p key={token}>
                {getSymbol(token)} (
                {format(new Date(delist[token].date), "LLL dd, yyyy")})
              </p>
            ))}
          </section>

          <ul className={styles.list}>
            <li>
              <p>
                <strong>Delisted assets can be</strong> sent, withdrawn from
                liquidity pools and used to close existing mint positions.
              </p>
            </li>
            <li>
              <p>
                <strong>Delisted assets cannot be</strong> traded, minted or
                provided to liquidity pools. LP staking rewards will immediately
                stop.
              </p>
            </li>
            <li>
              <p>
                You may burn your{" "}
                <strong>
                  {tokens.map((token) => getSymbol(token)).join(", ")}{" "}
                  (delisted)
                </strong>{" "}
                and claim UST at the last price before stock split / merge
                event.
              </p>
            </li>
          </ul>

          <section className={styles.info}>
            {tokens.map((token) => (
              <p key={token}>
                {getSymbol(token)} Stock split ratio = {delist[token].ratio}
              </p>
            ))}
          </section>

          <ul className={styles.list}>
            <li>
              <p>
                You may trade, mint, provide liquidity for and stake LP tokens
                for the new asset immediately after the stock split / merge.
              </p>
            </li>
          </ul>

          <p className={styles.italic}>
            Note that when UST to be returned after burning becomes
            insufficient, you may receive other mAssets. Please close mint
            positions with collateral other than UST before or immediately after
            stock split / merge to avoid any losses.
          </p>

          <ExtLink
            href="https://docs.mirror.finance/protocol/mirrored-assets-massets#delisting-and-migration"
            className={styles.link}
          >
            How does stock split/merge work on Mirror Protocol?
          </ExtLink>

          <Button onClick={modal.close} size="lg" block>
            I understand
          </Button>
        </div>
      </Card>
    </Modal>
  )
}

export default DelistModal
