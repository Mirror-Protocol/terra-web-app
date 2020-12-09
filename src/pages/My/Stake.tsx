import { LP, MIR, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { gt, times } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import getLpName from "../../libs/getLpName"
import { getPath, MenuKey } from "../../routes"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import useDashboard from "../../statistics/useDashboard"
import useAssetStats from "../../statistics/useAssetStats"

import Card from "../../components/Card"
import Table from "../../components/Table"
import Dl from "../../components/Dl"
import LinkButton from "../../components/LinkButton"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { menu as stakeMenu, MenuKey as StakeMenuKey, Type } from "../Stake"
import NoAssets from "./NoAssets"

const Stake = () => {
  const priceKey = PriceKey.PAIR
  const keys = [
    priceKey,
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
  const { listedAll, whitelist, getToken } = useContractsAddress()
  const { result, find, rewards } = useContract()
  const loading = keys.some((key) => result[key].loading)

  /* table */
  const mir = getToken(MIR)
  const dataSource: (ListedItem & { gov?: boolean })[] = !data
    ? []
    : [
        ...insertIf(gt(find(BalanceKey.MIRGOVSTAKED, mir), 0), {
          ...whitelist[mir],
          gov: true,
        }),
        ...listedAll.filter(({ token }) =>
          [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE].some((key) =>
            gt(find(key, token), 0)
          )
        ),
      ]

  /* render */
  const claimAll = {
    to: getPath(MenuKey.STAKE) + stakeMenu[StakeMenuKey.CLAIMALL].path,
    className: "desktop",
    children: StakeMenuKey.CLAIMALL,
    disabled: !gt(rewards, 0),
    color: "aqua",
    size: "sm" as const,
    outline: true,
  }

  const dataExists = !!dataSource.length

  const price = find(priceKey, mir)
  const totalRewardValue = times(rewards, price)
  const description = dataExists && (
    <Dl
      list={[
        {
          title: "Total Reward",
          content: formatAsset(rewards, MIR),
        },
        {
          title: "Total Reward Value",
          content: formatAsset(totalRewardValue, UUSD),
        },
      ]}
    />
  )

  return (
    <Card
      title={<TooltipIcon content={Tooltip.My.Stake}>Stake</TooltipIcon>}
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
              render: (symbol, { status, gov }) => (
                <>
                  {status === "DELISTED" && <Delisted />}
                  {!gov ? getLpName(symbol) : `${symbol} (${MenuKey.GOV})`}
                </>
              ),
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
              dataIndex: "token",
              title: (
                <TooltipIcon content={Tooltip.My.Staked}>Staked</TooltipIcon>
              ),
              render: (token, { gov }) =>
                formatAsset(
                  find(
                    !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED,
                    token
                  ),
                  !gov ? LP : MIR
                ),
              align: "right",
            },
            {
              key: "stakable",
              dataIndex: "token",
              render: (token, { gov }) =>
                formatAsset(
                  find(!gov ? BalanceKey.LPSTAKABLE : BalanceKey.TOKEN, token),
                  !gov ? LP : MIR
                ),
              align: "right",
            },
            {
              key: "reward",
              dataIndex: "token",
              title: (
                <TooltipIcon content={Tooltip.My.Reward}>Reward</TooltipIcon>
              ),
              render: (token, { gov }) =>
                !gov ? (
                  formatAsset(find(BalanceKey.REWARD, token), MIR)
                ) : (
                  <TooltipIcon content={Tooltip.My.GovReward}>-</TooltipIcon>
                ),
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "token",
              render: (token, { gov }) => {
                const edit = !gov
                  ? `${getPath(MenuKey.STAKE)}/${token}`
                  : `${getPath(MenuKey.GOV)}/stake`

                const claim = !gov
                  ? `${getPath(MenuKey.STAKE)}/${token}/claim`
                  : ``

                const list = [
                  {
                    to: { pathname: edit, hash: Type.STAKE },
                    children: Type.STAKE,
                    disabled: !gt(
                      find(
                        !gov ? BalanceKey.LPSTAKABLE : BalanceKey.TOKEN,
                        token
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
                        token
                      ),
                      0
                    ),
                  },
                  {
                    to: claim,
                    children: StakeMenuKey.CLAIMSYMBOL,
                    disabled: !gov
                      ? !gt(find(BalanceKey.REWARD, token), 0)
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

export default Stake
