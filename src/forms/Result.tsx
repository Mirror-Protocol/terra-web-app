import React, { useEffect } from "react"
import { useLazyQuery } from "@apollo/client"
import classNames from "classnames/bind"

import { TX_POLLING_INTERVAL } from "../constants"
import { TXINFOS } from "../graphql/gqldocs"
import { PostResponse } from "../terra/extension"
import MESSAGE from "../lang/MESSAGE.json"
import { truncate } from "../libs/text"
import { useNetwork, useResult } from "../hooks"

import Card from "../components/Card"
import Icon from "../components/Icon"
import Loading from "../components/Loading"
import Button from "../components/Button"
import LinkButton from "../components/LinkButton"
import ExtLink from "../components/ExtLink"

import { getPath, MenuKey } from "../routes"
import ResultContents from "./ResultContents"
import ConfirmDetails from "./ConfirmDetails"
import styles from "./Result.module.scss"

interface Props extends PostResponse {
  parserKey: string
  onFailure: () => void
}

const cx = classNames.bind(styles)

const Result = ({ success, result, error, parserKey, onFailure }: Props) => {
  const { txhash: hash = "" } = result ?? {}

  /* context */
  const { finder } = useNetwork()
  const { uusd } = useResult()
  const { refetch } = uusd

  /* polling */
  const variables = { hash }
  const [load, tx] = useLazyQuery<{ TxInfos: TxInfo[] }>(TXINFOS, { variables })

  const { data, startPolling, stopPolling } = tx
  const logs = data?.TxInfos[0]?.Logs
  const loading = tx.loading || (hash && !logs?.length)

  // TODO
  // 1. When there is no response for 20 seconds
  // 2. User denied
  const timeout = false

  useEffect(() => {
    success && hash && load()
  }, [success, hash, load])

  useEffect(() => {
    if (loading) {
      startPolling?.(TX_POLLING_INTERVAL)
    } else {
      stopPolling?.()
      refetch?.()
    }
  }, [loading, startPolling, stopPolling, refetch])

  /* verbose */
  const verbose = logs ? JSON.stringify(logs, null, 2) : undefined
  useEffect(() => {
    const log = () => {
      console.groupCollapsed("Logs")
      console.info(verbose)
      console.groupEnd()
    }

    verbose && log()
  }, [verbose])

  /* render */
  const failed = !success || timeout
  const name = failed ? "highlight_off" : loading ? "" : "check_circle_outline"
  const icon = loading ? (
    <Loading size={40} />
  ) : (
    name && (
      <Icon
        name={name}
        className={cx({ failed, loading, success })}
        size={50}
      />
    )
  )

  const title = failed
    ? MESSAGE.Result.FAILURE
    : loading
    ? MESSAGE.Result.LOADING
    : MESSAGE.Result.SUCCESS

  const message =
    result?.raw_log ??
    error?.message ??
    (error?.code === 1 && MESSAGE.Result.DENIED)

  return (
    <Card icon={icon} title={title} lg>
      <section className={styles.contents}>
        {!success ? (
          <p className={styles.feedback}>{message}</p>
        ) : (
          <>
            {logs?.map((log, index) => {
              const results = log.Events.find(
                ({ Type }) => Type === "from_contract"
              )?.Attributes

              return (
                results && (
                  <ResultContents
                    parserKey={parserKey}
                    results={results}
                    key={index}
                  />
                )
              )
            })}

            <ConfirmDetails
              contents={[
                {
                  title: "Tx Hash",
                  content: (
                    <ExtLink href={finder(hash, "tx")} className={styles.link}>
                      {truncate(hash)}
                    </ExtLink>
                  ),
                },
              ]}
              result={!failed && !loading}
            />
          </>
        )}
      </section>

      {!loading && (
        <footer>
          {failed ? (
            <Button onClick={onFailure} size="lg" submit>
              {MESSAGE.Result.Button.Failed}
            </Button>
          ) : (
            <LinkButton to={getPath(MenuKey.MY)} size="lg" submit>
              {MESSAGE.Result.Button.SUCCESS}
            </LinkButton>
          )}
        </footer>
      )}
    </Card>
  )
}

export default Result
