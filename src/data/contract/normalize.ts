import { atom, selector } from "recoil"
import { div, gt, sum } from "../../libs/math"
import { PriceKey, BalanceKey, StakingKey } from "../../hooks/contractKeys"
import { useStore, useStoreLoadable } from "../utils/loadable"
import { pricesQuery } from "../stats/assets"
import { exchangeRatesQuery } from "../native/exchange"
import { bankBalanceQuery } from "../native/balance"
import { useExternalBalances } from "../external/external"
import { useExternalPrices } from "../external/external"
import { protocolQuery, useProtocol } from "./protocol"
import { collateralOracleAssetInfoQuery } from "./collateral"
import { tokenBalanceQuery, lpTokenBalanceQuery } from "./contract"
import { mintAssetConfigQuery, stakingRewardInfoQuery } from "./contract"
import { govStakerQuery } from "./contract"

/* price */
export const nativePricesQuery = selector({
  key: "nativePrices",
  get: ({ get }) =>
    reduceNativePrice(get(exchangeRatesQuery).OracleDenomsExchangeRates.Result),
})

const nativePricesState = atom<Dictionary>({
  key: "nativePricesState",
  default: {},
})

export const pairPricesQuery = selector({
  key: "pairPrices",
  get: ({ get }) => dict(get(pricesQuery), ({ price }) => price),
})

const pairPricesState = atom<Dictionary>({
  key: "pairPricesState",
  default: {},
})

export const oraclePricesQuery = selector({
  key: "oraclePrices",
  get: ({ get }) => dict(get(pricesQuery), ({ oraclePrice }) => oraclePrice),
})

const oraclePricesState = atom<Dictionary>({
  key: "oraclePricesState",
  default: {},
})

export const prePricesQuery = selector({
  key: "prePrices",
  get: ({ get }) =>
    dict(
      get(mintAssetConfigQuery),
      ({ ipo_params }) => ipo_params?.pre_ipo_price ?? "0"
    ),
})

const prePricesState = atom<Dictionary>({
  key: "prePricesState",
  default: {},
})

export const endPricesQuery = selector({
  key: "endPrices",
  get: ({ get }) =>
    dict(get(mintAssetConfigQuery), ({ end_price }) => end_price),
})

const endPricesState = atom<Dictionary>({
  key: "endPricesState",
  default: {},
})

/* balance */
export const nativeBalancesQuery = selector({
  key: "nativeBalances",
  get: ({ get }) =>
    reduceByDenom(get(bankBalanceQuery)?.BankBalancesAddress?.Result ?? []),
})

const nativeBalancesState = atom<Dictionary>({
  key: "nativeBalancesState",
  default: {},
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

const lpStakableBalancesState = atom<Dictionary>({
  key: "lpStakableBalancesState",
  default: {},
})

export const lpStakedBalancesQuery = selector({
  key: "lpStakedBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "bond_amount") : {}
  },
})

const lpStakedBalancesState = atom<Dictionary>({
  key: "lpStakedBalancesState",
  default: {},
})

export const slpStakedBalancesQuery = selector({
  key: "slpStakedBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "bond_amount", true) : {}
  },
})

const slpStakedBalancesState = atom<Dictionary>({
  key: "slpStakedBalancesState",
  default: {},
})

export const lpRewardBalancesQuery = selector({
  key: "lpRewardBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "pending_reward") : {}
  },
})

const lpRewardBalancesState = atom<Dictionary>({
  key: "lpRewardBalancesState",
  default: {},
})

export const slpRewardBalancesQuery = selector({
  key: "slpRewardBalances",
  get: ({ get }) => {
    const result = get(stakingRewardInfoQuery)
    return result ? reduceStakingReward(result, "pending_reward", true) : {}
  },
})

