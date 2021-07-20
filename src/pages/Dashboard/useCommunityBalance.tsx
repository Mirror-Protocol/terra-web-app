import BigNumber from "bignumber.js"
import { GENESIS } from "../../constants"
import { useMirrorTokenCommunityBalance } from "../../data/contract/info"
import { gt, times } from "../../libs/math"
import { toAmount } from "../../libs/parse"

const COMMUNITY_BALANCE_TOTAL = 128.1 // Million
const COMMUNITY_BALANCES_ANNUAL = [36.6, 54.9, 91.5, 128.1] // Million

const useCommunityBalance = () => {
  const current = useMirrorTokenCommunityBalance()
  const totalSupply = parseMillion(COMMUNITY_BALANCE_TOTAL)
  const fundAnnual = parseMillion(getFundAnnual())
  return gt(current, 0) ? calc({ fundAnnual, totalSupply, current }) : "0"
}

export default useCommunityBalance

/* helpers */
const parseMillion = (n: number) => toAmount(times(n, 1e6))
const getFundAnnual = (now = Date.now()) => {
  const YEAR_TO_MILLISECONDS = 31556952000
  const index = Math.max(0, Math.floor((now - GENESIS) / YEAR_TO_MILLISECONDS))
  return COMMUNITY_BALANCES_ANNUAL[index]
}

/* calc */
interface Params {
  fundAnnual: string
  totalSupply: string
  current: string
}

const calc = ({ fundAnnual, totalSupply, current }: Params) => {
  const used = new BigNumber(totalSupply).minus(current)
  const result = new BigNumber(fundAnnual).minus(used)
  return result.toString()
}
