import { Fragment } from "react"
import useNewContractMsg from "../terra/useNewContractMsg"
import Tooltip from "../lang/Tooltip.json"
import { MAX_MSG_LENGTH, MIR } from "../constants"
import { div, gte, times } from "../libs/math"
import { record, getLength } from "../libs/utils"
import { lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, step, toBase64, placeholder } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { useRefetch, useContractsAddress, useContract } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"
import { GovKey, useGov } from "../graphql/useGov"
import useContractQuery from "../graphql/useContractQuery"
import { TooltipIcon } from "../components/Tooltip"
import FormGroup from "../components/FormGroup"
import FormFeedback from "../components/FormFeedback"
import { Type } from "../pages/Poll/CreatePoll"
import useGovReceipt from "./receipts/useGovReceipt"
import useSelectAsset, { Config } from "./useSelectAsset"
import FormContainer from "./FormContainer"

enum Key {
  title = "title",
  description = "description",
  link = "link",

  /* Type.TEXT_WHITELIST */
  name = "name",
  ticker = "ticker",
  listed = "listed",
  suggestedOracle = "suggestedOracle",

  /* Type.WHITELIST */
  symbol = "symbol",
  reference = "reference",
  oracle = "oracle",
  auctionDiscount = "auctionDiscount",
  minCollateralRatio = "minCollateralRatio",

  /* Type.MINT_UPDATE */
  asset = "asset",

  /* Type.GOV_UPDATE */
  owner = "owner",
  quorum = "quorum",
  threshold = "threshold",
  votingPeriod = "votingPeriod",
  effectiveDelay = "effectiveDelay",
  expirationPeriod = "expirationPeriod",
  proposalDeposit = "proposalDeposit",

  /* Type.COMMUNITY_SPEND */
  recipient = "recipient",
  amount = "amount",
}