const slpRewardBalancesState = atom<Dictionary>({
  key: "slpRewardBalancesState",
  default: {},
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

export const minCollateralRatioState = atom<Dictionary>({
  key: "minCollateralRatioState",
  default: {},
})

export const multipliersQuery = selector<Dictionary>({
  key: "multiplierRatio",
  get: ({ get }) => ({
    uusd: "1",
    ...dict(
      get(collateralOracleAssetInfoQuery),
      ({ multiplier }) => multiplier
    ),
  }),
})

export const multipliersState = atom<Dictionary>({
  key: "multiplierState",
  default: {},
})

/* MIR Price */
const MIRPriceQuery = selector({
  key: "MIRPrice",
  get: ({ get }) => {
    const { getToken } = get(protocolQuery)
    const pairPrices = get(pairPricesQuery)
    return pairPrices[getToken("MIR")]
  },
})

export const MIRPriceState = atom({
  key: "MIRPriceState",
  default: "0",
})

/* store: price */
export const usePairPrices = () => {
  return useStoreLoadable(pairPricesQuery, pairPricesState)
}

export const useOraclePrices = () => {
  return useStoreLoadable(oraclePricesQuery, oraclePricesState)
}

export const useNativePrices = () => {
  return useStoreLoadable(nativePricesQuery, nativePricesState)
}

export const usePrePrices = () => {
  return useStoreLoadable(prePricesQuery, prePricesState)
}

export const useEndPrices = () => {
  return useStoreLoadable(endPricesQuery, endPricesState)
}

/* store: balance */
export const useNativeBalances = () => {
  return useStore(nativeBalancesQuery, nativeBalancesState)
}

export const useTokenBalances = () => {
  return useStore(tokenBalancesQuery, tokenBalancesState)
}

/* store: staking balance */
export const useLpStakableBalances = () => {
  return useStore(lpStakableBalancesQuery, lpStakableBalancesState)
}

export const useLpStakedBalances = () => {
  return useStore(lpStakedBalancesQuery, lpStakedBalancesState)
}

export const useSlpStakedBalances = () => {
  return useStore(slpStakedBalancesQuery, slpStakedBalancesState)
}

export const useLpRewardBalances = () => {
  return useStore(lpRewardBalancesQuery, lpRewardBalancesState)
}

export const useSlpRewardBalances = () => {
  return useStore(slpRewardBalancesQuery, slpRewardBalancesState)
}

export const useGovStaked = () => {
  return useStoreLoadable(govStakedQuery, govStakedState)
}

export const useRewards = () => {
  return useStoreLoadable(rewardsQuery, rewardsState)
}

/* store: asset info */
export const useMinCollateralRatio = () => {
  return useStoreLoadable(minCollateralRatioQuery, minCollateralRatioState)
}

export const useMultipliers = () => {
  return useStoreLoadable(multipliersQuery, multipliersState)
}

/* store: MIR Price */
export const useMIRPrice = () => {
  return useStoreLoadable(MIRPriceQuery, MIRPriceState)
}

/* hooks:find */
export const useFindPrice = () => {
  const { getPriceKey } = useProtocol()

  const pairPrices = usePairPrices()
  const oraclePrices = useOraclePrices()
  const nativePrices = useNativePrices()
  const prePrices = usePrePrices()
  const endPrices = useEndPrices()
  const externalPrices = useExternalPrices()

  const dictionary = {
    [PriceKey.PAIR]: pairPrices,
    [PriceKey.ORACLE]: oraclePrices,
    [PriceKey.NATIVE]: nativePrices,
    [PriceKey.PRE]: prePrices,
    [PriceKey.END]: endPrices,
    [PriceKey.EXTERNAL]: externalPrices,
  }

  return (key: PriceKey, token: string) =>
    dictionary[getPriceKey(key, token)][token]
}

export const useFindBalance = () => {
  const { getBalanceKey } = useProtocol()

  const nativeBalances = useNativeBalances()
  const tokenBalances = useTokenBalances()
  const externalBalances = useExternalBalances()

  const dictionary = {
    [BalanceKey.NATIVE]: nativeBalances.contents,
    [BalanceKey.TOKEN]: tokenBalances.contents,
    [BalanceKey.EXTERNAL]: externalBalances.contents,
  }

  return {
    contents: (token: string) => dictionary[getBalanceKey(token)][token],
    isLoading: [nativeBalances, tokenBalances, externalBalances].some(
      ({ isLoading }) => isLoading
    ),
  }
}

export const useFindStaking = () => {
  const lpStakableBalances = useLpStakableBalances()
  const lpStakedBalances = useLpStakedBalances()
  const slpStakedBalances = useSlpStakedBalances()
  const lpRewardBalances = useLpRewardBalances()
  const slpRewardBalances = useSlpRewardBalances()

  const dictionary = {
    [StakingKey.LPSTAKABLE]: lpStakableBalances.contents,
    [StakingKey.LPSTAKED]: lpStakedBalances.contents,
    [StakingKey.SLPSTAKED]: slpStakedBalances.contents,
    [StakingKey.LPREWARD]: lpRewardBalances.contents,
    [StakingKey.SLPREWARD]: slpRewardBalances.contents,
  }

  return {
    contents: (key: StakingKey, token: string) => dictionary[key][token],
    isLoading: [
      lpStakableBalances,
      lpStakedBalances,
      slpStakedBalances,
      lpRewardBalances,
      slpRewardBalances,
    ].some(({ isLoading }) => isLoading),
  }
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
