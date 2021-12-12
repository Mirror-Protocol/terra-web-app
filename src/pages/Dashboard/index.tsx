import Chart from "components/Chart"
import Card from "components/Card"
import List from "components/List"
import React, { useState, useMemo } from "react"
import styled from "styled-components"
import { useQuery } from "react-query"

import Summary from "./Summary"
import useDashboardAPI from "rest/useDashboardAPI"
import { formatMoney, lookup } from "libs/parse"
import { UST } from "constants/constants"
import Table from "components/Table"
import { Link, useHistory } from "react-router-dom"
import AssetIcon from "components/AssetIcon"
import { div } from "libs/math"

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
  align-items: flex-start;
  gap: 20px;

  & > div {
    flex: 1;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    gap: unset;

    & > div {
      flex: unset;
      margin-bottom: 10px;
    }
  }
`

const Dashboard = () => {
  const history = useHistory()
  const { api } = useDashboardAPI()
  const { data: recent } = useQuery("recent", async () => {
    const res = await api.terraswap.getRecent()
    return res?.daily
  })
  const { data: pairs, isLoading: isPairsLoading } = useQuery(
    "pairs",
    api.pairs.list
  )
  const [searchKeyword, setSearchKeyword] = useState("")

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

  return (
    <Wrapper>
      <Container>
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
                style={{ display: "inline-block", width: 160, height: 160 }}
              >
                <Chart
                  type="pie"
                  labels={topLiquidity?.map((item) => item.pairAlias)}
                  data={topLiquidity?.map((item) => Number(item.liquidityUst))}
                />
              </div>
              <div>
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
          <Card>
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
                style={{ display: "inline-block", width: 160, height: 160 }}
              >
                <Chart
                  type="pie"
                  labels={topTrading?.map((item) => item.pairAlias)}
                  data={topTrading?.map((item) => Number(item.volumeUst))}
                />
              </div>
              <div>
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
          <Card>
            <Row style={{ marginBottom: 10 }}>
              <div>
                <b>Pairs</b>
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
                isLoading={isPairsLoading}
                columns={[
                  {
                    accessor: "pairAlias",
                    Header: "Pairs",
                    Cell: (data: any) => {
                      const { original } = data?.row
                      if (!original) {
                        return ""
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
                          <span>{pairAlias}</span>
                        </>
                      )
                    },
                  },
                  {
                    accessor: "liquidityUst",
                    Header: "Liquidity",
                    Cell: ({ cell: { value } }: any) => (
                      <span>
                        {formatMoney(Number(lookup(`${value}`, UST)))} UST
                      </span>
                    ),
                  },
                  {
                    accessor: "volumeUst",
                    Header: "Volume(24h)",
                    Cell: ({ cell: { value } }: any) => (
                      <span>
                        {formatMoney(Number(lookup(`${value}`, UST)))} UST
                      </span>
                    ),
                  },
                  {
                    accessor: "apr",
                    Header: "Commission",
                    Cell: ({ cell: { value } }: any) => (
                      <span>{(Number(value) * 100).toFixed(2)}%</span>
                    ),
                  },
                ]}
                data={pairs || []}
                onRowClick={(row) =>
                  history.push(`/pairs/${row.original.pairAddress}`)
                }
                searchKeyword={searchKeyword}
              />
            </Row>
          </Card>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Dashboard
