import { useEffect } from "react"
import { Dictionary } from "ramda"
import { QueryResult } from "@apollo/client"
import { number } from "../libs/math"
import { fromBase64 } from "../libs/formHelpers"
import { useContractsAddress } from "../hooks"
import createContext from "../hooks/createContext"
import { WASMQUERY } from "./gqldocs"
import useContractQuery from "./useContractQuery"

export enum GovKey {
  /** Config: Call it once for the first time */
  CONFIG = "config",
  STATE = "state",
  BALANCE = "balance",
  POLLS = "polls",
}

interface Gov {
  result: Record<GovKey, QueryResult>
  [GovKey.CONFIG]: GovConfig | undefined
  [GovKey.STATE]: GovState | undefined
  [GovKey.BALANCE]: string | undefined
  [GovKey.POLLS]: { data: Dictionary<Poll>; list: number[]; height?: number }
}

export const [useGov, GovProvider] = createContext<Gov>("useGov")

/* state */
export const useGovContext = (): Gov => {
  const config = useGovConfig()
  const state = useGovState()
  const balance = useMirrorBalance()
  const { result, polls } = usePolls()
  const { height } = polls

  return {
    result: {
      [GovKey.CONFIG]: config.result,
      [GovKey.STATE]: state.result,
      [GovKey.BALANCE]: balance.result,
      [GovKey.POLLS]: result,
    },

    [GovKey.CONFIG]: config.parsed,
    [GovKey.STATE]: state.parsed,
    [GovKey.BALANCE]: balance.parsed?.balance,
    [GovKey.POLLS]: { ...polls, height: height ? number(height) : undefined },
  }
}

/* refetch gov */
export const useRefetchGov = (keys: GovKey[]) => {
  const { result } = useGov()
  useEffect(() => {
    keys.forEach((key) => {
      const { refetch } = result[key]
      refetch()
    })
    // eslint-disable-next-line
  }, [JSON.stringify(keys)])
}

/* config */
const useGovConfig = () => {
  const { contracts } = useContractsAddress()
  const variables = { contract: contracts["gov"], msg: { config: {} } }
  const query = useContractQuery<GovConfig>(variables)
  return query
}

/* state */
const useGovState = () => {
  const { contracts } = useContractsAddress()
  const variables = { contract: contracts["gov"], msg: { state: {} } }
  const query = useContractQuery<GovState>(variables)
  return query
}

/* mirror balance */
const useMirrorBalance = () => {
  const { contracts } = useContractsAddress()
  const variables = {
    contract: contracts["mirrorToken"],
    msg: { balance: { address: contracts["gov"] } },
  }

  const query = useContractQuery<{ balance: string }>(variables)
  return query
}

/* polls */
const usePolls = () => {
  const { contracts } = useContractsAddress()

  /* contract query */
  const variables = {
    contract: contracts["gov"],
    msg: { polls: { limit: Math.pow(2, 32) - 1 } },
  }

  const query = useContractQuery<PollsData>(variables)
  const { result, parsed } = query
  const data = useSelect(parsed) ?? {}
  const height = result.data?.[WASMQUERY]?.Height

  /* sort */
  const list = Object.keys(data)
    .map(Number)
    .sort((a, b) => b - a)

  return { ...query, polls: { data, list, height } }
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

/* select */
enum PollType {
  WHITELIST = "whitelist",
  PARAMETER = "parameter change",
}

const useSelect = (data?: PollsData) => {
  const { getSymbol } = useContractsAddress()

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

  const parseUpdateAsset = ({ asset_token, ...params }: UpdateAsset) => ({
    msg: { asset: getSymbol(asset_token) },
    params,
  })

  return data?.polls.reduce((acc, poll) => {
    try {
      const decoded = fromBase64<DecodedExecuteMsg>(poll.execute_data.msg)
      const parsed = parseParams(decoded, poll.id)
      return { ...acc, [poll.id]: { ...poll, ...parsed } }
    } catch (error) {
      return { ...acc, [poll.id]: poll }
    }
  }, {})
}
