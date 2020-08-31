interface PollsData {
  polls: PollData[]
}

interface PollData {
  id: number
  end_height: number
  status: PollStatus
  creator: string

  deposit_amount: string

  yes_votes?: string
  no_votes?: string
  total_balance_at_end_poll?: string

  title: string
  description: string
  link?: string

  execute_data: {
    contract: string
    msg: EncodedExecuteMsg
  }
}

type EncodedExecuteMsg = string
type EncodedPassCommandMsg = string

interface Poll extends PollData {
  type: string
  msg: object
  params: object
}

type DecodedExecuteMsg =
  | { whitelist: Whitelist }
  | { update_weight: UpdateWeight }
  | { pass_command: PassCommand }

interface Whitelist {
  name: string
  symbol: string
  oracle_feeder: string
  params: AssetParams
}

interface AssetParams {
  weight: string
  lp_commission: string
  owner_commission: string
  auction_discount: string
  min_collateral_ratio: string
}

interface UpdateWeight {
  asset_token: string
  weight: string
}

interface UpdateAsset extends Partial<AssetParams> {
  asset_token: string
}

interface PassCommand {
  contract_addr: string
  msg: EncodedPassCommandMsg
}

type DecodedPassCommandMsg =
  | { update_config: Partial<AssetParams> }
  | { update_asset: UpdateAsset }

/* votes */
interface Voter {
  vote: "yes" | "no"
  voter: string
}

/* config */
interface GovConfig {
  effective_delay: number
  quorum: string
  threshold: string
  proposal_deposit: string
}

/* state */
interface GovState {
  total_share: string
  total_deposit: string
}
