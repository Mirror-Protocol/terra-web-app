import { formatAsset } from "../libs/parse"
import TxHash from "./TxHash"
import styles from "./TxInfo.module.scss"

interface Props {
  txInfo: TxInfo
  parser: ResultParser
}

const TxInfo = ({ txInfo, parser }: Props) => {
  const { TxHash: hash, Tx } = txInfo
  const logs = txInfo?.Logs
  const [fee] = Tx.Fee.Amount

  const receipt = parser(logs, txInfo)
  const footer = [
    {
      title: "Tx Fee",
      content: `+ ${formatAsset(fee.Amount, fee.Denom)}`,
    },
    {
      title: "Tx Hash",
      content: <TxHash>{hash}</TxHash>,
    },
  ]

  return (
    <>
      {receipt.map(
        ({ title, content, children }) =>
          content && (
            <article className={styles.wrapper} key={title}>
              <header className={styles.row}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.content}>{content}</p>
              </header>

              {children && (
                <section className={styles.children}>
                  {children.map(
                    ({ title, content }) =>
                      content && (
                        <article className={styles.row} key={title}>
                          <h1 className={styles.title}>{title}</h1>
                          <p className={styles.content}>{content}</p>
                        </article>
                      )
                  )}
                </section>
              )}
            </article>
          )
      )}

      <footer className={styles.footer}>
        {footer.map(({ title, content }) => (
          <article className={styles.row} key={title}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.content}>{content}</p>
          </article>
        ))}
      </footer>
    </>
  )
}

export default TxInfo
