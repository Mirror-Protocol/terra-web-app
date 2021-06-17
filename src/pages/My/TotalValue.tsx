import { Link } from "react-router-dom"
import classNames from "classnames"

import Tooltips from "../../lang/Tooltips"
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
import { TooltipIcon } from "../../components/Tooltip"
import styles from "./TotalValue.module.scss"

const TotalValue = () => {
  const shouldBuyUST = useShouldBuyUST()

  /* Total value */
  const { list, total } = useMyTotal()
  const { uusd, holding, limitOrder, borrowing, pool, farming, gov } = list

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
        title={
          <TooltipIcon content={Tooltips.My.TotalValue}>
            Total Value
          </TooltipIcon>
        }
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
              {
                label: "UST",
                value: uusd,
                tooltip: Tooltips.My.Total.UST,
              },
              {
                label: "Limit Order",
                value: limitOrder,
                tooltip: Tooltips.My.Total.LimitOrder,
              },
              {
                label: "Holding",
                value: holding,
                tooltip: Tooltips.My.Total.Holding,
              },
              {
                label: "Borrowing",
                value: borrowing,
                tooltip: Tooltips.My.Total.Borrowing,
              },
              {
                label: "Pool",
                value: pool,
                tooltip: Tooltips.My.Total.Pool,
              },
              {
                label: "Farming",
                value: farming,
                tooltip: Tooltips.My.Total.Farming,
              },
              {
                label: "Govern",
                value: gov,
                tooltip: Tooltips.My.Total.Gov,
              },
            ]}
            format={(value) => formatAsset(value, "uusd")}
          />
        )}
      </Card>

      <Card
        title={
          <TooltipIcon content={Tooltips.My.TotalRewards}>
            Total Claimable Rewards
          </TooltipIcon>
        }
        footer={claimAll}
      >
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
