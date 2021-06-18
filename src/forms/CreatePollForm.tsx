import { useRecoilValue } from "recoil"

import useNewContractMsg from "../libs/useNewContractMsg"
import Tooltips from "../lang/Tooltips"
import { MAX_MSG_LENGTH } from "../constants"
import { div, gte, number, times } from "../libs/math"
import { record, getLength } from "../libs/utils"
import { lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, step, toBase64, placeholder } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { BalanceKey } from "../hooks/contractKeys"
import { useProtocol } from "../data/contract/protocol"
import { useFind } from "../data/contract/normalize"
import { useGovConfig } from "../data/gov/config"
import { communityConfigQuery } from "../data/contract/info"
import { factoryDistributionInfoQuery } from "../data/contract/info"

import { TooltipIcon } from "../components/Tooltip"
import FormGroup from "../components/FormGroup"
import Formatted from "../components/Formatted"
import { PollType } from "../pages/Poll/CreatePoll"
import useGovReceipt from "./receipts/useGovReceipt"
import useSelectAsset, { Config } from "./useSelectAsset"
import FormContainer from "./FormContainer"
import styles from "./CreatePollForm.module.scss"

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
  weight = "weight",
  auctionDiscount = "auctionDiscount",
  minCollateralRatio = "minCollateralRatio",
  // Pre-IPO
  mintPeriod = "mintPeriod",
  minCollateralRatioAfterIPO = "minCollateralRatioAfterIPO",
  price = "price",

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
  voterWeight = "voterWeight",

  /* Type.COLLATERAL */
  multiplier = "multiplier",

  /* Type.COMMUNITY_SPEND */
  recipient = "recipient",
  amount = "amount",
}

interface Props {
  type: PollType
  headings: { title: string; desc: string }
}

