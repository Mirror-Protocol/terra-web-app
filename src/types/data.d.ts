interface Price {
  price: string
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

interface PairConfig {
  lp_commission: string
  owner_commission: string
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
