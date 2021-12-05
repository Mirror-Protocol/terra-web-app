import Chart from "components/Chart"
import Card from "components/Card"
import React, { useState } from "react"
import styled from "styled-components"
import { Link, useParams } from "react-router-dom"

import Summary from "./Summary"
import useDashboardAPI from "rest/useDashboardAPI"
import { decimal, formatMoney, lookup } from "libs/parse"
import { UST } from "constants/constants"
import Table from "components/Table"
import { useQuery } from "react-query"

import { ReactComponent as IconGoBack } from "images/icon-go-back.svg"
import AssetIcon from "components/AssetIcon"
import { tokenInfos } from "rest/usePairs"
import moment from "moment"
import { useNetwork } from "hooks"
import { Container, Row } from "pages/Dashboard"

const Wrapper = styled.div`
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

  const { data: recent } = useQuery("recent", async () => {
    const res = await api.terraswap.getRecent()
    return res?.daily
  })
  const { data: pair } = useQuery(`pair-${address}`, () =>
    api.pairs.findOne(address)
  )
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery(
    "transactions",
    async () => {
      const res = await api.txs.list({ pairAddress: address, page: 1 })
      return res?.txs || []
    }
  )
  const [searchKeyword, setSearchKeyword] = useState("")

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
          <Link to="/dashboard" style={{ lineHeight: "1", fontSize: 0 }}>
            <IconGoBack height={30} />
          </Link>
          <div>
            <AssetIcon
              address={pair?.token0?.tokenAddress || ""}
              style={{ width: 30, height: 30 }}
            />
            <AssetIcon
              address={pair?.token1?.tokenAddress || ""}
              style={{ width: 30, height: 30, left: -16, marginRight: -16 }}
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
          </div>
        </div>
        <Summary
          data={[
            {
              label: "Volume 24H",
              value: recent?.volume ? `${lookup(recent?.volume, UST)}` : "",
              variation: parseFloat(
                (parseFloat(recent?.volumeIncreasedRate || "0") * 100).toFixed(
                  2
                )
              ),
            },
            {
              label: "Liquidity 24H",
              value: recent?.liquidity
                ? `${lookup(recent?.liquidity, UST)}`
                : "",
              variation: parseFloat(
                (
                  parseFloat(recent?.liquidityIncreasedRate || "0") * 100
                ).toFixed(2)
              ),
            },
            {
              label: "Fee 24H",
              value: recent?.fee ? `${lookup(recent?.fee, UST)}` : "",
              variation: parseFloat(
                (parseFloat(recent?.feeIncreasedRate || "0") * 100).toFixed(2)
              ),
            },
          ]}
        />
        <Row>
          <Card>
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
                  <Row>
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
                <div>{pair?.token0?.tokenAddress}</div>
              </div>
            </div>
          </Card>

          <Card>
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
                  <Row>
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
                <div>{pair?.token1?.tokenAddress}</div>
              </div>
            </div>
          </Card>
        </Row>
        <Row>
          <Card>
            <div style={{ marginBottom: 10 }}>
              <b>Transaction Volume</b>
            </div>
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
          <Card>
            <div style={{ marginBottom: 10 }}>
              <b>Total Liquidity</b>
            </div>
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
                <b>Recent transactions</b>
              </div>
              <div style={{ textAlign: "right" }}>
                <input
                  type="search"
                  inputMode="search"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearchKeyword(e?.target?.value || "")
                  }}
                />
              </div>
            </Row>
            <Row>
              <Table
                isLoading={isTransactionsLoading}
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
                              left: -10,
                              marginRight: -10,
                            }}
                          />
                        </div>
                        {({
                          swap: "Swap",
                          provide_liquidity: "Provide",
                          withdraw_liquidity: "Withdraw",
                        } as any)[value as string] || value}
                        &nbsp;
                        {pair?.token1?.symbol} for {pair?.token0?.symbol}
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
                    Cell: ({ cell: { value } }: any) => (
                      <span>
                        {formatMoney(
                          Number(
                            decimal(
                              `${value}`,
                              tokenInfos.get(pair?.token0?.tokenAddress || "")
                                ?.decimals
                            )
                          )
                        )}
                        &nbsp;
                        {pair?.token0?.symbol}
                      </span>
                    ),
                  },
                  {
                    accessor: "token1Amount",
                    Header: "Amount(to)",
                    Cell: ({ cell: { value } }: any) => (
                      <span>
                        {formatMoney(
                          Number(
                            decimal(
                              `${value}`,
                              tokenInfos.get(pair?.token1?.tokenAddress || "")
                                ?.decimals
                            )
                          )
                        )}
                        &nbsp;
                        {pair?.token1?.symbol}
                      </span>
                    ),
                  },
                  {
                    accessor: "txHash",
                    Header: "txHash",
                    Cell: ({ cell: { value } }: any) => (
                      <span>
                        {`${value}`.substr(0, 5)}...{`${value}`.substr(-5)}
                      </span>
                    ),
                  },
                  {
                    accessor: "timestamp",
                    Header: "timestamp",
                    Cell: ({ cell: { value } }: any) => (
                      <span>{moment(value).fromNow()}</span>
                    ),
                  },
                ]}
                data={transactions || []}
                onRowClick={(row) => {
                  if (row?.original?.txHash) {
                    window.open(finder(row?.original?.txHash, "tx"))
                  }
                }}
                searchKeyword={searchKeyword}
              />
            </Row>
          </Card>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default PairPage
