import Chart from "components/Chart"
import Card from "components/Card"
import React, { useMemo } from "react"
import styled from "styled-components"
import { Link, useParams } from "react-router-dom"

import Summary from "./Summary"
import useDashboardAPI, { Transaction } from "rest/useDashboardAPI"
import { formatMoney, lookup } from "libs/parse"
import { UST } from "constants/constants"
import Table from "components/Table"
import container from "components/Container"

import { useQuery } from "react-query"

import { ReactComponent as IconGoBack } from "images/icon-go-back.svg"
import AssetIcon from "components/AssetIcon"
import moment from "moment"
import { useNetwork } from "hooks"
import { Container, Row } from "pages/Dashboard"
import Copy from "components/Copy"

const Wrapper = styled(container)`
  width: 100%;
  height: auto;
  position: relative;
  color: ${({ theme }) => theme.primary};

  & input {
    text-align: center;
    padding: 6px 16px 5px;
    border-radius: 8px;
    border: solid 1px ${({ theme }) => theme.primary};
  }
`

const PairPage = () => {
  const { address } = useParams<{ address: string }>()
  const { api } = useDashboardAPI()
  const { finder } = useNetwork()

  const { data: recent } = useQuery(`recent-${address}`, () =>
    api.pairs.getRecent(address)
  )
  const { data: pair } = useQuery(`pair-${address}`, () =>
    api.pairs.findOne(address)
  )
  const {
    data: transactionData,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionFetching,
  } = useQuery(
    `transactions-${address}`,
    () => api.txs.list({ pairAddress: address, page: 1 }),
    { keepPreviousData: true }
  )

  const { txs: transactions } = useMemo(() => {
    return transactionData || { txs: [], totalCount: 0 }
  }, [transactionData])

  return (
    <Wrapper>
      <Container>
        <div
          style={{
            color: "#ffffff",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Link to="/" style={{ lineHeight: "1", fontSize: 0 }}>
            <IconGoBack height={30} />
          </Link>
          <div>
            <AssetIcon
              address={pair?.token0?.tokenAddress || ""}
              style={{ width: 30, height: 30 }}
            />
            <AssetIcon
              address={pair?.token1?.tokenAddress || ""}
              style={{ width: 30, height: 30, left: -10, marginRight: -10 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, lineHeight: "1" }}>
              {pair?.token0?.symbol}-{pair?.token1?.symbol}
            </div>
            <div className="desktop-only">{pair?.pairAddress}</div>
            <Copy value={pair?.pairAddress} />
          </div>
        </div>
        <Summary
          data={[
            {
              label: "Volume 24H",
              value: recent?.daily?.volume
                ? `${lookup(recent?.daily?.volume, UST)}`
                : "",
              variation: parseFloat(
                (
                  parseFloat(recent?.daily?.volumeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),
            },
            {
              label: "Volume 7D",
              value: recent?.weekly?.volume
                ? `${lookup(recent?.weekly?.volume, UST)}`
                : "",
              variation: parseFloat(
                (
                  parseFloat(recent?.weekly?.volumeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),
            },
            {
              label: "Fee 24H",
              value: recent?.daily?.fee
                ? `${lookup(recent?.daily?.fee, UST)}`
                : "",
              variation: parseFloat(
                (
                  parseFloat(recent?.daily?.feeIncreasedRate || "0") * 100
                ).toFixed(2)
              ),
            },
            {
              label: "TVL",
              value: recent?.daily?.liquidity
                ? `${lookup(recent?.daily?.liquidity, UST)}`
                : "",
              variation: parseFloat(
                (
                  parseFloat(recent?.daily?.liquidityIncreasedRate || "0") * 100
                ).toFixed(2)
              ),
            },
          ]}
        />
        <Row>
          <Card className="left">
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <AssetIcon
                  address={pair?.token0?.tokenAddress}
                  style={{ width: 40, height: 40 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div>
                  <Row style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>
                        {pair?.token0?.symbol}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 14 }}>
                        1 {pair?.token0?.symbol} ≈{" "}
                        {Number(pair?.token0?.price).toFixed(2)}{" "}
                        {pair?.token1?.symbol}
                      </span>
                    </div>
                  </Row>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 1,
                    position: "relative",
                    backgroundColor: "#e8e8e8",
                    marginTop: 10,
                    marginBottom: 8,
                  }}
                />
                <div style={{ whiteSpace: "normal", wordBreak: "break-all" }}>
                  {pair?.token0?.tokenAddress}&nbsp;
                  <Copy light size={22} value={pair?.token0?.tokenAddress} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="right">
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <AssetIcon
                  address={pair?.token1?.tokenAddress}
                  style={{ width: 40, height: 40 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div>
                  <Row style={{ display: "flex" }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>
                        {pair?.token1?.symbol}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 14 }}>
                        1 {pair?.token1?.symbol} ≈{" "}
                        {Number(pair?.token1?.price).toFixed(2)}{" "}
                        {pair?.token0?.symbol}
                      </span>
                    </div>
                  </Row>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 1,
                    position: "relative",
                    backgroundColor: "#e8e8e8",
                    marginTop: 10,
                    marginBottom: 8,
                  }}
                />
                <div style={{ whiteSpace: "normal", wordBreak: "break-all" }}>
                  {pair?.token1?.tokenAddress}&nbsp;
                  <Copy light size={22} value={pair?.token1?.tokenAddress} />
                </div>
              </div>
            </div>
          </Card>
        </Row>
        <Row>
          <Card className="left">
            <div style={{ marginBottom: 10 }}>
              <b>Transaction Volume</b>
            </div>
            <br />
            <Chart
              type="line"
              data={pair?.volumes?.map((volume) => {
                return {
                  t: new Date(volume.timestamp),
                  y: Number(lookup(volume.volume, UST)),
                }
              })}
            />
          </Card>
          <Card className="right">
            <div style={{ marginBottom: 10 }}>
              <b>Total Liquidity</b>
            </div>
            <br />
            <Chart
              type="line"
              data={pair?.liquidities?.map((volume) => {
                return {
                  t: new Date(volume.timestamp),
                  y: Number(lookup(volume.liquidity, UST)),
                }
              })}
            />
          </Card>
        </Row>
        <Row>
          <Card>
            <Row style={{ marginBottom: 10 }}>
              <div>
                <b>Recent Transactions</b>
              </div>
            </Row>
            <Row>
              <Table
                isLoading={isTransactionsLoading || isTransactionFetching}
                rowStyle={{ height: 80 }}
                headerRowStyle={{ height: "auto" }}
                cellStyle={{ minHeight: 80 }}
                // wrapperStyle={{ tableLayout: "fixed" }}
                columns={[
                  {
                    accessor: "action",
                    Header: "Action",
                    Cell: ({ cell: { value } }: any) => (
                      <span>
                        <div style={{ display: "inline-block" }}>
                          <AssetIcon
                            address={pair?.token0?.tokenAddress || ""}
                            style={{ width: 20, height: 20 }}
                          />
                          <AssetIcon
                            address={pair?.token1?.tokenAddress || ""}
                            style={{
                              width: 20,
                              height: 20,
                              left: -8,
                              marginRight: -8,
                            }}
                          />
                        </div>
                        &nbsp;
                        {({
                          swap: "Swap",
                          provide_liquidity: "Provide",
                          withdraw_liquidity: "Withdraw",
                        } as any)[value as string] || value}
                      </span>
                    ),
                  },
                  // {
                  //   accessor: "pairAddress",
                  //   Header: "pairAddress",
                  // },
                  {
                    accessor: "token0Amount",
                    Header: "Amount(from)",
                    Cell: ({ row }: any) => {
                      const tx: Transaction = row?.original
                      if (tx.action === "provide_liquidity") {
                        return (
                          <>
                            <span>
                              {formatMoney(
                                Number(
                                  lookup(
                                    `${Math.abs(Number(tx.token1Amount))}`,
                                    pair?.token1?.tokenAddress
                                  )
                                )
                              )}
                              &nbsp;
                              {pair?.token1?.symbol}
                            </span>
                            <br />
                            <span>
                              {formatMoney(
                                Number(
                                  lookup(
                                    `${Math.abs(Number(tx.token0Amount))}`,
                                    pair?.token0?.tokenAddress
                                  )
                                )
                              )}
                              &nbsp;
                              {pair?.token0?.symbol}
                            </span>
                          </>
                        )
                      }
                      if (tx.action === "withdraw_liquidity") {
                        return <span>-</span>
                      }
                      if (Number(tx.token0Amount) < 0) {
                        return (
                          <span>
                            {formatMoney(
                              Number(
                                lookup(
                                  `${Math.abs(Number(tx.token1Amount))}`,
                                  pair?.token1?.tokenAddress
                                )
                              )
                            )}
                            &nbsp;
                            {pair?.token1?.symbol}
                          </span>
                        )
                      }
                      return (
                        <span>
                          {formatMoney(
                            Number(
                              lookup(
                                `${Math.abs(Number(tx.token0Amount))}`,
                                pair?.token0?.tokenAddress
                              )
                            )
                          )}
                          &nbsp;
                          {pair?.token0?.symbol}
                        </span>
                      )
                    },
                  },
                  {
                    accessor: "token1Amount",
                    Header: "Amount(to)",
                    Cell: ({ row }: any) => {
                      const tx: Transaction = row?.original
                      if (tx.action === "withdraw_liquidity") {
                        return (
                          <>
                            <span>
                              {formatMoney(
                                Number(
                                  lookup(
                                    `${Math.abs(Number(tx.token1Amount))}`,
                                    pair?.token1?.tokenAddress
                                  )
                                )
                              )}
                              &nbsp;
                              {pair?.token1?.symbol}
                            </span>
                            <br />
                            <span>
                              {formatMoney(
                                Number(
                                  lookup(
                                    `${Math.abs(Number(tx.token0Amount))}`,
                                    pair?.token0?.tokenAddress
                                  )
                                )
                              )}
                              &nbsp;
                              {pair?.token0?.symbol}
                            </span>
                          </>
                        )
                      }
                      if (tx.action === "provide_liquidity") {
                        return <span>-</span>
                      }
                      if (Number(tx.token0Amount) < 0) {
                        return (
                          <span>
                            {formatMoney(
                              Number(
                                lookup(
                                  `${Math.abs(Number(tx.token0Amount))}`,
                                  pair?.token0?.tokenAddress
                                )
                              )
                            )}
                            &nbsp;
                            {pair?.token0?.symbol}
                          </span>
                        )
                      }
                      return (
                        <span>
                          {formatMoney(
                            Number(
                              lookup(
                                `${Math.abs(Number(tx.token1Amount))}`,
                                pair?.token1?.tokenAddress
                              )
                            )
                          )}
                          &nbsp;
                          {pair?.token1?.symbol}
                        </span>
                      )
                    },
                  },
                  {
                    accessor: "txHash",
                    Header: "Transaction Hash",
                    Cell: ({ cell: { value } }: any) => (
                      <a
                        href={finder(value, "tx")}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${value}`.substr(0, 10)}...{`${value}`.substr(-10)}
                      </a>
                    ),
                  },
                  {
                    accessor: "timestamp",
                    Header: "Time",
                    width: 105,
                    Cell: ({ cell: { value } }: any) => (
                      <span>{moment(value).fromNow()}</span>
                    ),
                  },
                ]}
                data={transactions || []}
                initialState={{
                  pageSize: 10,
                }}
                // pageCount={Math.floor(transactionCount / 50) + 1}
                // onFetchData={(state) => {
                //   setCurrentTransactionPage(state.pageIndex + 1);
                // }}
                // manualPagination
              />
            </Row>
          </Card>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default PairPage
