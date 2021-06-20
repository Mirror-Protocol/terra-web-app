import { atom, noWait, selector, useRecoilValue } from "recoil"
import { div, gt, sum } from "../../libs/math"
import { getIsTokenNative } from "../../libs/parse"
import { PriceKey, BalanceKey, StakingKey } from "../../hooks/contractKeys"
import { AssetInfoKey } from "../../hooks/contractKeys"
import { getLoadableContents, useStoreLoadable } from "../utils/loadable"
import { exchangeRatesQuery } from "../native/exchange"
import { bankBalanceQuery } from "../native/balance"
import { externalBalancesQuery } from "../external/external"
import { externalPricesQuery } from "../external/external"
import { protocolQuery } from "./protocol"
import { collateralOracleAssetInfoQuery } from "./collateral"
import { pairPoolQuery, oraclePriceQuery } from "./contract"
import { tokenBalanceQuery, lpTokenBalanceQuery } from "./contract"
import { mintAssetConfigQuery, stakingRewardInfoQuery } from "./contract"
import { govStakerQuery } from "./contract"

/* price */
export const nativePricesQuery = selector({
  key: "nativePrices",
  get: ({ get }) =>
    reduceNativePrice(get(exchangeRatesQuery).OracleDenomsExchangeRates.Result),
})

export const pairPricesQuery = selector({
  key: "pairPrices",
  get: ({ get }) => dict(get(pairPoolQuery), calcPairPrice),
})

export const oraclePricesQuery = selector({
  key: "oraclePrices",
  get: ({ get }) => dict(get(oraclePriceQuery), ({ rate }) => rate),
})

export const prePricesQuery = selector({
  key: "prePrices",
  get: ({ get }) =>
    dict(
      get(mintAssetConfigQuery),
      ({ ipo_params }) => ipo_params?.pre_ipo_price ?? "0"
    ),
})

export const endPricesQuery = selector({
  key: "endPrices",
  get: ({ get }) =>
    dict(get(mintAssetConfigQuery), ({ end_price }) => end_price),
})

/* balance */
export const nativeBalancesQuery = selector({
  key: "nativeBalances",
  get: ({ get }) =>
    reduceByDenom(get(bankBalanceQuery)?.BankBalancesAddress?.Result ?? []),
})

export const tokenBalancesQuery = selector({
  key: "tokenBalances",
  get: ({ get }) => {
    const result = get(tokenBalanceQuery)
    return result ? dict(result, ({ balance }) => balance) : {}
  },
})

const tokenBalancesState = atom<Dictionary>({
  key: "tokenBalancesState",
  default: {},
})

export const lpStakableBalancesQuery = selector({
  key: "lpStakableBalances",
  get: ({ get }) => {
    const result = get(lpTokenBalanceQuery)
    return result ? dict(result, ({ balance }) => balance) : {}
  },
})

export const lpStakedBalancesQuery = selector({
  key: "lpStakedBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "bond_amount") : {}
  },
})

export const slpStakedBalancesQuery = selector({
  key: "slpStakedBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "bond_amount", true) : {}
  },
})

export const lpRewardBalancesQuery = selector({
  key: "lpRewardBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "pending_reward") : {}
  },
})

export const slpRewardBalancesQuery = selector({
  key: "slpRewardBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "pending_reward", true) : {}
  },
})

export const govStakedQuery = selector({
  key: "govStaked",
  get: ({ get }) => get(govStakerQuery)?.balance ?? "0",
})

const govStakedState = atom({
  key: "govStakedState",
  default: "0",
})

/* reward */
export const farmingRewardsQuery = selector({
  key: "farmingRewards",
  get: ({ get }) => ({
    long: sum(Object.values(get(lpRewardBalancesQuery) ?? {})),
    short: sum(Object.values(get(slpRewardBalancesQuery) ?? {})),
  }),
})

export const votingRewardsQuery = selector({
  key: "votingRewards",
  get: ({ get }) => get(govStakerQuery)?.pending_voting_rewards ?? "0",
})

