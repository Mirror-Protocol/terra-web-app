interface Price {
  price: string
}

interface Rate {
  rate: string
}

interface Balance {
  balance: string
}

interface TotalSupply {
  total_supply: string
}

/* Price */
interface PairPool {
  assets: (AssetToken | NativeToken)[]
  total_share: string
}

interface MintAssetConfig {
  min_collateral_ratio: string
  end_price: string
  ipo_params: IPOParams | null
}

interface IPOParams {
  mint_end: number
  pre_ipo_price: string
  min_collateral_ratio_after_ipo: string
}

/* Contract Info */
interface CollateralOracleAssetInfo {
  asset: string
  multiplier: string
  source_type: string
  is_revoked: boolean
}

interface StakingPool {
  total_bond_amount: string
  reward_index: string
}

/* Balance */
interface StakingRewardInfo {
  reward_infos: RewardInfo[]
}

interface RewardInfo {
  asset_token: string
  bond_amount: string
  is_short: boolean
  pending_reward: string
}

type PollID = number
type RewardAmount = string
type LockedBalance = [PollID, { balance: string; vote: VoteAnswer }]
type WithdrawablePolls = [PollID, RewardAmount]

interface GovStaker extends Balance {
  locked_balance: LockedBalance[]
  withdrawable_polls: WithdrawablePolls[]
  pending_voting_rewards: string
}

/* Account Info */
interface MintPositions {
  positions: MintPosition[]
}

interface MintPosition {
  idx: string
  owner: string
  collateral: AssetToken | NativeToken
  asset: AssetToken
  is_short: boolean
}

interface LockPositionInfo {
  idx: string
  locked_amount: string
  receiver: string
  unlock_time: number
}

/* Limit order */
interface Order {
  order_id: number
  bidder_addr: string
  offer_asset: AssetToken | NativeToken
  ask_asset: AssetToken | NativeToken
  filled_offer_amount: string
  filled_ask_amount: string
}

/* Native Info */
interface OracleDenomsExchangeRates {
  OracleDenomsExchangeRates: { Result: MantleCoin[] }
}

interface BankBalanceAddress {
  BankBalancesAddress?: { Result: MantleCoin[] }
}

interface MantleCoin {
  Amount: string
  Denom: string
}
