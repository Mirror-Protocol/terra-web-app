import iconGitHub from "images/icon-github.svg"
import iconTwitter from "images/icon-twitter.svg"
import iconDiscord from "images/icon-discord.svg"
import iconDocuments from "images/icon-docs.svg"

import iconGitHubLight from "images/icon-github-primary.svg"
import iconTwitterLight from "images/icon-twitter-primary.svg"
import iconDiscordLight from "images/icon-discord-primary.svg"
import iconDocumentsLight from "images/icon-docs-primary.svg"

/* terra:network */
export const FINDER = "https://finder.terra.money"
export const TERRA_STATION_EXTENSION =
  "https://chrome.google.com/webstore/detail/terra-station/aiifbnbfobpmeekipheeijimdpnlpgpp"
export const XDEFI_EXTENSION =
  "https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf"
export const CHROME = "https://google.com/chrome"

/* terra:configs */
export const BLOCK_TIME = 6650 // 6.65s

/* terraswap:unit */
export const MIR = "MIR"
export const UUSD = "uusd"
export const ULUNA = "uluna"
export const UKRW = "ukrw"
export const USDR = "usdr"
export const UMNT = "umnt"
export const UAUD = "uaud"
export const UCAD = "ucad"
export const UCHF = "uchf"
export const UCNY = "ucny"
export const UEUR = "ueur"
export const UGBP = "ugbp"
export const UHKD = "uhkd"
export const UINR = "uinr"
export const UJPY = "ujpy"
export const USGD = "usgd"
export const UTHB = "uthb"
export const UST = "UST"
export const KRT = "KRT"
export const SDT = "SDT"
export const MNT = "MNT"
export const LUNA = "Luna"
export const AUT = "AUT"
export const CAT = "CAT"
export const CHT = "CHT"
export const CNT = "CNT"
export const EUT = "EUT"
export const GBT = "GBT"
export const HKT = "HKT"
export const INT = "INT"
export const JPT = "JPT"
export const SGT = "SGT"
export const THT = "THT"
export const LP = "LP"

export const NATIVE_TOKENS = [
  ULUNA,
  UUSD,
  UKRW,
  USDR,
  UMNT,
  UEUR,
  UCNY,
  UJPY,
  UGBP,
  UINR,
  UCAD,
  UCHF,
  UAUD,
  USGD,
  UTHB,
  UHKD,
]

/* terraswap:configs */
export const DEFAULT_MAX_SPREAD = 0.5
export const MAX_MSG_LENGTH = 1024

/* network:settings */
export const TX_POLLING_INTERVAL = 1000
export const MAX_TX_POLLING_RETRY = 20
export const DEFAULT_EXT_NETWORK: ExtNetworkConfig = {
  name: "mainnet",
  chainID: "columbus-5",
  fcd: "https://fcd.terra.dev",
  lcd: "https://lcd.terra.dev",
}

/* project */
export const MEDIUM = ""
export const DISCORD = ""
export const TELEGRAM = ""
export const WECHAT = ""
export const GITHUB = "https://github.com/DELIGHT-LABS/terraswap-web-app"

export const socialMediaList = [
  {
    icon: iconGitHub,
    iconLight: iconGitHubLight,
    href: "https://github.com/terraswap",
    title: "GitHub",
  },
  {
    icon: iconTwitter,
    iconLight: iconTwitterLight,
    href: "https://twitter.com/terraswap_io",
    title: "Twitter",
  },
  {
    icon: iconDiscord,
    iconLight: iconDiscordLight,
    href: "https://discord.gg/nfZgjyjtQq",
    title: "Discord",
  },
  {
    icon: iconDocuments,
    iconLight: iconDocumentsLight,
    href: "https://docs.terraswap.io/",
    title: "Documents",
  },
]