export const rewardsQuery = selector({
  key: "rewards",
  get: ({ get }) => {
    const { long, short } = get(farmingRewardsQuery)
    const voting = get(votingRewardsQuery)
    const total = sum([long, short, voting])
    return { long, short, voting, total }
  },
})

const rewardsState = atom({
  key: "rewardsState",
  default: rewardsQuery,
})

/* protocol - asset info */
export const minCollateralRatioQuery = selector({
  key: "minCollateralRatio",
  get: ({ get }) =>
    dict(
      get(mintAssetConfigQuery),
      ({ min_collateral_ratio }) => min_collateral_ratio
    ),
})

export const multiplierQuery = selector<Dictionary>({
  key: "multiplierRatio",
  get: ({ get }) => ({
    uusd: "1",
    ...dict(
      get(collateralOracleAssetInfoQuery),
      ({ multiplier }) => multiplier
    ),
  }),
})

/* hooks */
export const findPriceQuery = selector({
  key: "findPrice",
  get: ({ get }) => {
    const { getIsDelisted, getIsPreIPO } = get(protocolQuery)

    const dictionary = {
      [PriceKey.PAIR]: getLoadableContents(get(noWait(pairPricesQuery))) ?? {},
      [PriceKey.ORACLE]:
        getLoadableContents(get(noWait(oraclePricesQuery))) ?? {},
      [PriceKey.NATIVE]:
        getLoadableContents(get(noWait(nativePricesQuery))) ?? {},
      [PriceKey.PRE]: getLoadableContents(get(noWait(prePricesQuery))) ?? {},
      [PriceKey.END]: getLoadableContents(get(noWait(endPricesQuery))) ?? {},
      [PriceKey.EXTERNAL]:
        getLoadableContents(get(noWait(externalPricesQuery))) ?? {},
    }

    return (key: PriceKey, token: string) => {
      const $key = getIsTokenNative(token)
        ? PriceKey.NATIVE
        : getIsDelisted(token)
        ? PriceKey.END
        : key === PriceKey.ORACLE
        ? getIsPreIPO(key)
          ? PriceKey.PRE
          : key
        : key

      return dictionary[$key][token]
    }
  },
})

export const findPairPriceQuery = selector({
  key: "findPairPrice",
  get: ({ get }) => {
    const prices = get(pairPricesQuery)
    return (token: string) => prices[token]
  },
})

const MIRPriceQuery = selector({
  key: "MIRPrice",
  get: ({ get }) => {
    const { getToken } = get(protocolQuery)
    const token = getToken("MIR")

    const findPrice = get(findPairPriceQuery)
    return findPrice(token)
  },
})

export const MIRPriceState = atom({
  key: "MIRPriceState",
  default: MIRPriceQuery,
})

export const findBalanceQuery = selector({
  key: "findBalance",
  get: ({ get }) => {
    const { getIsExternal } = get(protocolQuery)
    const dictionary = {
      [BalanceKey.NATIVE]:
        getLoadableContents(get(noWait(nativeBalancesQuery))) ?? {},
      [BalanceKey.TOKEN]:
        getLoadableContents(get(noWait(tokenBalancesQuery))) ?? {},
      [BalanceKey.EXTERNAL]:
        getLoadableContents(get(noWait(externalBalancesQuery))) ?? {},
    }

    return (token: string) => {
      const key = getIsExternal(token)
        ? BalanceKey.EXTERNAL
        : getIsTokenNative(token)
        ? BalanceKey.NATIVE
        : BalanceKey.TOKEN

      return dictionary[key][token]
    }
  },
})

export const findQuery = selector({
  key: "find",
  get: ({ get }) => {
    const findPrice = get(findPriceQuery)
    const findBalance = get(findBalanceQuery)

    return (key: PriceKey | BalanceKey, token: string) =>
      isPriceKey(key) ? findPrice(key, token) : findBalance(token)
  },
})

