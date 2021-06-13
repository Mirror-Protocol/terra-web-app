import { Dictionary } from "ramda"
import { LP, MIR } from "constants/constants"

const parser: Dictionary<Dictionary<ResultParserItem>> = {
  trade: {
    Offer: { amountKey: "offer_amount", symbolKey: "offer_asset" },
    Return: { amountKey: "return_amount", symbolKey: "ask_asset" },
    Tax: { amountKey: "tax_amount", symbolKey: "ask_asset" },
    Spread: { amountKey: "spread_amount", symbolKey: "ask_asset" },
    Commission: { amountKey: "commission_amount", symbolKey: "ask_asset" },
  },

  mint: {
    idx: { valueKey: "position_idx" },
    Collateral: { tokenKey: "collateral_amount" },
    Deposit: { tokenKey: "deposit_amount" },
    Withdraw: { tokenKey: "withdraw_amount" },
    Mint: { tokenKey: "mint_amount" },
    Burn: { tokenKey: "burn_amount" },
    Tax: { tokenKey: "tax_amount" },
  },

  pool: {
    Deposit: { tokenKey: "assets" },
    Refund: { tokenKey: "refund_assets" },
  },

  stake: { Amount: { amountKey: "amount", symbol: LP } },
  claim: { Amount: { amountKey: "amount", symbol: MIR } },
  gov: { id: { valueKey: "poll_id" } },

  send: {
    To: { valueKey: "to" },
    Amount: { amountKey: "amount", symbolKey: "contract_address" },
  },
}

export default parser
