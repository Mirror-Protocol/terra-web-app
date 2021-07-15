import { atom, selector } from "recoil"
import { useStore, useStoreLoadable } from "../utils/loadable"
import { getListedContractQueriesQuery } from "../utils/queries"
import { getContractQueryQuery } from "../utils/query"
import { priceKeyIndexState } from "../app"
import { addressState } from "../wallet"
import { protocolQuery } from "./protocol"

export const pairPoolQuery = selector({
  key: "pairPool",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const getListedContractQueries = get(getListedContractQueriesQuery)
    return await getListedContractQueries<PairPool>(
      ({ token, pair }) => ({ token, contract: pair, msg: { pool: {} } }),
      "pairPool"
    )
  },
})

const pairPoolState = atom<Dictionary<PairPool> | undefined>({
  key: "pairPoolState",
  default: undefined,
})

export const oraclePriceQuery = selector({
  key: "oraclePrice",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getListedContractQueries = get(getListedContractQueriesQuery)
    return await getListedContractQueries<Rate>(
      ({ token, symbol }) =>
        symbol === "MIR"
          ? undefined
          : {
              contract: contracts["oracle"],
              msg: { price: { base_asset: token, quote_asset: "uusd" } },
            },
      "oraclePrice"
    )
  },
})

export const mintAssetConfigQuery = selector({
  key: "mintAssetConfig",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getListedContractQueries = get(getListedContractQueriesQuery)
    return await getListedContractQueries<MintAssetConfig>(
      ({ token, symbol }) =>
        symbol === "MIR"
          ? undefined
          : {
              contract: contracts["mint"],
              msg: { asset_config: { asset_token: token } },
            },
      "mintAssetConfig"
    )
  },
})

export const tokenBalanceQuery = selector({
  key: "tokenBalance",
  get: async ({ get }) => {
    const address = get(addressState)

    if (address) {
      const getListedContractQueries = get(getListedContractQueriesQuery)
      return await getListedContractQueries<Balance>(
        ({ token }) => ({ contract: token, msg: { balance: { address } } }),
        "tokenBalance"
      )
    }
  },
})

export const lpTokenBalanceQuery = selector({
  key: "lpTokenBalance",
  get: async ({ get }) => {
    const address = get(addressState)

    if (address) {
      const getListedContractQueries = get(getListedContractQueriesQuery)
      return await getListedContractQueries<Balance>(
        ({ lpToken }) => ({ contract: lpToken, msg: { balance: { address } } }),
        "lpTokenBalance"
      )
    }
  },
})

export const stakingRewardInfoQuery = selector({
  key: "stakingRewardInfo",
  get: async ({ get }) => {
    const address = get(addressState)

    if (address) {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<StakingRewardInfo>(
        {
          contract: contracts["staking"],
          msg: { reward_info: { staker_addr: address } },
        },
        "stakingRewardInfo"
      )
    }
  },
})

export const stakingRewardInfoState = atom<StakingRewardInfo | undefined>({
  key: "stakingRewardInfoState",
  default: undefined,
})

export const govStakerQuery = selector({
  key: "govStaker",
  get: async ({ get }) => {
    const address = get(addressState)

    if (address) {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<GovStaker>(
        { contract: contracts["gov"], msg: { staker: { address } } },
        "govStaker"
      )
    }
  },
})

const govStakerState = atom<GovStaker | undefined>({
  key: "govStakerState",
  default: undefined,
})

/* hooks */
export const usePairPool = () => {
  return useStoreLoadable(pairPoolQuery, pairPoolState)
}

export const useStakingRewardInfo = () => {
  return useStoreLoadable(stakingRewardInfoQuery, stakingRewardInfoState)
}

export const useGovStaker = () => {
  return useStore(govStakerQuery, govStakerState)
}