const CreatePollForm = ({ type, headings }: Props) => {
  const balanceKey = BalanceKey.TOKEN
  const config = useGovConfig()
  const communityConfig = useRecoilValue(communityConfigQuery)
  const spend_limit = communityConfig?.spend_limit

  const getFieldKeys = () => {
    // Determine here which key to use for each type.
    // Filter out the validation and the fields to be printed on the screen based on this.

    const defaultKeys = [Key.title, Key.description, Key.link]
    const additionalKeys: Record<PollType, Key[]> = {
      [PollType.TEXT]: defaultKeys,
      [PollType.TEXT_WHITELIST]: [
        Key.name,
        Key.ticker,
        Key.listed,
        Key.description,
        Key.link,
        Key.suggestedOracle,
      ],
      [PollType.TEXT_PREIPO]: [
        Key.name,
        Key.ticker,
        Key.listed,
        Key.description,
        Key.link,
        Key.suggestedOracle,
      ],
      [PollType.WHITELIST]: [
        ...defaultKeys,
        Key.name,
        Key.symbol,
        Key.reference,
        Key.oracle,
        Key.auctionDiscount,
        Key.minCollateralRatio,
      ],
      [PollType.PREIPO]: [
        ...defaultKeys,
        Key.name,
        Key.symbol,
        Key.reference,
        Key.oracle,
        Key.auctionDiscount,
        Key.minCollateralRatio,
        Key.mintPeriod,
        Key.minCollateralRatioAfterIPO,
        Key.price,
      ],
      [PollType.DELIST]: [...defaultKeys, Key.asset],
      [PollType.INFLATION]: [...defaultKeys, Key.asset, Key.weight],
      [PollType.MINT_UPDATE]: [
        ...defaultKeys,
        Key.asset,
        Key.auctionDiscount,
        Key.minCollateralRatio,
      ],
      [PollType.GOV_UPDATE]: [
        ...defaultKeys,
        Key.quorum,
        Key.threshold,
        Key.votingPeriod,
        Key.effectiveDelay,
        Key.expirationPeriod,
        Key.proposalDeposit,
        Key.voterWeight,
      ],
      [PollType.COLLATERAL]: [
        ...defaultKeys,
        Key.asset,
        Key.multiplier,
        Key.oracle,
      ],
      [PollType.COMMUNITY_SPEND]: [...defaultKeys, Key.recipient, Key.amount],
    }

    return additionalKeys[type]
  }

  const combineTitle = ({ title, name, ticker }: Values<Key>) =>
    type === PollType.TEXT_WHITELIST
      ? `[Whitelist] ${name} (${ticker})`
      : type === PollType.TEXT_PREIPO
      ? `[Pre-IPO] ${name} (${ticker})`
      : title

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
  const { contracts, getToken, toAssetInfo } = useProtocol()
  const find = useFind()
  const getWeight = useRecoilValue(factoryDistributionInfoQuery)

  /* form:validate */
  const validate = (values: Values<Key>) => {
    const { title, description, link } = values
    const { name, ticker, symbol, oracle, asset } = values
    const { weight, auctionDiscount, minCollateralRatio } = values
    const { mintPeriod, minCollateralRatioAfterIPO, price } = values
    const { owner, quorum, threshold, votingPeriod } = values
    const { effectiveDelay, expirationPeriod, proposalDeposit } = values
    const { voterWeight, multiplier, recipient, amount } = values
    const { listed, reference } = values

    const paramRange = {
      optional: [PollType.MINT_UPDATE, PollType.GOV_UPDATE].includes(type),
      max: "100",
    }

    const textRanges = {
      [Key.title]: { min: 4, max: 64 },
      [Key.description]: { min: 4, max: 256 },
      [Key.link]: { min: 12, max: 128 },
      [Key.name]: { min: 3, max: 50 },
      [Key.ticker]: { min: 1, max: 11 },
      [Key.symbol]: { min: 3, max: 12 },
    }

    return record(
      {
        [Key.title]: [PollType.TEXT_WHITELIST, PollType.TEXT_PREIPO].includes(
          type
        )
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

        [Key.weight]: v.amount(weight, {}, "Weight"),
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
        [Key.mintPeriod]: v.integer(mintPeriod, "Mint period"),
        [Key.minCollateralRatioAfterIPO]: v.amount(
          minCollateralRatioAfterIPO,
          { ...paramRange, max: undefined },
          "Min collateral ratio after IPO"
        ),
        [Key.price]: v.amount(
          price,
          { ...paramRange, max: undefined },
          "Price"
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
          : v.amount(proposalDeposit, { symbol: "MIR" }),
        [Key.voterWeight]: !voterWeight
          ? ""
          : v.amount(voterWeight, {}, "Weight"),

        // Type.COLLATERAL
        [Key.multiplier]: !multiplier
          ? ""
          : v.amount(multiplier, { dp: 6 }, "Weight"),

        // Type.COMMUNITY_SPEND
        [Key.recipient]: v.address(recipient),
        [Key.amount]: v.amount(amount, { symbol: "MIR" }),
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
  const { weight, auctionDiscount, minCollateralRatio } = values
  const { mintPeriod, minCollateralRatioAfterIPO, price } = values
  const { owner, quorum, threshold, votingPeriod } = values
  const { effectiveDelay, expirationPeriod, proposalDeposit } = values
  const { voterWeight, multiplier, recipient, amount } = values

  const deposit = config?.proposal_deposit ?? "0"

  /* render:form */
  const isCollateral = type === PollType.COLLATERAL
  const selectAssetConfig: Config = {
    token: asset,
    onSelect: (value) => setValue(Key.asset, value),
    validate: isCollateral ? undefined : ({ symbol }) => symbol !== "MIR",
    native: isCollateral ? ["uluna"] : undefined,
  }

  const select = useSelectAsset(selectAssetConfig)

  const descriptionLabel = {
    [PollType.TEXT]: "Description",
    [PollType.TEXT_WHITELIST]: "Reason for listing",
    [PollType.TEXT_PREIPO]: "Reason for listing",
    [PollType.WHITELIST]: "Description",
    [PollType.PREIPO]: "Description",
    [PollType.DELIST]: "Description",
    [PollType.INFLATION]: "Reason for modifying weight parameter",
    [PollType.MINT_UPDATE]: "Reason for modifying mint parameter",
    [PollType.GOV_UPDATE]: "Reason for modifying governance parameter",
    [PollType.COLLATERAL]: "Reasons for modifying collateral parameter",
    [PollType.COMMUNITY_SPEND]: "Reason for community pool spending",
  }[type]

  const weightPlaceholders = {
    [Key.weight]: div(getWeight(asset), 100),
  }

  const mintPlaceholders = {
    [Key.auctionDiscount]: "20",
    [Key.minCollateralRatio]: "150",
    [Key.mintPeriod]: "",
    [Key.minCollateralRatioAfterIPO]: "150",
    [Key.price]: "",
  }

  const configPlaceholders = {
    [Key.owner]: config?.owner ?? "",
    [Key.quorum]: times(config?.quorum, 100),
    [Key.threshold]: times(config?.threshold, 100),
    [Key.votingPeriod]: config?.voting_period ?? "",
    [Key.effectiveDelay]: config?.effective_delay ?? "",
    [Key.expirationPeriod]: config?.expiration_period ?? "",
    [Key.proposalDeposit]: lookup(config?.proposal_deposit, "MIR") ?? "",
    [Key.voterWeight]: config?.voter_weight ?? "",
  }

  const fields = {
    deposit: {
      help: renderBalance(find(balanceKey, getToken("MIR")), "MIR"),
      label: <TooltipIcon content={Tooltips.Gov.Deposit}>Deposit</TooltipIcon>,
      value: <Formatted symbol="MIR">{deposit}</Formatted>,
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
          placeholder: [
            PollType.TEXT_WHITELIST,
            PollType.TEXT_PREIPO,
            PollType.WHITELIST,
            PollType.PREIPO,
          ].includes(type)
            ? "URL for additional asset information (Bloomberg, Investing.com, Yahoo Finance, etc.)"
            : "URL for additional information",
        },
      },

      // Type.TEXT_WHITELIST
      [Key.name]: {
        label: "Asset Name",
        input: {
          placeholder: "Apple Inc.",
          autoFocus: [PollType.TEXT_WHITELIST, PollType.TEXT_PREIPO].includes(
            type
          ),
        },
      },
      [Key.ticker]: {
        label: <TooltipIcon content={Tooltips.Gov.Ticker}>Ticker</TooltipIcon>,
        input: { placeholder: "AAPL" },
      },
      [Key.listed]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.ListedExchange}>
            Listed Exchange
          </TooltipIcon>
        ),
        input: { placeholder: "NASDAQ" },
      },
      [Key.suggestedOracle]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.SuggestedOracle}>
            Suggested Oracle (Optional)
          </TooltipIcon>
        ),
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

      // Type.INFLATION
      [Key.weight]: {
        label: <TooltipIcon content={Tooltips.Gov.Weight}>Weight</TooltipIcon>,
        input: {
          type: "number",
          step: step(),
          placeholder: weightPlaceholders[Key.weight],
        },
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
          <TooltipIcon content={Tooltips.Gov.AuctionDiscount}>
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
          <TooltipIcon content={Tooltips.Gov.MinimumCollateralRatio}>
            Minimum Collateral Ratio before IPO
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.minCollateralRatio],
        },
        unit: "%",
      },
      [Key.mintPeriod]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.MintPeriod}>
            Mint Period
          </TooltipIcon>
        ),
        input: { placeholder: mintPlaceholders[Key.mintPeriod] },
        unit: "Second(s)",
        unitAfterValue: true,
      },
      [Key.minCollateralRatioAfterIPO]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.MinimumCollateralRatioAfterIPO}>
            Minimum collateral ratio after IPO
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.minCollateralRatioAfterIPO],
        },
        unit: "%",
      },
      [Key.price]: {
        label:
          type === PollType.PREIPO ? (
            <TooltipIcon content={Tooltips.Gov.PreIpoPrice}>
              Pre-IPO Price
            </TooltipIcon>
          ) : (
            "End Price"
          ),
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.price],
        },
        unit: symbol ? `UST per ${symbol}` : "",
        unitAfterValue: true,
      },

      // Type.GOV_UPDATE
      [Key.owner]: {
        label: "Owner (Optional)",
        input: { placeholder: configPlaceholders[Key.owner] },
      },
      [Key.quorum]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.Quorum}>
            Quorum (Optional)
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: configPlaceholders[Key.quorum],
        },
        unit: "%",
      },
      [Key.threshold]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.Threshold}>
            Threshold (Optional)
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: configPlaceholders[Key.threshold],
        },
        unit: "%",
      },
      [Key.votingPeriod]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.VotingPeriod}>
            Voting Period (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.votingPeriod] },
        unit: "Second(s)",
        unitAfterValue: true,
      },
      [Key.effectiveDelay]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.EffectiveDelay}>
            Effective Delay (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.effectiveDelay] },
        unit: "Second(s)",
        unitAfterValue: true,
      },
      [Key.expirationPeriod]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.ExpirationPeriod}>
            Expiration Period (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.expirationPeriod] },
        unit: "Second(s)",
        unitAfterValue: true,
      },
      [Key.proposalDeposit]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.ProposalDeposit}>
            Proposal Deposit (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.proposalDeposit] },
        unit: "MIR",
        unitAfterValue: true,
      },
      [Key.voterWeight]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.VoterWeight}>
            Voter weight (Optional)
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: configPlaceholders[Key.voterWeight],
        },
      },

      // Type.COLLATERAL
      [Key.multiplier]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.Multiplier}>
            Multiplier
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: "",
        },
      },

      // Type.COMMUNITY_SPEND
      [Key.recipient]: {
        label: (
          <TooltipIcon content={Tooltips.Gov.Recipient}>Recipient</TooltipIcon>
        ),
        input: { placeholder: "Terra address" },
      },
      [Key.amount]: {
        label: <TooltipIcon content={Tooltips.Gov.Amount}>Amount</TooltipIcon>,
        input: { placeholder: placeholder("MIR") },
        help: renderBalance(spend_limit, "MIR"),
        unit: "MIR",
        unitAfterValue: true,
      },
    }),
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const token = asset
  const { mirrorToken, mint, gov, factory, community, collateralOracle } =
    contracts

  /* Type.WHITELIST */
  const whitelistMessage = {
    name,
    symbol,
    oracle_feeder: oracle,
    params: {
      auction_discount: div(auctionDiscount, 100),
      min_collateral_ratio: div(minCollateralRatio, 100),
      mint_period: mintPeriod ? number(mintPeriod) : undefined,
      min_collateral_ratio_after_ipo: minCollateralRatioAfterIPO
        ? div(minCollateralRatioAfterIPO, 100)
        : undefined,
      pre_ipo_price: price || undefined,
    },
  }

  /* Type.DELIST */
  const revokeAsset = {
    asset_token: asset,
  }

  /* Type.INFLATION */
  const updateWeight = {
    asset_token: token,
    weight: weight ? number(times(weight, 100)) : undefined,
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
    voter_weight: voterWeight || undefined,
  }

  /* Type.COLLATERL */
  const updateCollateralMultiplier = {
    asset: toAssetInfo(asset),
    multiplier: multiplier || undefined,
  }

  /* Type.COMMUNITY_SPEND */
  const communitySpend = {
    recipient,
    amount: toAmount(amount),
  }

  const execute_msg = {
    [PollType.TEXT]: undefined,
    [PollType.TEXT_WHITELIST]: undefined,
    [PollType.TEXT_PREIPO]: undefined,
    [PollType.WHITELIST]: {
      contract: factory,
      msg: toBase64({ whitelist: whitelistMessage }),
    },
    [PollType.PREIPO]: {
      contract: factory,
      msg: toBase64({ whitelist: whitelistMessage }),
    },
    [PollType.DELIST]: {
      contract: factory,
      msg: toBase64({ revoke_asset: revokeAsset }),
    },
    [PollType.INFLATION]: {
      contract: factory,
      msg: toBase64({ update_weight: updateWeight }),
    },
    [PollType.MINT_UPDATE]: {
      contract: factory,
      msg: toBase64({ pass_command: mintPassCommand }),
    },
    [PollType.GOV_UPDATE]: {
      contract: gov,
      msg: toBase64({ update_config: govUpdateConfig }),
    },
    [PollType.COLLATERAL]: {
      contract: collateralOracle,
      msg: toBase64({
        update_collateral_multiplier: updateCollateralMultiplier,
      }),
    },
    [PollType.COMMUNITY_SPEND]: {
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

  const messages = !gte(find(balanceKey, getToken("MIR")), deposit)
    ? ["Insufficient balance"]
    : getLength(msg) > MAX_MSG_LENGTH
    ? ["Input is too long to be executed"]
    : type === PollType.GOV_UPDATE &&
      Object.values(govUpdateConfig).filter(Boolean).length > 1
    ? ["Only one governance parameter can be modified at a time."]
    : undefined

  const disabled = invalid || !!messages?.length

  /* result */
  const label = "Submit"
  const parseTx = useGovReceipt()
  const fieldKeys = getFieldKeys()
  const container = { attrs, contents: [], messages, label, disabled, data }

  return (
    <FormContainer {...container} parseTx={parseTx} gov>
      <header className={styles.headings}>
        <h1 className={styles.title}>{headings.title}</h1>
        <p className={styles.desc}>{headings.desc}</p>
      </header>

      {fieldKeys.map(
        (key) =>
          !fields[key].input?.disabled && (
            <FormGroup {...fields[key]} type={2} key={key} />
          )
      )}

      <FormGroup {...fields["deposit"]} type={2} />
    </FormContainer>
  )
}

export default CreatePollForm
