import { atom, selector } from "recoil"
import { useStoreLoadable } from "../utils/loadable"
import { getContractQueryQuery } from "../utils/query"
import { protocolQuery } from "./protocol"

export const mirrorTokenInfoQuery = selector({
  key: "mirrorTokenInfo",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    const response = await getContractQuery<{ total_supply: string }>(
      {
        contract: contracts["mirrorToken"],
        msg: { token_info: {} },
      },
      "mirrorTokenInfo"
    )

    return response
  },
})

export const mirrorTokenGovBalanceQuery = selector({
  key: "mirrorTokenGovBalance",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    const response = await getContractQuery<Balance>(
      {
        contract: contracts["mirrorToken"],
        msg: { balance: { address: contracts["gov"] } },
      },
      "mirrorTokenGovBalance"
    )

    return response?.balance ?? "0"
  },
})

const mirrorTokenGovBalanceState = atom({
  key: "mirrorTokenGovBalanceState",
  default: "0",
})

export const mirrorTokenCommunityBalanceQuery = selector({
  key: "mirrorTokenCommunityBalance",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    const response = await getContractQuery<Balance>(
      {
        contract: contracts["mirrorToken"],
        msg: { balance: { address: contracts["community"] } },
      },
      "mirrorTokenCommunityBalance"
    )

    return response?.balance ?? "0"
  },
})

const mirrorTokenCommunityBalanceState = atom({
  key: "mirrorTokenCommunityBalanceState",
  default: "0",
})

export const communityConfigQuery = selector({
  key: "communityConfig",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    const response = await getContractQuery<{ spend_limit: string }>(
      { contract: contracts["community"], msg: { config: {} } },
      "communityConfig"
    )

    return response
  },
})

export const factoryDistributionInfoQuery = selector({
  key: "factoryDistributionInfo",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    const response = await getContractQuery<{ weights: [string, number][] }>(
      {
        contract: contracts["factory"],
        msg: { distribution_info: {} },
      },
      "factoryDistributionInfo"
    )

    return (token: string) =>
      response?.weights.find(([addr]) => addr === token)?.[1]
  },
})

/* store */
export const useMirrorTokenGovBalance = () => {
  return useStoreLoadable(
    mirrorTokenGovBalanceQuery,
    mirrorTokenGovBalanceState
  )
}

export const useMirrorTokenCommunityBalance = () => {
  return useStoreLoadable(
    mirrorTokenCommunityBalanceQuery,
    mirrorTokenCommunityBalanceState
  )
}
