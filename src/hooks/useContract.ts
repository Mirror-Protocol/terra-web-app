import { LazyQueryResult } from "@apollo/client"
import { Dictionary } from "ramda"
import { AccAddress } from "@terra-money/terra.js"

import { UUSD } from "../constants"
import { sum } from "../libs/math"

import usePairPool from "../graphql/queries/usePairPool"
import useOraclePrice from "../graphql/queries/useOraclePrice"

import useMintInfo from "../graphql/queries/useMintInfo"
import useLpTokenInfo from "../graphql/queries/useLpTokenInfo"

import useBankBalances from "../graphql/queries/useBankBalances"

import useTokenBalance from "../graphql/queries/useTokenBalance"
import useLpTokenBalance from "../graphql/queries/useLpTokenBalance"
import useStakingReward from "../graphql/queries/useStakingReward"
import useStakingPool from "../graphql/queries/useStakingPool"
import useGovStake from "../graphql/queries/useGovStake"

import useNormalize from "../graphql/useNormalize"

import createContext from "./createContext"
import { PriceKey, AssetInfoKey } from "./contractKeys"
import { BalanceKey, AccountInfoKey } from "./contractKeys"

export type DictionaryKey = PriceKey | BalanceKey | AssetInfoKey
export type DataKey = PriceKey | BalanceKey | AssetInfoKey | AccountInfoKey

export type QueryResult = LazyQueryResult<any, any> & {
  load: () => void
}

interface Data extends Record<DictionaryKey, Dictionary<string> | undefined> {
  [AccountInfoKey.UUSD]: string
}

interface Helpers {
  /** Find the value of the token in the data of the given key */
  find: (key: DictionaryKey, token: string) => string
  /** Sum */
  rewards: string
}

type Result = Record<DataKey, QueryResult>
type Parsed = Record<PriceKey | BalanceKey, any>

interface Contract extends Data, Helpers {
  result: Result
  parsed: Parsed
}

const contract = createContext<Contract>("useContract")
export const [useContract, ContractProvider] = contract

