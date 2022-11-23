import React, { useState, useMemo, ReactElement, useEffect } from "react"
import styled from "styled-components"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

import useDashboardAPI from "rest/useDashboardAPI"
import { formatMoney, lookup } from "libs/parse"
import { UST } from "constants/constants"

import Chart from "components/Chart"
import Card from "components/Card"
import List from "components/List"
import Input from "components/Input"
import Table from "components/Table"
import AssetIcon from "components/AssetIcon"
import Select from "components/Select"
import container from "components/Container"

import Summary from "./Summary"
import LatestBlock from "components/LatestBlock"
import Tooltip from "components/Tooltip"
import Loading from "components/Loading"
import Modal from "components/Modal"
import Button from "components/Button"

const ModalContent = styled.div`
  width: 100%;
  max-width: calc(100vw - 32px);
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.35);
  background-color: #fff;
  padding: 30px 0px;
  color: #5c5c5c;
  & > div {
    position: relative;
    width: 100%;
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
    padding: 0 30px;

    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #5c5c5c;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    padding: 30px 0px;
    & > div {
      padding: 0 16px;
    }
  }
`

const ModalTitle = styled.div`
  display: block;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: center;
  color: #0222ba;
  margin-bottom: 30px;
`

const Wrapper = styled(container)`
  width: 100%;
  height: auto;
  position: relative;
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary};
  z-index: 1;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Row = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: space-between;

  & > div {
    flex: 1;
  }

  .left {
    width: 1vw;
    float: left;
    margin-right: 10px;
  }
  .right {
    width: 1vw;
    float: right;
    margin-left: 10px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    gap: unset;

    & > div {
      flex: unset;
      margin-bottom: unset;
    }

    .left {
      width: 100%;
      float: left;
      margin: unset;
    }

    .right {
      width: 100%;
      float: left;
      margin-left: 0px;
      margin-top: 20px;
    }
  }
`

const LatestBlockWrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    justify-content: center;
  }
