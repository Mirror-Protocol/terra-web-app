import { useEffect } from "react"
import { useLazyQuery } from "@apollo/client"
import classNames from "classnames/bind"

import { TX_POLLING_INTERVAL } from "../constants"
import { TXINFOS } from "../graphql/gqldocs"
import { PostResponse } from "../terra/extension"
import MESSAGE from "../lang/MESSAGE.json"
import { useResult } from "../hooks"

import Card from "../components/Card"
import Icon from "../components/Icon"
import Loading from "../components/Loading"
import Button from "../components/Button"
import LinkButton from "../components/LinkButton"

import { getPath, MenuKey } from "../routes"
import TxHash from "./TxHash"
import TxInfo from "./TxInfo"
import styles from "./Result.module.scss"

interface Props extends PostResponse {
  parseTx: ResultParser
  gov?: boolean
  onFailure: () => void
}

const cx = classNames.bind(styles)

enum STATUS {
  SUCCESS = "success",
  LOADING = "loading",
  FAILURE = "failure",
}

const Result = ({ success, result, error, ...props }: Props) => {
  const { parseTx, onFailure, gov } = props
  const { txhash: hash = "" } = result ?? {}

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
  const name = {
    [STATUS.SUCCESS]: "check_circle_outline",
    [STATUS.LOADING]: "",
    [STATUS.FAILURE]: "highlight_off",
  }[status]

  const icon = name ? (
    <Icon name={name} className={cx(status)} size={50} />
  ) : (
    <Loading size={40} />
  )

  const title = {
    [STATUS.SUCCESS]: MESSAGE.Result.SUCCESS,
    [STATUS.LOADING]: MESSAGE.Result.LOADING,
    [STATUS.FAILURE]: MESSAGE.Result.FAILURE,
  }[status]

  const message =
    txInfo?.RawLog ||
    result?.raw_log ||
    error?.message ||
    (error?.code === 1 && MESSAGE.Result.DENIED)

  const content = {
    [STATUS.SUCCESS]: txInfo && <TxInfo txInfo={txInfo} parser={parseTx} />,
    [STATUS.LOADING]: (
      <p className={styles.hash}>
        <TxHash>{hash}</TxHash>
      </p>
    ),
    [STATUS.FAILURE]: <p className={styles.feedback}>{message}</p>,
  }[status]

  const button = {
    [STATUS.SUCCESS]: (
      <LinkButton
        to={getPath(!gov ? MenuKey.MY : MenuKey.GOV)}
        size="lg"
        submit
      >
        {!gov ? MenuKey.MY : MenuKey.GOV}
      </LinkButton>
    ),
    [STATUS.LOADING]: null,
    [STATUS.FAILURE]: (
      <Button onClick={onFailure} size="lg" submit>
        {MESSAGE.Result.Button.FAILURE}
      </Button>
    ),
  }[status]

  return (
    <Card icon={icon} title={title} lg>
      <section className={styles.contents}>{content}</section>
      <footer>{button}</footer>
    </Card>
  )
}

export default Result