/* state */
export const useContractState = (address: string): Contract => {
  /* price */
  const pairPool = usePairPool()
  const oraclePrices = useOraclePrice()

  /* contract info */
  const mintInfo = useMintInfo()
  const lpTokenInfo = useLpTokenInfo()

  /* balance */
  const tokenBalance = useTokenBalance(address)
  const lpTokenBalance = useLpTokenBalance(address)
  const stakingReward = useStakingReward(address)
  const govStake = useGovStake(address)
  const stakingPool = useStakingPool()

  /* account info */
  const bankBalance = useBankBalances(address)

  /* result */
  const result: Result = {
    [PriceKey.PAIR]: pairPool.result,
    [PriceKey.ORACLE]: oraclePrices.result,

    [AssetInfoKey.LIQUIDITY]: pairPool.result,
    [AssetInfoKey.MINCOLLATERALRATIO]: mintInfo.result,
    [AssetInfoKey.LPTOTALSTAKED]: stakingPool.result,
    [AssetInfoKey.LPTOTALSUPPLY]: lpTokenInfo.result,

    [BalanceKey.TOKEN]: tokenBalance.result,
    [BalanceKey.LPTOTAL]: lpTokenBalance.result, // with LPSTAKED
    [BalanceKey.LPSTAKABLE]: lpTokenBalance.result,
    [BalanceKey.LPSTAKED]: stakingReward.result,
    [BalanceKey.MIRGOVSTAKED]: govStake.result,
    [BalanceKey.REWARD]: stakingPool.result, // with LPSTAKE

    [AccountInfoKey.UUSD]: bankBalance,
  }

  /* parsed */
  const parsed = {
    [PriceKey.PAIR]: pairPool.parsed,
    [PriceKey.ORACLE]: oraclePrices.parsed,

    [BalanceKey.TOKEN]: tokenBalance.parsed,
    [BalanceKey.LPTOTAL]: lpTokenBalance.parsed,
    [BalanceKey.LPSTAKABLE]: lpTokenBalance.parsed,
    [BalanceKey.LPSTAKED]: stakingReward.parsed,
    [BalanceKey.MIRGOVSTAKED]: govStake.parsed,
    [BalanceKey.REWARD]: stakingPool.parsed,
  }

  /* Dictionary<string> */
  const { price, contractInfo, balance, accountInfo } = useNormalize()
  const dictionary = {
    [PriceKey.PAIR]: pairPool.parsed && price[PriceKey.PAIR](pairPool.parsed),
    [PriceKey.ORACLE]:
      oraclePrices.parsed && price[PriceKey.ORACLE](oraclePrices.parsed),

    [AssetInfoKey.LIQUIDITY]:
      pairPool.parsed && contractInfo[AssetInfoKey.LIQUIDITY](pairPool.parsed),
    [AssetInfoKey.MINCOLLATERALRATIO]:
      mintInfo.parsed &&
      contractInfo[AssetInfoKey.MINCOLLATERALRATIO](mintInfo.parsed),
    [AssetInfoKey.LPTOTALSTAKED]:
      stakingPool.parsed &&
      contractInfo[AssetInfoKey.LPTOTALSTAKED](stakingPool.parsed),
    [AssetInfoKey.LPTOTALSUPPLY]:
      lpTokenInfo.parsed &&
      contractInfo[AssetInfoKey.LPTOTALSUPPLY](lpTokenInfo.parsed),

    [BalanceKey.TOKEN]:
      tokenBalance.parsed && balance[BalanceKey.TOKEN](tokenBalance.parsed),
    [BalanceKey.LPTOTAL]:
      lpTokenBalance.parsed &&
      stakingReward.parsed &&
      balance[BalanceKey.LPTOTAL](lpTokenBalance.parsed, stakingReward.parsed),
    [BalanceKey.LPSTAKABLE]:
      lpTokenBalance.parsed &&
      balance[BalanceKey.LPSTAKABLE](lpTokenBalance.parsed),
    [BalanceKey.LPSTAKED]:
      stakingReward.parsed &&
      balance[BalanceKey.LPSTAKED](stakingReward.parsed),
    [BalanceKey.MIRGOVSTAKED]:
      govStake.parsed && balance[BalanceKey.MIRGOVSTAKED](govStake.parsed),
    [BalanceKey.REWARD]:
      stakingPool.parsed &&
      stakingReward.parsed &&
      balance[BalanceKey.REWARD](stakingPool.parsed, stakingReward.parsed),
  }

  const data = {
    ...dictionary,
    [AccountInfoKey.UUSD]:
      bankBalance.data && accountInfo[AccountInfoKey.UUSD](bankBalance.data),
  }

  /* utils */
  const find: Contract["find"] = (key, token) => {
    if (token && !(AccAddress.validate(token) || token === UUSD)) {
      throw Error(`token must be an address: ${token}`)
    }

    const result = dictionary[key]?.[token]

    const USTPrice = "1"
    const isUSTPrice =
      token === UUSD && Object.values<string>(PriceKey).includes(key)

    const USTBalance = data[AccountInfoKey.UUSD]
    const isUSTBalance =
      token === UUSD && Object.values<string>(BalanceKey).includes(key)

    return result ?? (isUSTPrice ? USTPrice : isUSTBalance ? USTBalance : "0")
  }

  const rewards = sum(Object.values(dictionary[BalanceKey.REWARD] ?? {}))
  return { result, parsed, ...data, find, rewards }
}

/*
Terra Mantle returns the stringified JSON for the WasmContract query.
Therefore, it is necessary to parse them again and then convert them according to the format.
As a result, `data` value as a GraphQL result cannot be used as it is.
Eventually, GraphQL results are collected and provided as an object called `result`.
Developers should take out `data` according to `result`.
*/

export const useResult = () => {
  const { result } = useContract()
  return result
}
