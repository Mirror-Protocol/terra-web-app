import { useEffect } from "react"
import { useLazyQuery } from "@apollo/client"
import { TxResult, UserDenied } from "@terra-money/wallet-provider"

import { TX_POLLING_INTERVAL } from "../constants"
import { TXINFOS } from "../graphql/gqldocs"
import MESSAGE from "../lang/MESSAGE.json"
import { useResult } from "../hooks"
import { getPath, MenuKey } from "../routes"

import Wait, { STATUS } from "../components/Wait"
import TxHash from "./TxHash"
import TxInfo from "./TxInfo"
import { PostError } from "./FormContainer"

interface Props {
  response?: TxResult
  error?: PostError
  parseTx: ResultParser
  gov?: boolean
  onFailure: () => void
}

const Result = ({ response, error, parseTx, onFailure, gov }: Props) => {
  const success = !error
  const hash = response?.result.txhash ?? ""
  const raw_log = response?.result.raw_log ?? ""

  /* context */
  const { uusd } = useResult()
  const { refetch } = uusd

  /* polling */
  const variables = { hash }
  const [load, tx] = useLazyQuery<TxInfos>(TXINFOS, { variables })

  const { data, startPolling, stopPolling } = tx
  const txInfo = data?.TxInfos[0]

  /* status */
  // TODO
  // 1. TIMEOUT - When there is no response for 20 seconds
  // 2. User denied
  const status =
    !success || !hash || tx.error || (txInfo && !txInfo?.Success)
      ? STATUS.FAILURE
      : tx.loading || !txInfo
      ? STATUS.LOADING
      : STATUS.SUCCESS

  useEffect(() => {
    success && hash && load()
  }, [success, hash, load])

  useEffect(() => {
    if (status === STATUS.LOADING) {
      startPolling?.(TX_POLLING_INTERVAL)
    } else {
      stopPolling?.()
      refetch?.()
    }
  }, [status, startPolling, stopPolling, refetch])

  /* verbose */
  const verbose = txInfo ? JSON.stringify(txInfo, null, 2) : undefined
  useEffect(() => {
    const log = () => {
      console.groupCollapsed("Logs")
      console.info(verbose)
      console.groupEnd()
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