const CreatePollForm = ({ type }: { type: Type }) => {
  const balanceKey = BalanceKey.TOKEN
  const governance = useGov()
  const { config } = governance
  const communityPool = useCommunityPool()
  const spend_limit = communityPool.parsed?.spend_limit

  const getFieldKeys = () => {
    // Determine here which key to use for each type.
    // Filter out the validation and the fields to be printed on the screen based on this.

    const defaultKeys = [Key.title, Key.description, Key.link]
    const additionalKeys = {
      [Type.TEXT]: defaultKeys,
      [Type.TEXT_WHITELIST]: [
        Key.name,
        Key.ticker,
        Key.listed,
        Key.description,
        Key.link,
        Key.suggestedOracle,
      ],
      [Type.WHITELIST]: [
        ...defaultKeys,
        Key.name,
        Key.symbol,
        Key.reference,
        Key.oracle,
        Key.auctionDiscount,
        Key.minCollateralRatio,
      ],
      [Type.MINT_UPDATE]: [
        ...defaultKeys,
        Key.asset,
        Key.auctionDiscount,
        Key.minCollateralRatio,
      ],
      [Type.GOV_UPDATE]: [
        ...defaultKeys,
        Key.quorum,
        Key.threshold,
        Key.votingPeriod,
        Key.effectiveDelay,
        Key.expirationPeriod,
        Key.proposalDeposit,
      ],
      [Type.COMMUNITY_SPEND]: [...defaultKeys, Key.recipient, Key.amount],
    }

    return additionalKeys[type]
  }

  const combineTitle = ({ title, name, ticker }: Values<Key>) =>
    type === Type.TEXT_WHITELIST ? `[Whitelist] ${name} (${ticker})` : title

  const combineDescription = ({ description, ...values }: Values<Key>) => {
    const { listed, suggestedOracle, reference } = values

    const combined = [
      description,
      listed && `Listed Exchange: ${listed}`,
      suggestedOracle && `Suggested Oracle: ${suggestedOracle}`,
      reference && `Reference Poll ID: ${reference}`,
    ]

    return combined.filter(Boolean).join("\n")
  }

  /* context */
  const { contracts, getToken } = useContractsAddress()
  const { result, find } = useContract()
  useRefetch([balanceKey])

  /* form:validate */
  const validate = (values: Values<Key>) => {
    const { title, description, link } = values
    const { name, ticker, symbol, oracle, asset } = values
    const { auctionDiscount, minCollateralRatio } = values
    const { owner, quorum, threshold, votingPeriod } = values
    const { effectiveDelay, expirationPeriod, proposalDeposit } = values
    const { recipient, amount } = values
    const { listed, reference } = values

    const paramRange = {
      optional: [Type.MINT_UPDATE, Type.GOV_UPDATE].includes(type),
      max: "100",
    }

    const textRanges = {
      [Key.title]: { min: 4, max: 64 },
      [Key.description]: { min: 4, max: 64 },
      [Key.link]: { min: 12, max: 128 },
      [Key.name]: { min: 3, max: 50 },
      [Key.ticker]: { min: 1, max: 11 },
      [Key.symbol]: { min: 3, max: 12 },
    }

    return record(
      {
        [Key.title]:
          type === Type.TEXT_WHITELIST
            ? ""
            : v.required(title) ||
              v.length(title, textRanges[Key.title], "Title"),
        [Key.description]:
          v.required(description) ||
          v.length(description, textRanges[Key.description], "Description"),
        [Key.link]: !link
          ? ""
          : v.length(link, textRanges[Key.link], "Link") || v.url(link),

        // Type.TEXT_WHITELIST
        [Key.name]:
          v.required(name) || v.length(name, textRanges[Key.name], "Name"),
        [Key.ticker]:
          v.required(ticker) ||
          v.length(ticker, textRanges[Key.ticker], "Ticker") ||
          v.symbol(ticker),
        [Key.listed]: v.required(listed),
        [Key.suggestedOracle]: "",

        // Type.WHITELIST
        [Key.symbol]:
          v.required(symbol) ||
          v.length(symbol, textRanges[Key.symbol], "Symbol") ||
          v.symbol(symbol),
        [Key.reference]: !reference
          ? ""
          : v.integer(reference, "Reference Poll ID"),
        [Key.oracle]: v.address(oracle),

        // Type.MINT_UPDATE
        [Key.asset]: v.required(asset),

        [Key.auctionDiscount]: v.amount(
          auctionDiscount,
          paramRange,
          "Auction discount"
        ),
        [Key.minCollateralRatio]: v.amount(
          minCollateralRatio,
          { ...paramRange, max: undefined },
          "Minimum collateral ratio"
        ),

        // Type.GOV_UPDATE
        [Key.owner]: !owner ? "" : v.address(owner),
        [Key.quorum]: !quorum ? "" : v.amount(quorum, paramRange, "Quorum"),
        [Key.threshold]: !threshold
          ? ""
          : v.amount(threshold, paramRange, "Threshold"),
        [Key.votingPeriod]: !votingPeriod
          ? ""
          : v.integer(votingPeriod, "Voting Period"),
        [Key.effectiveDelay]: !effectiveDelay
          ? ""
          : v.integer(effectiveDelay, "Effective Delay"),
        [Key.expirationPeriod]: !expirationPeriod
          ? ""
          : v.integer(expirationPeriod, "Expiration Period"),
        [Key.proposalDeposit]: !proposalDeposit
          ? ""
          : v.amount(proposalDeposit, { symbol: MIR }),

        // Type.COMMUNITY_SPEND
        [Key.recipient]: v.address(recipient),
        [Key.amount]: v.amount(amount, { symbol: MIR }),
      },
      "",
      getFieldKeys()
    )
  }

  /* form:hook */
  const initial = Object.assign(record(Key, ""))

  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form

  const title = combineTitle(values)
  const description = combineDescription(values)

  const { link } = values
  const { name, symbol, oracle, asset } = values
  const { auctionDiscount, minCollateralRatio } = values
  const { owner, quorum, threshold, votingPeriod } = values
  const { effectiveDelay, expirationPeriod, proposalDeposit } = values
  const { recipient, amount } = values

  const deposit = config?.proposal_deposit ?? "0"
  const value = lookup(deposit, MIR)

  /* render:form */
  const selectAssetConfig: Config = {
    token: asset,
    onSelect: (value) => setValue(Key.asset, value),
    skip: ["MIR"],
  }

  const select = useSelectAsset(selectAssetConfig)

  const descriptionLabel = {
    [Type.TEXT]: "Description",
    [Type.TEXT_WHITELIST]: "Reason for listing",
    [Type.WHITELIST]: "Description",
    [Type.MINT_UPDATE]: "Reason for modifying mint parameter",
    [Type.GOV_UPDATE]: "Reason for modifying governance parameter",
    [Type.COMMUNITY_SPEND]: "Reason for community pool spending",
  }[type]

  const mintPlaceholders = {
    [Key.auctionDiscount]: "20",
    [Key.minCollateralRatio]: "150",
  }

  const configPlaceholders = {
    [Key.owner]: config?.owner ?? "",
    [Key.quorum]: times(config?.quorum, 100),
    [Key.threshold]: times(config?.threshold, 100),
    [Key.votingPeriod]: config?.voting_period ?? "",
    [Key.effectiveDelay]: config?.effective_delay ?? "",
    [Key.expirationPeriod]: config?.expiration_period ?? "",
    [Key.proposalDeposit]: lookup(config?.proposal_deposit, MIR) ?? "",
  }

  const fields = {
    deposit: {
      help: renderBalance(find(balanceKey, getToken(MIR)), MIR),
      label: <TooltipIcon content={Tooltip.Gov.Deposit}>Deposit</TooltipIcon>,
      value,
      unit: MIR,
    },

    ...getFields({
      [Key.title]: {
        label: "Title",
        input: { placeholder: "", autoFocus: true },
      },
      [Key.description]: {
        label: descriptionLabel,
        textarea: { placeholder: "" },
      },
      [Key.link]: {
        label: "Information Link (Optional)",
        input: {
          placeholder: [Type.TEXT_WHITELIST, Type.WHITELIST].includes(type)
            ? "URL for additional asset information (Bloomberg, Investing.com, Yahoo Finance, etc.)"
            : "URL for additional information",
        },
      },

      // Type.TEXT_WHITELIST
      [Key.name]: {
        label: "Asset Name",
        input: {
          placeholder: "Apple Inc.",
          autoFocus: type === Type.TEXT_WHITELIST,
        },
      },
      [Key.ticker]: {
        label: "Ticker",
        input: { placeholder: "AAPL" },
      },
      [Key.listed]: {
        label: "Listed Exchange",
        input: { placeholder: "NASDAQ" },
      },
      [Key.suggestedOracle]: {
        label: "Suggested Oracle (Optional)",
        input: { placeholder: "Band Protocol" },
      },

      // Type.WHITELIST
      [Key.symbol]: {
        label: "Symbol",
        input: { placeholder: "mAAPL" },
      },
      [Key.oracle]: {
        label: "Oracle Feeder",
        input: { placeholder: "Terra address of the oracle feeder" },
      },
      [Key.reference]: {
        label: "Reference Poll ID (Optional)",
        input: { placeholder: "" },
      },

      // Type.MINT_UPDATE
      [Key.asset]: {
        label: "Asset",
        select: select.button,
        assets: select.assets,
        focused: select.isOpen,
      },
      [Key.auctionDiscount]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.AuctionDiscount}>
            Auction Discount
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.auctionDiscount],
        },
        unit: "%",
      },
      [Key.minCollateralRatio]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.MinimumCollateralRatio}>
            Minimum Collateral Ratio
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.minCollateralRatio],
        },
        unit: "%",
      },

      // Type.GOV_UPDATE
      [Key.owner]: {
        label: "Owner (Optional)",
        input: { placeholder: configPlaceholders[Key.owner] },
      },
      [Key.quorum]: {
        label: "Quorum (Optional)",
        input: {
          type: "number",
          step: step(),
          placeholder: configPlaceholders[Key.quorum],
        },
        unit: "%",
      },
      [Key.threshold]: {
        label: "Threshold (Optional)",
        input: {
          type: "number",
          step: step(),
          placeholder: configPlaceholders[Key.threshold],
        },
        unit: "%",
      },
      [Key.votingPeriod]: {
        label: "Voting Period (Optional)",
        input: { placeholder: configPlaceholders[Key.votingPeriod] },
        unit: "Block(s)",
      },
      [Key.effectiveDelay]: {
        label: "Effective Delay (Optional)",
        input: { placeholder: configPlaceholders[Key.effectiveDelay] },
        unit: "Block(s)",
      },
      [Key.expirationPeriod]: {
        label: "Expiration Period (Optional)",
        input: { placeholder: configPlaceholders[Key.expirationPeriod] },
        unit: "Block(s)",
      },
      [Key.proposalDeposit]: {
        label: "Proposal Deposit (Optional)",
        input: { placeholder: configPlaceholders[Key.proposalDeposit] },
        unit: MIR,
      },

      // Type.COMMUNITY_SPEND
      [Key.recipient]: {
        label: "Recipient",
        input: { placeholder: "Terra address" },
      },
      [Key.amount]: {
        label: "Amount",
        input: { placeholder: placeholder(MIR) },
        help: renderBalance(spend_limit, MIR),
        unit: MIR,
      },
    }),
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const token = asset
  const { mirrorToken, mint, gov, factory, community } = contracts

  /* Type.WHITELIST */
  const whitelistMessage = {
    name,
    symbol,
    oracle_feeder: oracle,
    params: {
      auction_discount: div(auctionDiscount, 100),
      min_collateral_ratio: div(minCollateralRatio, 100),
    },
  }

  /* Type.MINT_UPDATE */
  const mintPassCommand = {
    contract_addr: mint,
    msg: toBase64({
      update_asset: {
        asset_token: token,
        auction_discount: auctionDiscount
          ? div(auctionDiscount, 100)
          : undefined,
        min_collateral_ratio: minCollateralRatio
          ? div(minCollateralRatio, 100)
          : undefined,
      },
    }),
  }

  /* Type.GOV_UPDATE */
  const govUpdateConfig = {
    owner,
    quorum: quorum ? div(quorum, 100) : undefined,
    threshold: threshold ? div(threshold, 100) : undefined,
    voting_period: votingPeriod ? Number(votingPeriod) : undefined,
    effective_delay: effectiveDelay ? Number(effectiveDelay) : undefined,
    expiration_period: expirationPeriod ? Number(expirationPeriod) : undefined,
    proposal_deposit: proposalDeposit ? toAmount(proposalDeposit) : undefined,
  }

  /* Type.COMMUNITY_SPEND */
  const communitySpend = {
    recipient,
    amount: toAmount(amount),
  }

  const execute_msg = {
    [Type.TEXT]: undefined,
    [Type.TEXT_WHITELIST]: undefined,
    [Type.WHITELIST]: {
      contract: factory,
      msg: toBase64({ whitelist: whitelistMessage }),
    },
    [Type.MINT_UPDATE]: {
      contract: factory,
      msg: toBase64({ pass_command: mintPassCommand }),
    },
    [Type.GOV_UPDATE]: {
      contract: gov,
      msg: toBase64({ update_config: govUpdateConfig }),
    },
    [Type.COMMUNITY_SPEND]: {
      contract: community,
      msg: toBase64({ spend: communitySpend }),
    },
  }[type]

  const msg = toBase64({
    create_poll: { title, description, link, execute_msg },
  })

  const data = [
    newContractMsg(mirrorToken, {
      send: { amount: deposit, contract: gov, msg },
    }),
  ]

  const loading =
    result[balanceKey].loading || governance.result[GovKey.CONFIG].loading

  const messages =
    !loading && !gte(find(balanceKey, getToken(MIR)), deposit)
      ? ["Insufficient balance"]
      : getLength(msg) > MAX_MSG_LENGTH
      ? ["Input is too long to be executed"]
      : type === Type.GOV_UPDATE
      ? ["Modifying governance parameters is currently under construction"]
      : undefined

  const disabled = invalid || loading || !!messages?.length

  /* result */
  const label = "Submit"
  const parseTx = useGovReceipt()
  const fieldKeys = getFieldKeys()
  const container = { attrs, contents: [], messages, label, disabled, data }

  return (
    <FormContainer {...container} parseTx={parseTx} gov>
      {fieldKeys.map(
        (key) =>
          !fields[key].input?.disabled && (
            <Fragment key={key}>
              <FormGroup {...fields[key]} type={2} />
              {key === Key.description && (
                <FormFeedback help>
                  The current maximum description length is 64 bytes.
                  Description length will be increased on January 1, 2021.
                </FormFeedback>
              )}
            </Fragment>
          )
      )}

      <FormGroup {...fields["deposit"]} type={2} />
    </FormContainer>
  )
}

export default CreatePollForm

/* community pool */
const useCommunityPool = () => {
  const { contracts } = useContractsAddress()
  const variables = { contract: contracts["community"], msg: { config: {} } }
  const query = useContractQuery<{ spend_limit: string }>(variables)
  return query
}
