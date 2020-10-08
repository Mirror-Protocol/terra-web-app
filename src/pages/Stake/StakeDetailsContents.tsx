import React from "react"
import { useRouteMatch } from "react-router-dom"
import { LP, MIR, UUSD } from "../../constants"
import { gt, times } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { formatAsset } from "../../libs/parse"
import { useContract } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import Dl from "../../components/Dl"
import WithResult from "../../components/WithResult"
import LinkButton from "../../components/LinkButton"
import { MenuKey } from "../Stake"
import styles from "./StakeDetailsContents.module.scss"

interface Props {
  symbol: string
  gov?: boolean
}

const StakeDetailsContents = ({ symbol, gov }: Props) => {
  const stakedKey = !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED
  const stakableKey = !gov ? BalanceKey.LPSTAKABLE : BalanceKey.TOKEN
  const unit = !gov ? LP : MIR

  const { url } = useRouteMatch()
  const { find } = useContract()
  const reward = find(BalanceKey.REWARD, symbol)

  const claim = {
    to: url + "/claim",
    disabled: !gt(reward, 0),
    className: styles.button,
  }

  const contents = [
    {
      title: "Stakable",
      content: (
        <WithResult keys={[stakableKey]} size={14}>
          {formatAsset(find(stakableKey, symbol), unit)}
        </WithResult>
      ),
    },
    {
      title: "Staked",
      content: (
        <WithResult keys={[stakedKey]} size={14}>
          {formatAsset(find(stakedKey, symbol), unit)}
        </WithResult>
      ),
    },
    ...insertIf(!gov, {
      title: "Reward",
      content: (
        <WithResult
          keys={[BalanceKey.REWARD, BalanceKey.LPSTAKED, PriceKey.PAIR]}
          size={14}
        >
          {formatAsset(reward, MIR)}

          {gt(reward, 0) && (
            <> ≈ {formatAsset(times(find(PriceKey.PAIR, MIR), reward), UUSD)}</>
          )}

          <LinkButton {...claim} size="sm" color="aqua" outline>
            {MenuKey.CLAIMSYMBOL}
          </LinkButton>
        </WithResult>
      ),
    }),
  ]

  return <Dl list={contents} className={styles.dl} />
}

export default StakeDetailsContents
