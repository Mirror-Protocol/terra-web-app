import { useEffect, useRef, useState } from "react"
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
import { AxiosError } from "axios"

import { useMemo } from "react"
import {
  createActionRuleSet,
  createLogMatcherForActions,
  getTxCanonicalMsgs,
} from "@terra-money/log-finder-ruleset"
import { SwapTxInfo as ISwapTxInfo } from "types/swapTx"
import { TxInfo } from "@terra-money/terra.js"
import { TxDescription } from "@terra-money/react-base-components"
import { useLCDClient } from "@terra-money/wallet-provider"
export interface ResultProps {
  response?: TxResult
  error?:
    | UserDenied
    | CreateTxFailed
    | TxFailed
    | TxUnspecifiedError
    | AxiosError
    | Error
  onFailure: () => void
  parserKey: string
}

const cx = classNames.bind(styles)

enum STATUS {
  SUCCESS = "success",
  LOADING = "loading",
  FAILURE = "failure",
  TIMEOUT = "timeout",
}

const Result = ({ response, error, onFailure, parserKey }: ResultProps) => {
  const network = useNetwork()
  const { config } = useLCDClient()

  const txHash = response?.result?.txhash ?? ""
  const raw_log = response?.result?.raw_log ?? ""
  /* polling */
  const [txInfo, setTxInfo] = useState<ISwapTxInfo>()

  const matchedMsg = useMemo(() => {
    if (!txInfo || !network?.name) {
      return undefined
    }
    const actionRules = createActionRuleSet(network?.name)
    const logMatcher = createLogMatcherForActions(actionRules)
    return getTxCanonicalMsgs(txInfo as unknown as TxInfo, logMatcher)
  }, [network, txInfo])

  const [status, setStatus] = useState<STATUS>(STATUS.LOADING)
  const { fcd } = useNetwork()

  const retryCount = useRef(0)

  useEffect(() => {
    let isDestroyed = false
    const load = async () => {
      if (isDestroyed) {
        return
      }
      if (retryCount.current >= MAX_TX_POLLING_RETRY) {
        setStatus(STATUS.TIMEOUT)
        return
      }
      if (!txHash) {
        setStatus(STATUS.FAILURE)
        return
      }
      try {
        const { data: res } = await axios.get(`${fcd}/v1/tx/${txHash}`, {
          cache: { ignoreCache: true },
        })
        if (isDestroyed) {
          return
        }
        if (res?.code) {
          setTxInfo(res)
          setStatus(STATUS.FAILURE)
          return
        }
        if (res?.txhash) {
          setTxInfo(res)
          setStatus(STATUS.SUCCESS)
          return
        }
        throw new Error("Unknown")
      } catch (error) {
        retryCount.current += 1
        setTimeout(() => {
          load()
        }, TX_POLLING_INTERVAL)
      }
    }
    load()

    return () => {
      isDestroyed = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* render */
  const name = {
    [STATUS.SUCCESS]: "check_circle_outline",
    [STATUS.LOADING]: "",
    [STATUS.FAILURE]: "highlight_off",
    [STATUS.TIMEOUT]: "highlight_off",
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
    [STATUS.TIMEOUT]: (
      <span className={styles.failure}>{MESSAGE.Result.FAILURE}</span>
    ),
  }[status]

  const message =
    raw_log ||
    (error as AxiosError)?.response?.data?.message ||
    error?.message ||
    (error instanceof UserDenied && MESSAGE.Result.DENIED) ||
    JSON.stringify(error)

  const content = {
    [STATUS.SUCCESS]: txInfo && (
      <>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div>
            {response?.msgs?.map((_, index) => {
              const msgInfo = matchedMsg?.[index]

              return (
                <>
                  {msgInfo
                    ?.filter((msg) => !!msg?.transformed?.canonicalMsg)
                    .map((msg) =>
                      msg?.transformed?.canonicalMsg?.map((str) => (
                        <div style={{ color: "#5c5c5c", fontSize: 18 }}>
                          <TxDescription
                            network={{ ...config, name: network?.name }}
                            config={{ printCoins: 3 }}
                          >
                            {str}
                          </TxDescription>
                        </div>
                      ))
                    )}
                  <br />
                </>
              )
            })}
          </div>
        </div>
        <SwapTxInfo txInfo={txInfo} parserKey={parserKey} />
      </>
    ),
    [STATUS.LOADING]: (
      <div>
        <Loading className={styles.progress} color="#0222ba" size={48} />
        <br />
        <br />
        <p className={styles.hash}>
          <SwapTxHash>{txHash}</SwapTxHash>
        </p>
      </div>
    ),
    [STATUS.FAILURE]: (
      <>
        {txInfo && <SwapTxInfo txInfo={txInfo} parserKey={parserKey} />}
        <p className={styles.feedback}>{txInfo?.raw_log || message}</p>
      </>
    ),
    [STATUS.TIMEOUT]: (
      <>
        {txInfo && <SwapTxInfo txInfo={txInfo} parserKey={parserKey} />}
        <p className={styles.feedback}>{MESSAGE.Result.TIMEOUT}</p>
        <p className={styles.hash}>
          <SwapTxHash>{txHash}</SwapTxHash>
        </p>
      </>
    ),
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
    [STATUS.TIMEOUT]: (
      <Button onClick={() => window.location.reload()} size="swap" submit>
        Done
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
