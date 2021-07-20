import { selector, useRecoilValue } from "recoil"
import { div, isInteger } from "../../libs/math"
import { percent } from "../../libs/num"
import { formatAsset } from "../../libs/parse"
import { fromBase64 } from "../../libs/formHelpers"
import { protocolQuery } from "../contract/protocol"
import { Content } from "../../components/componentTypes"
import { PollType } from "../../pages/Poll/CreatePoll"
import { Poll, PollData } from "./poll"

const parsePollQuery = selector({
  key: "parsePoll",
  get: ({ get }) => {
    const { getSymbol, parseAssetInfo } = get(protocolQuery)

    const parseParams = (decoded: DecodedExecuteMsg, id: number) => {
      const type =
        "whitelist" in decoded
          ? PollType.WHITELIST
          : "revoke_asset" in decoded
          ? PollType.DELIST
          : "pass_command" in decoded
          ? PollType.MINT_UPDATE
          : "update_weight" in decoded
          ? PollType.INFLATION
          : "update_config" in decoded
          ? PollType.GOV_UPDATE
          : "update_collateral_multiplier" in decoded
          ? PollType.COLLATERAL
          : "spend" in decoded
          ? PollType.COMMUNITY_SPEND
          : PollType.TEXT

      const parsed =
        "whitelist" in decoded
          ? parseWhitelist(decoded.whitelist)
          : "revoke_asset" in decoded
          ? parseRevokeAsset(decoded.revoke_asset)
          : "pass_command" in decoded
          ? parsePassCommand(decoded.pass_command)
          : "update_weight" in decoded
          ? parseUpdateWeight(decoded.update_weight)
          : "update_config" in decoded
          ? parseUpdateConfig(decoded.update_config)
          : "update_collateral_multiplier" in decoded
          ? parseUpdateCollateralMultiplier(
              decoded.update_collateral_multiplier
            )
          : "spend" in decoded
          ? parseSpend(decoded.spend)
          : {}

      return { type, ...parsed }
    }

    const parseWhitelist = ({ params, ...whitelist }: Whitelist) => {
      const { mint_period, pre_ipo_price, ...rest } = params

      return {
        contents: [
          ...parseContents(whitelist),
          ...parseContents(rest, { format: percent }),
          ...parseContents({ mint_period }, { unit: "Seconds" }),
          ...parseContents(
            { pre_ipo_price },
            { unit: `UST per ${whitelist.symbol}` }
          ),
        ],
      }
    }

    const parseRevokeAsset = ({ asset_token, end_price }: RevokeAsset) => {
      const symbol = getSymbol(asset_token)
      return { contents: parseContents({ asset: symbol }) }
    }

    const parsePassCommand = ({ msg }: PassCommand) => {
      const decodedPassCommand = fromBase64<DecodedPassCommandMsg>(msg)
      return parseUpdateAsset(decodedPassCommand.update_asset)
    }

    const parseUpdateAsset = ({ asset_token, ...params }: UpdateAsset) => ({
      contents: [
        ...parseContents({ asset: getSymbol(asset_token) }),
        ...parseContents(params, { format: percent }),
      ],
    })

    const parseUpdateWeight = ({ asset_token, weight }: UpdateWeight) => ({
      contents: parseContents({
        asset: getSymbol(asset_token),
        weight: div(weight, 100),
      }),
    })

    const parseUpdateConfig = (config: Partial<GovConfig>) => {
      const { voting_period, expiration_period, effective_delay } = config
      const { quorum, threshold } = config
      const { proposal_deposit, voter_weight, owner } = config

      return {
        contents: [
          ...parseContents({
            owner,
            voting_period: getBlocks(voting_period),
            expiration_period: getBlocks(expiration_period),
            effective_delay: getBlocks(effective_delay),
            proposal_deposit: proposal_deposit
              ? formatAsset(proposal_deposit, "MIR")
              : undefined,
            voter_weight,
          }),
          ...parseContents({ quorum, threshold }, { format: percent }),
        ],
      }
    }

    const parseUpdateCollateralMultiplier = ({
      asset,
      multiplier,
    }: UpdateCollateralMultiplier) => {
      const { symbol } = parseAssetInfo(asset)
      return {
        contents: parseContents({ symbol, multiplier: String(multiplier) }),
      }
    }

    const getBlocks = (n?: number) => (isInteger(n) ? `${n} Blocks` : undefined)

    const parseSpend = ({ recipient, amount }: Spend) => ({
      contents: parseContents({
        recipient,
        amount: formatAsset(amount, "MIR"),
      }),
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
  },
})

export const useParsePoll = () => {
  return useRecoilValue(parsePollQuery)
}

/* helpers */
const parseContents = (
  object?: object,
  config?: { format?: (value: string) => string; unit?: string }
): Content[] =>
  !object
    ? []
    : Object.entries(object).reduce<Content[]>((acc, [title, content]) => {
        const formatted = config?.format?.(content) ?? content
        const next = {
          title: getTitle(title),
          content: [formatted, config?.unit ?? ""].join(" "),
        }

        return content ? [...acc, next] : acc
      }, [])

export const getTitle = (title: string) => title.replace(/_/g, " ")