export const findStakingQuery = selector({
  key: "findStaking",
  get: ({ get }) => {
    const dictionary = {
      [StakingKey.LPSTAKABLE]:
        getLoadableContents(get(noWait(lpStakableBalancesQuery))) ?? {},
      [StakingKey.LPSTAKED]:
        getLoadableContents(get(noWait(lpStakedBalancesQuery))) ?? {},
      [StakingKey.SLPSTAKED]:
        getLoadableContents(get(noWait(slpStakedBalancesQuery))) ?? {},
      [StakingKey.LPREWARD]:
        getLoadableContents(get(noWait(lpRewardBalancesQuery))) ?? {},
      [StakingKey.SLPREWARD]:
        getLoadableContents(get(noWait(slpRewardBalancesQuery))) ?? {},
    }

    return (key: StakingKey, token: string) => dictionary[key][token]
  },
})

export const findAssetInfoQuery = selector({
  key: "findAssetInfo",
  get: ({ get }) => {
    const dictionary = {
      [AssetInfoKey.MINCOLLATERALRATIO]:
        getLoadableContents(get(noWait(minCollateralRatioQuery))) ?? {},
      [AssetInfoKey.MULTIPLIER]:
        getLoadableContents(get(noWait(multiplierQuery))) ?? {},
    }

    return (key: AssetInfoKey, token: string) => dictionary[key][token]
  },
})

/* hooks */
export const useTokenBalances = () => {
  return useStoreLoadable(tokenBalancesQuery, tokenBalancesState)
}

/* hooks:find */
export const useFindPairPrice = () => {
  return useRecoilValue(findPairPriceQuery)
}

export const useFindPrice = () => {
  return useRecoilValue(findPriceQuery)
}

export const useFindBalance = () => {
  return useRecoilValue(findBalanceQuery)
}

export const useFind = () => {
  return useRecoilValue(findQuery)
}

export const useFindStaking = () => {
  return useRecoilValue(findStakingQuery)
}

export const useFindAssetInfo = () => {
  return useRecoilValue(findAssetInfoQuery)
}

/* store */
export const useGovStaked = () => {
  return useStoreLoadable(govStakedQuery, govStakedState)
}

export const useRewards = () => {
  return useStoreLoadable(rewardsQuery, rewardsState)
}

export const useMIRPrice = () => {
  return useStoreLoadable(MIRPriceQuery, MIRPriceState)
}

/* utils */
export const dict = <Data, Item = string>(
  dictionary: Dictionary<Data> = {},
  selector: (data: Data, token?: string) => Item
) =>
  Object.entries(dictionary).reduce<Dictionary<Item>>(
    (acc, [token, data]) =>
      selector(data, token) ? { ...acc, [token]: selector(data, token) } : acc,
    {}
  )

/* helpers */
const isPriceKey = (key: string): key is PriceKey =>
  Object.values(PriceKey).some((k) => k === key)

export const parsePairPool = ({ assets, total_share }: PairPool) => ({
  uusd: assets.find(({ info }) => "native_token" in info)?.amount ?? "0",
  asset: assets.find(({ info }) => "token" in info)?.amount ?? "0",
  total: total_share ?? "0",
})

export const calcPairPrice = (param: PairPool) => {
  const { uusd, asset } = parsePairPool(param)
  return [uusd, asset].every((v) => v && gt(v, 0)) ? div(uusd, asset) : "0"
}

const reduceStakingReward = (
  { reward_infos }: StakingRewardInfo,
  key: "bond_amount" | "pending_reward",
  short = false
) =>
  reward_infos.reduce<Dictionary>(
    (acc, { asset_token, is_short, ...rest }) =>
      Object.assign(
        {},
        acc,
        is_short === short && { [asset_token]: rest[key] }
      ),
    {}
  )

const reduceNativePrice = (coins: MantleCoin[]): Dictionary => ({
  uusd: "1",
  uluna: coins.find(({ Denom }) => Denom === "uusd")?.Amount ?? "0",
})

const reduceByDenom = (coins: MantleCoin[]) =>
  coins.reduce<Dictionary>(
    (acc, { Amount, Denom }) => ({ ...acc, [Denom]: Amount }),
    {}
  )
