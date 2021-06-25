interface PollsData {
  polls: PollData[]
}

interface PollData {
  id: number
  end_time: number
  status: PollStatus
  creator: string

  deposit_amount: string

  yes_votes?: string
  no_votes?: string
  abstain_votes?: string
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
  type?: string
  msg?: object
  params?: object
  contents?: Content[]
}

type DecodedExecuteMsg =
  | { whitelist: Whitelist }
  | { revoke_asset: RevokeAsset }
  | { pass_command: PassCommand }
  | { update_weight: UpdateWeight }
  | { update_config: Partial<GovConfig> }
  | { update_collateral_multiplier: UpdateCollateralMultiplier }
  | { spend: Spend }

interface Whitelist {
  name: string
  symbol: string
  oracle_feeder: string
  params: AssetParams
}

interface RevokeAsset {
  asset_token: string
  end_price: string
}

interface AssetParams {
  auction_discount: string
  min_collateral_ratio: string
  min_collateral_ratio_after_migration: string
  mint_period: number
  pre_ipo_price: string
}

interface UpdateAsset extends Partial<AssetParams> {
  asset_token: string
}

interface UpdateWeight {
  asset_token: string
  weight: string
}

interface PassCommand {
  contract_addr: string
  msg: EncodedPassCommandMsg
}

type DecodedPassCommandMsg = { update_asset: UpdateAsset }

interface UpdateCollateralMultiplier {
  asset: AssetInfo
  multiplier: number
}

interface Spend {
  recipient: string
  amount: string
}

/* votes */
type VoteAnswer = "yes" | "no" | "abstain"
interface Voter {
  vote: VoteAnswer
  voter: string
}

/* config */
interface GovConfig {
  owner: string
  voting_period: number
  expiration_period: number
  effective_delay: number
  quorum: string
  threshold: string
  proposal_deposit: string
  voter_weight: string
}

/* state */
interface GovState {
  poll_count: number
  total_share: string
  total_deposit: string
}
