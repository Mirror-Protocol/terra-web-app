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

/* Contract Info */
interface MintInfo {
  min_collateral_ratio: string
}

interface StakingPool {
  total_bond_amount: string
  reward_index: string
}

/* Balance */
interface StakingReward {
  reward_infos: RewardInfo[]
}

interface RewardInfo {
  asset_token: string
  bond_amount: string
  index: string
  pending_reward: string
}

interface GovStaker extends Balance {
  locked_balance: LockedBalance[]
}

type LockedBalance = [number, { balance: string; vote: VoteAnswer }]

/* Account Info */
interface BankBalance {
  BankBalancesAddress?: { Result: { Amount: string; Denom: string }[] }
}

interface MintPositions {
  positions: MintPosition[]
}

interface MintPosition {
  idx: string
  owner: string
  collateral: AssetToken | NativeToken
  asset: AssetToken
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
