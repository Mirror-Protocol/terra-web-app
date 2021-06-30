import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { getTxInfosQuery } from "../../data/native/tx"
import Grid, { Gutter } from "../../components/Grid"
import Card from "../../components/Card"
import Page from "../../components/Page"
import Search from "../../components/Search"
import Checkbox from "../../components/Checkbox"
import Boundary from "../../components/Boundary"

import { MintType, PoolType, StakeType, TradeType } from "../../types/Types"
import { concatFromContract } from "../../forms/receipts/receiptHelpers"
import useTradeReceipt from "../../forms/receipts/useTradeReceipt"
import useLimitOrderReceipt from "../../forms/receipts/useLimitOrderReceipt"
import useCancelOrderReceipt from "../../forms/receipts/useCancelOrderReceipt"
import useMintReceipt from "../../forms/receipts/useMintReceipt"
import usePoolReceipt from "../../forms/receipts/usePoolReceipt"
import useStakeReceipt from "../../forms/receipts/useStakeReceipt"
import useGovReceipt from "../../forms/receipts/useGovReceipt"
import useClaimRewardsReceipt from "../../forms/receipts/useClaimRewardsReceipt"
import useClaimUSTReceipt from "../../forms/receipts/useClaimUSTReceipt"
import useBurnReceipt from "../../forms/receipts/useBurnReceipt"
import useSendReceipt from "../../forms/receipts/useSendReceipt"
import TxInfo from "../../forms/modules/TxInfo"

const Receipt = () => {
  const parseTradeBUY = useTradeReceipt(TradeType.BUY)
  const parseTradeSELL = useTradeReceipt(TradeType.SELL)
  const parseLimitOrderBUY = useLimitOrderReceipt(TradeType.BUY)
  const parseLimitOrderSELL = useLimitOrderReceipt(TradeType.SELL)
  const parseCancelOrder = useCancelOrderReceipt()
  const parseMintSHORT = useMintReceipt(MintType.SHORT)
  const parseMintBORROW = useMintReceipt(MintType.BORROW)
  const parseMintEDIT = useMintReceipt(MintType.EDIT)
  const parseMintCLOSE = useMintReceipt(MintType.CLOSE)
  const parsePollPROVIDE = usePoolReceipt(PoolType.PROVIDE)
  const parsePoolWITHDRAW = usePoolReceipt(PoolType.WITHDRAW)
  const parseStakeSTAKE = useStakeReceipt(StakeType.STAKE, false)
  const parseStakeUNSTAKE = useStakeReceipt(StakeType.UNSTAKE, false)
  const parseStakeGOVSTAKE = useStakeReceipt(StakeType.STAKE, true)
  const parseStakeGOVUNSTAKE = useStakeReceipt(StakeType.UNSTAKE, true)
  const parseGov = useGovReceipt()
  const parseClaimRewards = useClaimRewardsReceipt()
  const parseClaimUST = useClaimUSTReceipt()
  const parseBurn = useBurnReceipt()
  const parseSend = useSendReceipt()

  const parsers: Dictionary<ResultParser> = {
    "Trade → BUY": parseTradeBUY,
    "Trade → SELL": parseTradeSELL,
    "Limit Order → BUY": parseLimitOrderBUY,
    "Limit Order → SELL": parseLimitOrderSELL,
    "Cancel Order": parseCancelOrder,
    "Mint → SHORT": parseMintSHORT,
    "Mint → BORROW": parseMintBORROW,
    "Mint → EDIT": parseMintEDIT,
    "Mint → CLOSE": parseMintCLOSE,
    "Poll → PROVIDE": parsePollPROVIDE,
    "Pool → WITHDRAW": parsePoolWITHDRAW,
    "Stake → STAKE ": parseStakeSTAKE,
    "Stake → UNSTAKE ": parseStakeUNSTAKE,
    "Stake → GOVSTAKE": parseStakeGOVSTAKE,
    "Stake → GOVUNSTAKE": parseStakeGOVUNSTAKE,
    "Gov ": parseGov,
    "Claim → Rewards": parseClaimRewards,
    "Claim → UST": parseClaimUST,
    "Burn ": parseBurn,
    "Send ": parseSend,
  }

  const [parserKey, setParserKey] = useState("")

  /* state */
  const [hash, setHash] = useState("")
  const [results, setResults] = useState<Dictionary<TxInfo>>({})
  const txInfo = hash && results[hash]

  /* query */
  const getTxInfos = useRecoilValue(getTxInfosQuery)
  useEffect(() => {
    const load = async (hash: string) => {
      const txInfo = await getTxInfos(hash)
      return setResults((prev) => ({ ...prev, [hash]: txInfo }))
    }

    hash.length === 64 && load(hash)
  }, [hash, getTxInfos])

  return (
    <Page title="Receipt">
      <Search value={hash} onChange={(e) => setHash(e.target.value)} />

      {txInfo && (
        <>
          <Grid>
            <ul>
              {Object.keys(parsers).map((key) => (
                <li key={key}>
                  <button onClick={() => setParserKey(key)}>
                    <Checkbox type="radio" checked={parserKey === key}>
                      {key}
                    </Checkbox>
                  </button>
                </li>
              ))}
            </ul>

            {parserKey && (
              <Boundary key={parserKey}>
                <TxInfo txInfo={txInfo} parser={parsers[parserKey]} />
              </Boundary>
            )}
          </Grid>

          <Gutter>
            <Card title="From Contract">
              <pre>
                {JSON.stringify(concatFromContract(txInfo.Logs), null, 2)}
              </pre>
            </Card>
          </Gutter>
        </>
      )}
    </Page>
  )
}

export default Receipt
