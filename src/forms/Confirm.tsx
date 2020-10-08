import React from "react"
import MESSAGE from "../lang/MESSAGE.json"
import Card from "../components/Card"
import Icon from "../components/Icon"
import Button from "../components/Button"
import PreLine from "../components/PreLine"
import ConfirmDetails from "./ConfirmDetails"
import styles from "./Confirm.module.scss"

interface Props extends Confirm {
  button: Button
  goBack: () => void
}

const Confirm = ({ contents, warning, button, goBack }: Props) => (
  <Card title={MESSAGE.Confirm.Title.Confirm} goBack={goBack} lg>
    <ConfirmDetails contents={contents} />

    {warning && (
      <section className={styles.warning}>
        <Icon name="error_outline" size={16} />
        <PreLine>{warning}</PreLine>
      </section>
    )}

    <footer>
      <Button type="submit" {...button} size="lg" submit>
        Confirm & Sign
      </Button>
    </footer>
  </Card>
)

export default Confirm
