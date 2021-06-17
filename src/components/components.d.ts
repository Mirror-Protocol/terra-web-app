interface Content {
  title?: ReactNode
  content?: ReactNode
}

/* Header */
interface MenuItem {
  icon: IconNames
  attrs: { to: string; children: string }
  desktopOnly?: boolean
}

/* Forms */
type Values<T> = Record<T, string>
type Touched<T> = Record<T, boolean>

type Input = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type TextArea = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

type Select = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

interface FormGroup {
  prev?: string
  input?: Input
  textarea?: TextArea
  select?: Select
  value?: ReactNode
  label?: ReactNode
  help?: Content
  unit?: ReactNode
  max?: () => void
  assets?: ReactNode
  focused?: boolean
  error?: string
  warn?: ReactNode
  info?: ReactNode
  type?: 1 | 2 | 3
  size?: "default" | "sm" | "xs"
  skipFeedback?: boolean
  unitAfterValue?: boolean
}

/* Buttons */
interface ButtonProps {
  /** xs: 22px; sm: 26px; md: 36px; lg: 50px */
  size?: "xs" | "sm" | "md" | "lg"
  color?: string
  outline?: boolean
  block?: boolean

  loading?: boolean

  disabled?: boolean
  className?: string
  children?: ReactNode
}

type ButtonAttrs = ButtonHTMLAttributes<HTMLButtonElement>
type Button = ButtonProps & ButtonAttrs

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

interface CountOptions extends FormatConfig {
  /** 0 if undefined */
  children?: string
  /** As a unit. */
  symbol?: string
  unit?: string
  /** Plus on positive */
  plus?: boolean
  /** Custom formatter */
  format?: (current: string) => string
}

interface Confirm {
  contents?: Content[]
  warning?: string
}

interface AssetItemProps extends DefaultListedItem {
  name?: string
  status?: ListedItemStatus
  price?: string
  balance?: string
}

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
