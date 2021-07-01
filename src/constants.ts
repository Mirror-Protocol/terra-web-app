/* terra:network */
export const FINDER = "https://finder.terra.money"
export const EXTENSION = "https://terra.money/extension"
export const CHROME = "https://google.com/chrome"
export const DOCS = "https://docs.mirror.finance"
export const ICON_URL = "https://whitelist.mirror.finance/images"

/* terra:wasm */
export const WASMQUERY = "WasmContractsContractAddressStore"

/* terra:configs */
export const BLOCK_TIME = 6500 // 6.5s

/* mirror:unit */
export const SMALLEST = 1e6
export const FMT = { HHmm: "EEE, LLL dd, HH:mm aa", MMdd: "LLL dd, yyyy" }

/* mirror:configs */
export const GENESIS = 1607022000000
export const DEFAULT_SLIPPAGE = 0.01
export const MAX_MSG_LENGTH = 4096
export const COMMISSION = 0.003
export const COLLATERAL_RATIO = { DANGER: 0.15, WARNING: 0.3 }

/* network:settings */
export const PRICES_POLLING_INTERVAL = 30000
export const TX_POLLING_INTERVAL = 1000

/* outbound */
export const TRADING_HOURS = {
  NASDAQ: "https://www.nasdaq.com/stock-market-trading-hours-for-nasdaq",
  TSX: "https://www.tsx.com/trading/calendars-and-trading-hours/trading-hours",
}

/* sentry */
export const DSN =
  "https://b1532961e54e491fbb57e67805cb36a4@o247107.ingest.sentry.io/5540998"
