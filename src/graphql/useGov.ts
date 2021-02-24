import { useEffect, useState } from "react"
import { Dictionary, last } from "ramda"
import { QueryResult } from "@apollo/client"

import { MIR } from "../constants"
import { div, isInteger, number } from "../libs/math"
import { formatAsset } from "../libs/parse"
import { fromBase64 } from "../libs/formHelpers"

import { useContractsAddress } from "../hooks"
import createContext from "../hooks/createContext"
import { Type as PollType } from "../pages/Poll/CreatePoll"
import { WASMQUERY } from "./gqldocs"
import useContractQuery from "./useContractQuery"

export enum GovKey {
  /** Config: Call it once for the first time */
  CONFIG = "config",
  BALANCE = "balance",
  POLLS = "polls",
}

interface PollsUI {
  data: Dictionary<Poll>
  list: number[]
  height?: number
  offset?: number
  more: () => void
}

interface Gov {
  result: Record<GovKey, QueryResult>
  [GovKey.CONFIG]: GovConfig | undefined
  [GovKey.BALANCE]: string | undefined
  [GovKey.POLLS]: PollsUI
}

export const [useGov, GovProvider] = createContext<Gov>("useGov")
const govState = createContext<GovState>("useGovState")
export const [useGovState, GovStateProvider] = govState

/* state */
export const useGovContext = (): Gov => {
  const config = useGovConfig()
  const balance = useMirrorBalance()
  const { result, polls } = usePolls()
  const { height } = polls

  return {
    result: {
      [GovKey.CONFIG]: config.result,
      [GovKey.BALANCE]: balance.result,
      [GovKey.POLLS]: result,
    },

    [GovKey.CONFIG]: config.parsed,
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
export const useGovStateState = () => {
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
export const LIMIT = 30
const usePolls = () => {
  const [offset, setOffset] = useState<number>()
  const { contracts } = useContractsAddress()

  /* contract query */
  const variables = {
    contract: contracts["gov"],
    msg: { polls: { limit: LIMIT, start_after: offset } },
  }

  const query = useContractQuery<PollsData>(variables)
  const { result, parsed } = query

  const select = useSelect()
  const [data, setData] = useState<Record<number, Poll>>({})

  useEffect(() => {
    const next = select(parsed) ?? {}
    setData((data) => ({ ...data, ...next }))
    // eslint-disable-next-line
  }, [JSON.stringify(parsed)])

  const height = result.data?.[WASMQUERY]?.Height

  /* sort */
  const list = Object.keys(data)
    .map(Number)
    .sort((a, b) => b - a)

  const more = () => setOffset(last(list))

  return { ...query, polls: { data, list, height, more, offset } }
}

export const usePoll = (id: number) => {
  const { contracts } = useContractsAddress()

  /* contract query */
  const variables = {
    contract: contracts["gov"],
    msg: { poll: { poll_id: id } },
  }

  const query = useContractQuery<PollData>(variables)
  const { parsed } = query

  const parsePoll = useParsePoll()

  return { ...query, poll: parsed && parsePoll(parsed) }
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
const useSelect = () => {
  const parsePoll = useParsePoll()
  return (data?: PollsData) => {
    return data?.polls.reduce(
      (acc, poll) => ({ ...acc, [poll.id]: parsePoll(poll) }),
      {}
    )
  }
}

const useParsePoll = () => {
  const { getSymbol } = useContractsAddress()

  const parseParams = (decoded: DecodedExecuteMsg, id: number) => {
    const type =
      "whitelist" in decoded
        ? PollType.WHITELIST
        : "pass_command" in decoded
        ? PollType.MINT_UPDATE
        : "update_weight" in decoded
        ? PollType.INFLATION
        : "update_config" in decoded
        ? PollType.GOV_UPDATE
        : "spend" in decoded
        ? PollType.COMMUNITY_SPEND
        : PollType.TEXT

    const parsed =
      "whitelist" in decoded
        ? parseWhitelist(decoded.whitelist)
        : "pass_command" in decoded
        ? parsePassCommand(decoded.pass_command)
        : "update_weight" in decoded
        ? parseUpdateWeight(decoded.update_weight)
        : "update_config" in decoded
        ? parseUpdateConfig(decoded.update_config)
        : "spend" in decoded
        ? parseSpend(decoded.spend)
        : {}

    return { type, ...parsed }
  }

  const parseWhitelist = ({ params, ...whitelist }: Whitelist) => ({
    msg: whitelist,
    params,
  })

  const parsePassCommand = ({ msg }: PassCommand) => {
    const decodedPassCommand = fromBase64<DecodedPassCommandMsg>(msg)
    return parseUpdateAsset(decodedPassCommand.update_asset)
  }

  const parseUpdateAsset = ({ asset_token, ...params }: UpdateAsset) => ({
    msg: { asset: getSymbol(asset_token) },
    params,
  })

  const parseUpdateWeight = ({ asset_token, weight }: UpdateWeight) => ({
    msg: { asset: getSymbol(asset_token), weight: div(weight, 100) },
  })

  const parseUpdateConfig = (config: Partial<GovConfig>) => {
    const { voting_period, expiration_period, effective_delay } = config
    const { quorum, threshold } = config
    const { proposal_deposit, owner } = config

    return {
      msg: {
        owner,
        voting_period: getBlocks(voting_period),
        expiration_period: getBlocks(expiration_period),
        effective_delay: getBlocks(effective_delay),
        proposal_deposit: proposal_deposit
          ? formatAsset(proposal_deposit, MIR)
          : undefined,
      },
      params: { quorum, threshold },
    }
  }

  const getBlocks = (n?: number) => (isInteger(n) ? `${n} Blocks` : undefined)

  const parseSpend = ({ recipient, amount }: Spend) => ({
    msg: { recipient, amount: formatAsset(amount, MIR) },
  })

  return (poll: PollData): Poll => {
    try {
      if (poll.execute_data) {
        const decoded = fromBase64<DecodedExecuteMsg>(poll.execute_data.msg)
        const parsed = parseParams(decoded, poll.id)
        return { ...poll, ...parsed }
      } else {
        return { ...poll, type: PollType.TEXT }
      }
    } catch (error) {
      return poll
    }
  }
}
