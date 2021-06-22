/* Tab */
interface Tab {
  tabs: string[]
  tooltips?: string[]
  current?: string
  onClick?: (tab: string) => void
}

/* Modal */
interface Modal {
  isOpen: boolean
  open: () => void
  close: () => void
}

/* Modules */
interface FormatConfig {
  integer?: boolean
  dp?: number
}

interface FormattedOptions extends FormatConfig {
  children?: string // 0 if undefined
  symbol?: string
  unit?: string
  plus?: boolean // display plus sign if positive
  format?: (current: string) => string
  big?: boolean
  noUnit?: boolean
  noCount?: boolean
  className?: string
}

type AssetSize = "default" | "sm" | "xs" | "lg"

/* icons */
type IconNames =
  | "ArrowDown"
  | "ArrowRightCircleSolid"
  | "Borrow"
  | "Chart"
  | "Chat"
  | "Check"
  | "CheckDouble"
  | "ChevronDown"
  | "ChevronDownThin"
  | "ChevronRight"
  | "ChevronUp"
  | "ChevronUpThin"
  | "Claim"
  | "Clock"
  | "Close"
  | "CloseCircleSolid"
  | "CloseCircleSolidBlue"
  | "Completed"
  | "Desktop"
  | "Discord"
  | "Docs"
  | "DownSolid"
  | "Download"
  | "ExclamationCircle"
  | "ExclamationCircleSolid"
  | "ExclamationTriangleSolid"
  | "External"
  | "Farm"
  | "Github"
  | "Governance"
  | "GridViewSolid"
  | "InfoCircle"
  | "ListView"
  | "Medium"
  | "Mirror"
  | "Mobile"
  | "Mode"
  | "MoreCircle"
  | "MyPage"
  | "Plus"
  | "Poll"
  | "PollSolid"
  | "Search"
  | "Send"
  | "Settings"
  | "Telegram"
  | "Trade"
  | "Twitter"
  | "UpSolid"
  | "VerifiedSolid"
  | "Wallet"
