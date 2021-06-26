import React, { useEffect, useRef, useState } from "react"
import classNames from "classnames/bind"

import { MAX_TX_POLLING_RETRY, TX_POLLING_INTERVAL } from "constants/constants"
import MESSAGE from "lang/MESSAGE.json"
import { useNetwork } from "hooks"

import SwapCard from "components/SwapCard"
import Icon from "components/Icon"
import Loading from "components/Loading"
import Button from "components/Button"
import SwapTxHash from "./SwapTxHash"
import SwapTxInfo from "./SwapTxInfo"
import styles from "./Result.module.scss"
import {
  CreateTxFailed,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  UserDenied,
} from "@terra-dev/wallet-types"
import axios from "rest/request"

export interface ResultProps {
  response?: TxResult
  error?: UserDenied | CreateTxFailed | TxFailed | TxUnspecifiedError
  onFailure: () => void
  parserKey: string
}

const cx = classNames.bind(styles)

enum STATUS {
  SUCCESS = "success",
  LOADING = "loading",
  FAILURE = "failure",
}

const Result = ({ response, error, onFailure, parserKey }: ResultProps) => {
  const txHash = response?.result.txhash ?? ""
  const raw_log = response?.result.raw_log ?? ""
  /* polling */
  const [txInfo, setTxInfo] = useState<SwapTxInfo>()

  const [status, setStatus] = useState<STATUS>(STATUS.LOADING)
  const { fcd } = useNetwork()

  const retryCount = useRef(0)

  useEffect(() => {
    const load = async () => {
      if (!txHash) {
        setStatus(STATUS.FAILURE)
        return
      }
      try {
        const { data: res } = await axios.get(`${fcd}/txs/${txHash}`)
        if (res?.txhash) {
          setTxInfo(res)
          setStatus(STATUS.SUCCESS)
        }
      } catch (error) {
        if (retryCount.current >= MAX_TX_POLLING_RETRY) {
          setStatus(STATUS.FAILURE)
          retryCount.current = 0
          return
        }
        retryCount.current += 1
        setTimeout(() => {
          load()
        }, TX_POLLING_INTERVAL)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    raw_log ??
    error?.message ??
    (error instanceof UserDenied && MESSAGE.Result.DENIED)

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
          <SwapTxHash>{txHash}</SwapTxHash>
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
