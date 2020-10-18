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
  | { migrate_asset: MigrateAsset }
  | { update_weight: UpdateWeight }
  | { pass_command: PassCommand }

interface Whitelist {
  name: string
  symbol: string
  oracle_feeder: string
  params: AssetParams
}

interface MigrateAsset {
  name: string
  symbol: string
  from_token: string
  conversion_rate: string
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
  share: string
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
