import React, { useEffect, useState } from "react"
import classNames from "classnames/bind"

import { TX_POLLING_INTERVAL } from "constants/constants"
import { PostResponse } from "terra/extension"
import MESSAGE from "lang/MESSAGE.json"
import { useNetwork } from "hooks"

import SwapCard from "components/SwapCard"
import Icon from "components/Icon"
import Loading from "components/Loading"
import Button from "components/Button"
import SwapTxHash from "./SwapTxHash"
import SwapTxInfo from "./SwapTxInfo"
import styles from "./Result.module.scss"

export interface ResultProps extends PostResponse {
  gov?: boolean
  parserKey: string
  onFailure: () => void
}

const cx = classNames.bind(styles)

enum STATUS {
  SUCCESS = "success",
  LOADING = "loading",
  FAILURE = "failure",
}

const Result = ({ success, result, error, ...props }: ResultProps) => {
  const { parserKey, onFailure } = props
  const { txhash: hash = "" } = result ?? {}

  /* polling */
  const variables = { hash }
  const [tx, setTx] = useState<SwapTxInfo>()

  const [status, setStatus] = useState<STATUS>(STATUS.LOADING)
  const { fcd } = useNetwork()

  useEffect(() => {
    const load = async () => {
      if (variables.hash === "") {
        setStatus(STATUS.FAILURE)
        return
      }
      const response: Response = await fetch(`${fcd}/txs/${variables.hash}`)
      const res: any = await response.json()
      if (res?.error && res.error.indexOf("Tx: RPC error -32603") > -1) {
        setTimeout(() => {
          load()
        }, TX_POLLING_INTERVAL)
      } else {
        setStatus(STATUS.SUCCESS)
      }
      setTx(res)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const txInfo = tx

  /* status */
  // TODO
  // 1. TIMEOUT - When there is no response for 20 seconds
  // 2. User denied

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
    [STATUS.SUCCESS]: (
      <span className={styles.success}>{MESSAGE.Result.SUCCESS}</span>
    ),
    [STATUS.LOADING]: MESSAGE.Result.LOADING,
    [STATUS.FAILURE]: (
      <span className={styles.failure}>{MESSAGE.Result.FAILURE}</span>
    ),
  }[status]

  const message =
    result?.raw_log ??
    error?.message ??
    (error?.code === 1 && MESSAGE.Result.DENIED)

  const content = {
    [STATUS.SUCCESS]: txInfo && (
      <SwapTxInfo txInfo={txInfo} parserKey={parserKey} />
    ),
    [STATUS.LOADING]: (
      <div>
        <Loading className={styles.progress} size={48} />
        <br />
        <br />
        <p className={styles.hash}>
          <SwapTxHash>{hash}</SwapTxHash>
        </p>
      </div>
    ),
    [STATUS.FAILURE]: <p className={styles.feedback}>{message}</p>,
  }[status]

  const button = {
    [STATUS.SUCCESS]: (
      <Button onClick={() => window.location.reload()} size="swap" submit>
        Done
      </Button>
    ),
    [STATUS.LOADING]: null,
    [STATUS.FAILURE]: (
      <Button onClick={onFailure} size="swap" submit>
        {MESSAGE.Result.Button.FAILURE}
      </Button>
    ),
  }[status]

  return (
    <SwapCard icon={icon} title={title} lg>
      <section className={styles.contents}>{content}</section>
      <footer>{button}</footer>
    </SwapCard>
  )
}

export default Result
