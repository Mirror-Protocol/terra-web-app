import BigNumber from "bignumber.js"
import { GENESIS } from "../../constants"
import { times } from "../../libs/math"
import { toAmount } from "../../libs/parse"
import { useContractsAddress } from "../../hooks"
import useContractQuery from "../../graphql/useContractQuery"

const COMMUNITY_BALANCE_TOTAL = 128.1 // Million
const COMMUNITY_BALANCES_ANNUAL = [36.6, 54.9, 91.5, 128.1] // Million

const useCommunityCurrentBalance = () => {
  const { contracts } = useContractsAddress()

  const query = {
    contract: contracts["mirrorToken"],
    msg: { balance: { address: contracts["community"] } },
  }

  const result = useContractQuery<{ balance: string }>(query)
  return result
}

const useCommunityBalance = () => {
  const { parsed: current } = useCommunityCurrentBalance()
  const totalSupply = parseMillion(COMMUNITY_BALANCE_TOTAL)
  const fundAnnual = parseMillion(getFundAnnual())
  const currentBalance = current?.balance
  return currentBalance && calc({ fundAnnual, totalSupply, currentBalance })
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
  currentBalance: string
}

const calc = ({ fundAnnual, totalSupply, currentBalance }: Params) => {
  const used = new BigNumber(totalSupply).minus(currentBalance)
  const result = new BigNumber(fundAnnual).minus(used)
  return result.toString()
}
