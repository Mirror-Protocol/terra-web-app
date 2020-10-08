import { useEffect } from "react"
import { Dictionary } from "ramda"
import { QueryResult } from "@apollo/client"
import { number } from "../libs/math"
import { useContractsAddress } from "../hooks"
import createContext from "../hooks/createContext"
import { fromBase64 } from "../forms/formHelpers"
import { WASMQUERY } from "./gqldocs"
import useContractQuery from "./useContractQuery"

/**
 * Config: Call it once for the first time.
 * Polls: List and Details, recommended to refetch.
 * Voter: Load the id of each Details once each.
 */

export enum GovKey {
  POLLS = "polls",
  CONFIG = "config",
  STATE = "state",
}

interface Gov {
  result: Record<GovKey, QueryResult>
  [GovKey.POLLS]: { data: Dictionary<Poll>; list: number[]; height?: number }
  [GovKey.CONFIG]: GovConfig | undefined
  [GovKey.STATE]: GovState | undefined
}

export const [useGov, GovProvider] = createContext<Gov>("useGov")

/* state */
export const useGovContext = (): Gov => {
  const { contracts } = useContractsAddress()

  /* contract query */
  const variables = {
    contract: contracts["gov"],
    msg: { polls: { limit: Math.pow(2, 32) - 1 } },
  }

  const { result, parsed } = useContractQuery<PollsData>(variables)
  const data = useSelect(parsed) ?? {}
  const height = result.data?.[WASMQUERY]?.Height

  /* sort */
  const list = Object.keys(data)
    .map(Number)
    .sort((a, b) => b - a)

  /* config */
  const config = useGovConfig()

  /* state */
  const state = useGovState()

  return {
    result: {
      [GovKey.POLLS]: result,
      [GovKey.CONFIG]: config.result,
      [GovKey.STATE]: state.result,
    },

    [GovKey.POLLS]: { data, list, height: height ? number(height) : undefined },
    [GovKey.CONFIG]: config.parsed,
    [GovKey.STATE]: state.parsed,
  }
}

/* refetch gov */
export const useRefetchPolls = () => {
  const { result } = useGov()
  const { refetch } = result[GovKey.POLLS]

  useEffect(() => {
    refetch?.()
  }, [refetch])
}

/* voters */
export const useVoters = (id: number) => {
  const { contracts } = useContractsAddress()
  const variables = {
    contract: contracts["gov"],
    msg: { voters: { poll_id: id, limit: Math.pow(2, 16) - 1 } },
  }

  const { parsed } = useContractQuery<{ voters: Voter[] }>(variables)
  return { voters: parsed?.voters }
}

/* config */
export const useGovConfig = () => {
  const { contracts } = useContractsAddress()
  const variables = { contract: contracts["gov"], msg: { config: {} } }
  const query = useContractQuery<GovConfig>(variables)
  return query
}

/* state */
export const useGovState = () => {
  const { contracts } = useContractsAddress()
  const variables = { contract: contracts["gov"], msg: { state: {} } }
  const query = useContractQuery<GovState>(variables)
  return query
}

/* select */
enum PollType {
  WHITELIST = "whitelist",
  PARAMETER = "parameter change",
}

const useSelect = (data?: PollsData) => {
  const { getSymbol, parseAssetInfo } = useContractsAddress()

  const parseParams = (decoded: DecodedExecuteMsg, id: number) => {
    const type =
      "whitelist" in decoded ? PollType.WHITELIST : PollType.PARAMETER
    const parsed =
      "whitelist" in decoded
        ? parseWhitelist(decoded.whitelist)
        : "update_weight" in decoded
        ? parseUpdateWeight(decoded.update_weight)
        : parsePassCommand(decoded.pass_command)

    return { type, ...parsed }
  }

  const parseWhitelist = ({ params, ...whitelist }: Whitelist) => ({
    msg: whitelist,
    params,
  })

  const parseUpdateWeight = ({ asset_token, weight }: UpdateWeight) => ({
    msg: { asset: getSymbol(asset_token) },
    params: { weight },
  })

  const parsePassCommand = ({ contract_addr, msg }: PassCommand) => {
    const decodedPassCommand = fromBase64<DecodedPassCommandMsg>(msg)

    return "update_asset" in decodedPassCommand
      ? parseUpdateAsset(decodedPassCommand.update_asset)
      : {
          msg: { asset: getSymbol(contract_addr) },
          params: decodedPassCommand.update_config,
        }
  }

  const parseUpdateAsset = ({ asset_info, ...params }: UpdateAsset) => ({
    msg: { asset: parseAssetInfo(asset_info) },
    params,
  })

  return data?.polls.reduce((acc, poll) => {
    try {
      const decoded = fromBase64<DecodedExecuteMsg>(poll.execute_data.msg)
      const parsed = parseParams(decoded, poll.id)
      return { ...acc, [poll.id]: { ...poll, ...parsed } }
    } catch (error) {
      return { ...acc }
    }
  }, {})
}
