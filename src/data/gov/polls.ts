import { last } from "ramda"
import { atomFamily, selectorFamily } from "recoil"
import { getContractQueriesQuery } from "../utils/queries"
import { getContractQueryQuery } from "../utils/query"
import { useStore } from "../utils/loadable"
import { usePagination } from "../utils/pagination"
import alias from "../contract/alias"
import { protocolQuery } from "../contract/protocol"
import { locationKeyState } from "../app"
import { Poll, PollData } from "./poll"

export const LIMIT = 30

export interface PollsData {
  polls: PollData[]
}

const govPollsQuery = selectorFamily({
  key: "govPolls",
  get:
    (offset: number | undefined) =>
    async ({ get }) => {
      get(locationKeyState)
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const response = await getContractQuery<PollsData>(
        {
          contract: contracts["gov"],
          msg: { polls: { limit: LIMIT, start_after: offset } },
        },
        "govPolls"
      )

      return response?.polls ?? []
    },
})

export const pollsByIdsQuery = selectorFamily({
  key: "pollsByIds",
  get:
    (ids: PollID[]) =>
    async ({ get }) => {
      const getContractQueries = get(getContractQueriesQuery)
      const { contracts } = get(protocolQuery)

      if (ids.length) {
        const document = alias(
          ids.map((id) => ({
            name: "poll" + id,
            contract: contracts["gov"],
            msg: { poll: { poll_id: id } },
          })),
          "pollsByIds"
        )

        return (await getContractQueries<Poll>(document, "pollsByIds")) ?? {}
      }

      return {}
    },
})

const pollsByIdsState = atomFamily<Dictionary<Poll>, PollID[]>({
  key: "pollsByIdsState",
  default: {},
})

/* hooks */
export const usePolls = () => {
  return usePagination(govPollsQuery, ({ data }) => last(data)?.id, LIMIT, "id")
}

export const usePollsByIds = (ids: PollID[]) => {
  return useStore(pollsByIdsQuery(ids), pollsByIdsState(ids))
}
