import React from "react"
import useNewContractMsg from "../terra/useNewContractMsg"
import MESSAGE from "../lang/MESSAGE.json"
import { percent } from "../libs/num"
import { useContractsAddress } from "../hooks"
import { getPath, MenuKey } from "../routes"
import LinkButton from "../components/LinkButton"
import Icon from "../components/Icon"
import { toBase64 } from "./formHelpers"
import FormContainer from "./FormContainer"
import styles from "./MigrateForm.module.scss"

const PollForm = () => {
  const id = 1
  const poll = `${getPath(MenuKey.GOV)}/poll/${id}`
  const rate = "1"
  const prevToken = ""
  const nextToken = ""
  const amount = ""

  /* context */
  const { contracts } = useContractsAddress()

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contracts["staking"], {
      migrate_bonding: { asset_token: prevToken },
    }),
    newContractMsg(prevToken, {
      send: { amount, contract: nextToken, msg: toBase64({ migration: {} }) },
    }),
  ]

  const container = { contents: [], data, label: MESSAGE.Form.Migrate.Button }

  return (
    <FormContainer {...container}>
      <article className={styles.notice}>
        <p className={styles.desc}>{MESSAGE.Form.Migrate.Desc}</p>
        <LinkButton to={poll} size="sm" color="secondary" outline>
          VIEW POLL
        </LinkButton>

        <section className={styles.main}>
          <div className={styles.card}>
            <h1>1 mAsset</h1>
            <p>1 mAsset = 1 UST</p>
          </div>

          <div className={styles.conversion}>
            <p>
              Conversion Rate <strong>{percent(rate)}</strong>
            </p>
            <Icon name="arrow_downward" />
          </div>

          <div className={styles.card}>
            <h1>1 mAsset</h1>
            <p>1 mAsset = 1 UST</p>
          </div>
        </section>

        <p className={styles.footer}>{MESSAGE.Form.Migrate.Footer}</p>
      </article>
    </FormContainer>
  )
}

export default PollForm
