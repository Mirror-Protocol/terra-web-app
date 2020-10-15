import React from "react"
import { LP, MIR } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { gt } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { getPath, MenuKey } from "../../routes"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import useDashboard from "../../statistics/useDashboard"
import useAssetStats from "../../statistics/useAssetStats"
import Card from "../../components/Card"
import Table from "../../components/Table"
import { Di } from "../../components/Dl"
import LinkButton from "../../components/LinkButton"
import { TooltipIcon } from "../../components/Tooltip"
import { menu as stakeMenu, MenuKey as StakeMenuKey, Type } from "../Stake"
import getLpName from "../Stake/getLpName"
import NoAssets from "./NoAssets"
import DashboardActions from "./DashboardActions"

const Staked = () => {
  const keys = [
    BalanceKey.TOKEN,
    BalanceKey.LPSTAKED,
    BalanceKey.LPSTAKABLE,
    BalanceKey.MIRGOVSTAKED,
    BalanceKey.REWARD,
  ]

  const { data } = useRefetch(keys)
  const { dashboard } = useDashboard()
  const { apr } = useAssetStats()

  /* context */
  const { listed, getListedItem } = useContractsAddress()
  const { result, find, rewards } = useContract()
  const loading = keys.some((key) => result[key].loading)

  /* table */
  const dataSource: (ListedItem & { gov?: boolean })[] = !data
    ? []
    : [
        ...insertIf(gt(find(BalanceKey.MIRGOVSTAKED, MIR), 0), {
          ...getListedItem(MIR),
          gov: true,
        }),
        ...listed.filter(({ symbol }) =>
          [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE].some((key) =>
            gt(find(key, symbol), 0)
          )
        ),
      ]

  /* render */
  const claimAll = {
    to: getPath(MenuKey.STAKE) + stakeMenu[StakeMenuKey.CLAIMALL].path,
    children: StakeMenuKey.CLAIMALL,
    disabled: !gt(rewards, 0),
    color: "aqua",
    size: "sm" as const,
    outline: true,
  }

  const dataExists = !!dataSource.length

  const description = dataExists && (
    <Di title="Total Reward" content={formatAsset(rewards, MIR)} />
  )

  return (
    <Card
      title="Staked"
      action={!loading && <LinkButton {...claimAll} />}
      description={description}
      loading={loading}
    >
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Pool Name",
              render: (symbol, { gov }) =>
                !gov ? getLpName(symbol) : `${symbol} (${MenuKey.GOV})`,
              bold: true,
            },
            {
              key: "apr",
              title: <TooltipIcon content={Tooltip.My.APR}>APR</TooltipIcon>,
              dataIndex: "token",
              render: (token, { gov }) =>
                !gov
                  ? percent(apr[token])
                  : percent(dashboard?.latest24h.govAPR),
              align: "right",
            },
            {
              key: "staked",
              dataIndex: "symbol",
              title: (
                <TooltipIcon content={Tooltip.My.Staked}>Staked</TooltipIcon>
              ),
              render: (symbol, { gov }) =>
                formatAsset(
                  find(
                    !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED,
                    symbol
                  ),
                  !gov ? LP : MIR
                ),
              align: "right",
            },
            {
              key: "stakable",
              dataIndex: "symbol",
              render: (symbol, { gov }) =>
                formatAsset(
                  find(!gov ? BalanceKey.LPSTAKABLE : BalanceKey.TOKEN, symbol),
                  !gov ? LP : MIR
                ),
              align: "right",
            },
            {
              key: "reward",
              dataIndex: "symbol",
              title: (
                <TooltipIcon content={Tooltip.My.Reward}>Reward</TooltipIcon>
              ),
              render: (symbol, { gov }) =>
                !gov && formatAsset(find(BalanceKey.REWARD, symbol), MIR),
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "symbol",
              render: (symbol, { gov }) => {
                const edit = !gov
                  ? `${getPath(MenuKey.STAKE)}/${symbol}`
                  : `${getPath(MenuKey.GOV)}/stake`

                const claim = !gov
                  ? `${getPath(MenuKey.STAKE)}/${symbol}/claim`
                  : ``

                const list = [
                  {
                    to: { pathname: edit, hash: Type.STAKE },
                    children: Type.STAKE,
                    disabled: !gt(
                      find(
                        !gov ? BalanceKey.LPSTAKABLE : BalanceKey.TOKEN,
                        symbol
                      ),
                      0
                    ),
                  },
                  {
                    to: { pathname: edit, hash: Type.UNSTAKE },
                    children: Type.UNSTAKE,
                    disabled: !gt(
                      find(
                        !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED,
                        symbol
                      ),
                      0
                    ),
                  },
                  {
                    to: claim,
                    children: StakeMenuKey.CLAIMSYMBOL,
                    disabled: !gov
                      ? !gt(find(BalanceKey.REWARD, symbol), 0)
                      : false,
                  },
                ]

                return <DashboardActions list={list} />
              },
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
        !loading && (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Staked}
            link={MenuKey.STAKE}
          />
        )
      )}
    </Card>
  )
}

export default Staked
