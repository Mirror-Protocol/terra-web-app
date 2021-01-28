import BigNumber from "bignumber.js"
import { gt } from "../libs/math"

interface Value {
  amount?: string
  price: string
}

export default {
  minimumReceived: (params: {
    offer_amount: string
    belief_price: string
    max_spread: string
    commission: string
  }) => {
    const { offer_amount, belief_price, max_spread, commission } = params
    const expectedAmount = new BigNumber(offer_amount).div(belief_price)
    const rate1 = new BigNumber(1).minus(max_spread)
    const rate2 = new BigNumber(1).minus(commission)
    return expectedAmount.times(rate1).times(rate2).toString()
  },

  /** Mint */
  mint: (params: { collateral: Value; asset: Value; ratio?: string }) => {
    const { collateral, asset, ratio } = params

    if (collateral.price && asset.price) {
      const exchange = new BigNumber(collateral.price).div(asset.price)

      if (collateral.amount) {
        const exchanged = new BigNumber(collateral.amount).times(exchange)

        if (ratio) {
          const $asset = { amount: exchanged.div(ratio).toString() }
          return { ...params, asset: { ...asset, ...$asset } }
        } else if (asset.amount) {
          const $ratio = exchanged.div(asset.amount).toString()
          return { ...params, ratio: $ratio }
        }
      } else if (asset.amount && ratio) {
        const exchanged = new BigNumber(asset.amount).div(exchange)
        const $collateral = { amount: exchanged.times(ratio).toString() }
        return { ...params, collateral: { ...collateral, ...$collateral } }
      }
    }

    return params
  },

  /** Reward */
  reward: (globalIndex?: string, info?: RewardInfo) => {
    if (globalIndex && info) {
      const { index, bond_amount, pending_reward } = info

      const reward = new BigNumber(globalIndex)
        .minus(index)
        .times(bond_amount)
        .plus(pending_reward)

      return reward.toString()
    }

    return "0"
  },

  /**
   * to LP
   * @param deposits[].amount - Amount to provide
   * @param deposits[].pair - pair, {pool:{}}
   * @param totalShare - pair, {pool:{}}
   */
  toLP: (deposits: { amount: string; pair: string }[], totalShare: string) =>
    gt(totalShare, 0)
      ? BigNumber.minimum(
          ...deposits.map(({ amount, pair }) =>
            new BigNumber(amount).times(totalShare).div(pair)
          )
        ).toString()
      : new BigNumber(deposits[0].amount)
          .times(deposits[1].amount)
          .sqrt()
          .toString(),

  /**
   * from LP
   * @param lp - Amount to withdraw
   * @param shares - pair, {pool:{}}
   * @param totalShare - pair, {pool:{}}
   */
  fromLP: (
    lp: string,
    shares: { asset: Asset; uusd: Asset },
    totalShare: string
  ): { asset: Asset; uusd: Asset } =>
    Object.entries(shares).reduce(
      (acc, [key, { amount, token }]) => ({
        ...acc,
        [key]: {
          amount: new BigNumber(lp).times(amount).div(totalShare).toString(),
          token,
        },
      }),
      {} as { asset: Asset; uusd: Asset }
    ),
}