`

const Dashboard = () => {
  const navigate = useNavigate()
  const { api } = useDashboardAPI()
  const { data: recent } = useQuery("recent", api.terraswap.getRecent)
  const { data: pairs, isLoading: isPairsLoading } = useQuery(
    "pairs",
    api.pairs.list
  )
  const { data: chart } = useQuery("terraswap", async () => {
    const now = Date.now()
    const fromDate = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const res = await api.terraswap.getChartData({
      unit: "day",
      from: fromDate.toISOString().split("T")[0],
      to: new Date(now).toISOString().split("T")[0],
    })

    return res
  })
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedVolumeLength, setSelectedVolumeLength] = useState(30)
  const [selectedLiquidityLength, setSelectedLiquidityLength] = useState(30)

  const [tableVisibleFlag, setTableVisibleFlag] = useState(false)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setTableVisibleFlag(true)
    }, 1000)
    return () => {
      clearTimeout(timerId)
    }
  }, [])

  const selectedVolumeChart = useMemo(() => {
    return (chart || []).slice(0, selectedVolumeLength)
  }, [chart, selectedVolumeLength])

  const selectedLiquidityChart = useMemo(() => {
    return (chart || []).slice(0, selectedLiquidityLength)
  }, [chart, selectedLiquidityLength])

  const topLiquidity = useMemo(() => {
    return pairs
      ?.sort((a, b) => Number(b.liquidityUst) - Number(a.liquidityUst))
      .slice(0, 5)
  }, [pairs])

  const topTrading = useMemo(() => {
    return pairs
      ?.sort((a, b) => Number(b.volumeUst) - Number(a.volumeUst))
      .slice(0, 5)
  }, [pairs])

  const restLiquidityUst = useMemo(() => {
    return (
      pairs
        ?.sort((a, b) => Number(b.liquidityUst) - Number(a.liquidityUst))
        .slice(6)
        .reduce((prev, current) => {
          return prev + Number(current.liquidityUst)
        }, 0) || 0
    )
  }, [pairs])

  const restTradingUst = useMemo(() => {
    return (
      pairs
        ?.sort((a, b) => Number(b.volumeUst) - Number(a.volumeUst))
        .slice(6)
        .reduce((prev, current) => {
          return prev + Number(current.volumeUst)
        }, 0) || 0
    )
  }, [pairs])

  return (
    <Wrapper>
      <Container>
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
            <Row
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "unset" }}>
                <b>Transaction Volume</b>
              </div>
              <div style={{ flex: "unset" }}>
                <Select
                  value={selectedVolumeLength}
                  onChange={(e) =>
                    setSelectedVolumeLength(parseInt(e?.target?.value, 10))
                  }
                >
                  {[30, 15, 7].map((value) => (
                    <option key={value} value={value}>
                      {value} days
                    </option>
                  ))}
                </Select>
              </div>
            </Row>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
              {formatMoney(
                Number(
                  lookup(
                    selectedVolumeChart.reduce((prev, current) => {
                      return prev + parseInt(current.volumeUst, 10)
                    }, 0),
                    UST
                  )
                )
              )}
              &nbsp;UST
            </div>
            <Chart
              type="line"
              height={178}
              data={selectedVolumeChart?.map((volume) => {
                return {
                  t: new Date(volume.timestamp),
                  y: Number(lookup(volume.volumeUst, UST)),
                }
              })}
            />
          </Card>
          <Card className="right">
            <div style={{ marginBottom: 10 }}>
              <b>Top Trading</b>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                className="desktop-only"
                style={{
                  display: "inline-block",
                  maxWidth: 208,
                  maxHeight: 208,
                  padding: 16,
                  flex: 1,
                }}
              >
                <Chart
                  type="pie"
                  labels={[
                    ...(topTrading || [])?.map((item) => item.pairAlias),
                    "Rest of pairs",
                  ]}
                  data={[
                    ...(topTrading || [])?.map((item) =>
                      Number(item.volumeUst)
                    ),
                    restTradingUst,
                  ]}
                />
              </div>
              <div style={{ flex: 2 }}>
                <List
                  data={(topTrading || [])?.map((item) => {
                    const {
                      token0,
                      token0Symbol,
                      token1,
                      token1Symbol,
                      volumeUst,
                      pairAddress,
                    } = item
                    return (
                      <Link
                        to={`/pairs/${pairAddress}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          flexWrap: "nowrap",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div>
                          <AssetIcon address={token0} alt={token0Symbol} />
                          <AssetIcon
                            address={token1}
                            alt={token1Symbol}
                            style={{ left: -8 }}
                          />
                        </div>
                        <div>
                          {token0Symbol}-{token1Symbol} /&nbsp;
                          {formatMoney(Number(lookup(volumeUst, UST)))} UST
                        </div>
                      </Link>
                    )
                  })}
                />
              </div>
            </div>
          </Card>
        </Row>
        <Row>
          <Card className="left">
            <Row
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "unset" }}>
                <b>Total Liquidity</b>
              </div>
              <div style={{ flex: "unset" }}>
                <Select
                  value={selectedLiquidityLength}
                  onChange={(e) =>
                    setSelectedLiquidityLength(parseInt(e?.target?.value, 10))
                  }
                >
                  {[30, 15, 7].map((value) => (
                    <option key={value} value={value}>
                      {value} days
                    </option>
                  ))}
                </Select>
              </div>
            </Row>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
              &nbsp;
            </div>
            <Chart
              type="line"
              height={178}
              data={selectedLiquidityChart?.map((liquidity) => {
                return {
                  t: new Date(liquidity.timestamp),
                  y: Number(lookup(liquidity.liquidityUst, UST)),
                }
              })}
            />
          </Card>
          <Card className="right">
            <div style={{ marginBottom: 10 }}>
              <b>Top Liquidity</b>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                className="desktop-only"
                style={{
                  display: "inline-block",
                  maxWidth: 208,
                  maxHeight: 208,
                  padding: 16,
                  flex: 1,
                }}
              >
                <Chart
                  type="pie"
                  labels={[
                    ...(topLiquidity || [])?.map((item) => item.pairAlias),
                    "Rest of pairs",
                  ]}
                  data={[
                    ...(topLiquidity || [])?.map((item) =>
                      Number(item.liquidityUst)
                    ),
                    restLiquidityUst,
                  ]}
                />
              </div>
              <div style={{ flex: 2 }}>
                <List
                  data={(topLiquidity || [])?.map((item) => {
                    const {
                      token0,
                      token0Symbol,
                      token1,
                      token1Symbol,
                      liquidityUst,
                      pairAddress,
                    } = item

                    return (
                      <Link
                        to={`/pairs/${pairAddress}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          flexWrap: "nowrap",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div>
                          <AssetIcon address={token0} alt={token0Symbol} />
                          <AssetIcon
                            address={token1}
                            alt={token1Symbol}
                            style={{ left: -8 }}
                          />
                        </div>
                        <div>
                          {token0Symbol}-{token1Symbol} /&nbsp;
                          {formatMoney(Number(lookup(liquidityUst, UST)))} UST
                        </div>
                      </Link>
                    )
                  })}
                />
              </div>
            </div>
          </Card>
        </Row>
        <Row>
          <Card>
            <Row
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <b>Pairs</b>
              </div>
              <div style={{ textAlign: "right" }}>
                <Input
                  placeholder="Search"
                  onChange={(e) => {
                    setSearchKeyword(e?.target?.value || "")
                  }}
                />
              </div>
            </Row>
            <Row>
              {!tableVisibleFlag && (
                <div
                  style={{
                    height: 240,
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Loading size={36} color="#0222ba" />
                </div>
              )}
              {tableVisibleFlag && (
                <Table
                  isLoading={isPairsLoading}
                  columns={[
                    {
                      accessor: "pairAlias",
                      Header: "Pairs",
                      width: 220,
                      Cell: (data: any): ReactElement<any, any> | null => {
                        const { original } = data?.row
                        if (!original) {
                          return null
                        }
                        const {
                          token0,
                          token0Symbol,
                          token1,
                          token1Symbol,
                          pairAlias,
                        } = original
                        return (
                          <>
                            <AssetIcon address={token0} alt={token0Symbol} />
                            <AssetIcon
                              address={token1}
                              alt={token1Symbol}
                              style={{ left: -8 }}
                            />
                            <span
                              style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                              }}
                            >
                              {pairAlias}
                            </span>
                          </>
                        )
                      },
                    },
                    {
                      accessor: "liquidityUst",
                      Header: "Liquidity",
                      sortDescFirst: true,
                      sortType: (a, b) =>
                        Number(a.original.liquidityUst) >
                        Number(b.original.liquidityUst)
                          ? 1
                          : -1,
                      width: 230,
                      Cell: ({ cell: { value } }: any) => (
                        <span>
                          {formatMoney(Number(lookup(`${value}`, UST)))} UST
                        </span>
                      ),
                    },
                    {
                      accessor: "volumeUst",
                      Header: "Volume (24H)",
                      sortDescFirst: true,
                      sortType: (a, b) =>
                        Number(a.original.volumeUst) >
                        Number(b.original.volumeUst)
                          ? 1
                          : -1,
                      width: 230,
                      Cell: ({ cell: { value } }: any) => (
                        <span>
                          {formatMoney(Number(lookup(`${value}`, UST)))} UST
                        </span>
                      ),
                    },
                    {
                      accessor: "token0Volume",
                      Header: "Fees (24H)",
                      sortDescFirst: true,
                      sortType: (a, b) =>
                        Number(a.original.volumeUst) >
                        Number(b.original.volumeUst)
                          ? 1
                          : -1,
                      width: 180,
                      Cell: (data: any): ReactElement<any, any> | null => {
                        const { original } = data?.row
                        if (!original) {
                          return null
                        }
                        const { volumeUst } = original
                        return (
                          <span>
                            {formatMoney(
                              Number(lookup(`${volumeUst * 0.003}`, UST))
                            )}{" "}
                            UST
                          </span>
                        )
                      },
                    },
                    {
                      accessor: "apr",
                      Header: (
                        <Tooltip
                          content="Commission APR (7D avg)"
                          style={{ display: "inline-flex" }}
                        >
                          APR (7D avg)
                        </Tooltip>
                      ),
                      sortDescFirst: true,
                      sortType: (a, b) =>
                        Number(a.original.apr) > Number(b.original.apr)
                          ? 1
                          : -1,
                      width: 140,
                      Cell: ({ cell: { value } }: any) => (
                        <span>{(Number(value) * 100).toFixed(2)}%</span>
                      ),
                    },
                  ]}
                  data={pairs || []}
                  onRowClick={(row) =>
                    navigate(`/pairs/${row.original.pairAddress}`)
                  }
                  wrapperStyle={{ tableLayout: "fixed" }}
                  searchKeyword={searchKeyword}
                />
              )}
            </Row>
          </Card>
        </Row>
        <LatestBlockWrapper>
          <LatestBlock
            currentHeight={recent?.daily?.height || 0}
            isLoading={!recent?.daily?.height}
          />
        </LatestBlockWrapper>
      </Container>
      <Modal isOpen close={() => {}} open={() => {}}>
        <ModalContent>
          <div>
            <ModalTitle>Under maintenance</ModalTitle>
            <div style={{ marginBottom: 20 }}>
              Terraswap classic dashboard is under maintenance due to the price
              calculation update & historical data recollecting. Apologies for
              any inconvenience.
              <div
                style={{
                  border: "1px solid #eeeeee",
                  borderRadius: 8,
                  padding: 10,
                  marginTop: 10,
                  fontWeight: 400,
                  textAlign: "left",
                }}
              >
                <b>As-is:</b> Mixed (USTC-based & exchange_rate from Terra
                Oracle)
                <br />
                <b>To-Be:</b> Unify to the Oracle base
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => window.location.replace("/")}
              style={{
                textTransform: "unset",
                maxWidth: 235,
                borderRadius: 10,
                marginBottom: 4,
              }}
            >
              Back
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </Wrapper>
  )
}

export default Dashboard
