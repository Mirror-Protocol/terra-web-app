import useNewContractMsg from "../terra/useNewContractMsg"
import { MIR } from "../constants"
import { gt, plus } from "../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"
import Count from "../components/Count"
import useClaimReceipt from "./receipts/useClaimReceipt"
import FormContainer from "./FormContainer"

interface Props {
  token?: string
}

const ClaimForm = ({ token }: Props) => {
  /* context */
  const { contracts, getToken } = useContractsAddress()
  const { find, rewards } = useContract()
  useRefetch([BalanceKey.TOKEN, BalanceKey.LPSTAKED, BalanceKey.REWARD])

  const balance = find(BalanceKey.TOKEN, getToken(MIR))
  const claiming = token ? find(BalanceKey.REWARD, token) : rewards

  /* confirm */
  const contents = [
    {
      title: "Claiming",
      content: <Count symbol={MIR}>{claiming}</Count>,
    },
    {
      title: "MIR after Tx",
      content: <Count symbol={MIR}>{plus(balance, claiming)}</Count>,
    },
  ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contracts["staking"], {
      withdraw: token ? { asset_token: token } : {},
    }),
  ]

  const disabled = !gt(claiming, 0)

  /* result */
  const parseTx = useClaimReceipt()

  const container = { contents, disabled, data, parseTx }
  const props = { tab: { tabs: ["Claim"], current: "Claim" }, label: "Claim" }

  return <FormContainer {...container} {...props} />
}

export default ClaimForm
