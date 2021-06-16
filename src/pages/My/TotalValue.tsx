import { Link } from "react-router-dom"
import classNames from "classnames"

import { gt, times } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { BalanceKey } from "../../hooks/contractKeys"
import { useMyTotal } from "../../data/my/total"
import { useFind, useMIRPrice, useRewards } from "../../data/contract/normalize"

import { getPath, MenuKey } from "../../routes"
import Card, { CardMain } from "../../components/Card"
import Grid from "../../components/Grid"
import Formatted from "../../components/Formatted"
import LinkButton from "../../components/LinkButton"
import DoughnutChart from "../../containers/DoughnutChart"
import BuyLinks from "../../components/BuyLinks"
import Icon from "../../components/Icon"
import { Submit } from "../../components/Button"
import styles from "./TotalValue.module.scss"

const TotalValue = () => {
  const shouldBuyUST = useShouldBuyUST()

  /* Total value */
  const { list, total } = useMyTotal()
  const { uusd, holding, limitOrder, borrowing, farming, gov } = list

  /* Claim */
  const MIRPrice = useMIRPrice()
  const rewards = useRewards()

  const claimAll = (
    <CardMain>
      <Submit>
        <LinkButton
          to={getPath(MenuKey.CLAIMREWARDS)}
          disabled={!gt(rewards.total, 0)}
          size="md"
          block
        >
          <Icon name="Claim" />
          Claim All Rewards
        </LinkButton>
      </Submit>
    </CardMain>
  )

  return (
    <Grid>
      <Card
        title="Total Value"
        footer={
          shouldBuyUST && (
            <CardMain>
              <BuyLinks type="terra" />
            </CardMain>
          )
        }
        action={
          <Link to={getPath(MenuKey.SEND)} className={styles.send}>
            <Icon name="Send" />
            Send
          </Link>
        }
      >
        <Formatted symbol="uusd" big>
          {total}
        </Formatted>

        {!shouldBuyUST && (
          <DoughnutChart
            list={[
              { label: "UST", value: uusd },
              { label: "Limit Order", value: limitOrder },
              { label: "Holding", value: holding },
              { label: "Borrowing", value: borrowing },
              { label: "Farming", value: farming },
              { label: "Govern", value: gov },
            ]}
            format={(value) => formatAsset(value, "uusd")}
          />
        )}
      </Card>

      <Card title="Total Claimable Rewards" footer={claimAll}>
        <p>
          <Formatted symbol="MIR" big>
            {rewards.total}
          </Formatted>
        </p>

        <p className={classNames(styles.muted, "muted")}>
          <Formatted symbol="uusd">{times(rewards.total, MIRPrice)}</Formatted>
        </p>
      </Card>
    </Grid>
  )
}

export default TotalValue

/* hooks */
const useShouldBuyUST = () => {
  const find = useFind()
  const uusd = find(BalanceKey.NATIVE, "uusd")
  return !gt(uusd, 0)
}
