import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { TxResult, UserDenied } from "@terra-money/wallet-provider"

import { TX_POLLING_INTERVAL } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import { getPath, MenuKey } from "../../routes"

import Wait, { STATUS } from "../../components/Wait"
import { getTxInfosQuery } from "../../data/native/tx"
import { bankBalanceIndexState } from "../../data/native/balance"
import { concatFromContract } from "../receipts/receiptHelpers"
import TxHash from "./TxHash"
import TxInfo from "./TxInfo"
import { PostError } from "./FormContainer"

interface Props {
  response?: TxResult
  error?: PostError
  parseTx?: ResultParser
  gov?: boolean
  onFailure?: () => void
}

const Result = ({ response, error, parseTx, onFailure, gov }: Props) => {
  const success = !error
  const hash = response?.result.txhash ?? ""
  const raw_log = response?.result.raw_log ?? ""

  /* polling */
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false)
  const getTxInfos = useRecoilValue(getTxInfosQuery)
  const tx = useQuery(hash, () => getTxInfos(hash), { refetchInterval })
  const { data: txInfo } = tx

  /* status */
  const status =
    !success || !hash || tx.error || (txInfo && !txInfo?.Success)
      ? STATUS.FAILURE
      : tx.isLoading || !txInfo
      ? STATUS.LOADING
      : STATUS.SUCCESS

  useEffect(() => {
    success && hash && setRefetchInterval(TX_POLLING_INTERVAL)
  }, [success, hash])

  const setBankBalanceIndexState = useSetRecoilState(bankBalanceIndexState)

  useEffect(() => {
    if (status === STATUS.LOADING) {
      setRefetchInterval(TX_POLLING_INTERVAL)
    } else {
      setRefetchInterval(false)
      setBankBalanceIndexState((n) => n + 1)
    }
  }, [status, setBankBalanceIndexState])

  /* verbose */
  const verbose = txInfo
    ? JSON.stringify(concatFromContract(txInfo.Logs), null, 2)
    : undefined

  useEffect(() => {
    const log = () => {
      console.info(verbose)
    }

    verbose && log()
  }, [verbose])

  /* render */
  const message =
    txInfo?.RawLog ||
    raw_log ||
    error?.message ||
    (error instanceof UserDenied && MESSAGE.Result.DENIED)

  const content = {
    [STATUS.SUCCESS]: txInfo && <TxInfo txInfo={txInfo} parser={parseTx} />,
    [STATUS.LOADING]: null,
    [STATUS.FAILURE]: message,
  }[status]

  const wait = {
    status,

    hash: status === STATUS.LOADING && <TxHash>{hash}</TxHash>,

    link:
      status === STATUS.SUCCESS
        ? {
            to: getPath(!gov ? MenuKey.MY : MenuKey.GOV),
            children: !gov ? MenuKey.MY : MenuKey.GOV,
          }
        : undefined,

    button:
      status === STATUS.FAILURE
        ? {
            onClick: onFailure,
            children: MESSAGE.Result.Button.FAILURE,
          }
        : undefined,
  }

  return <Wait {...wait}>{content}</Wait>
}

export default Result
