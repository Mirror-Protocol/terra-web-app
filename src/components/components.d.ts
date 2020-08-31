interface Content {
  title?: ReactNode
  content?: ReactNode
}

/* Header */
interface MenuItem {
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
  type?: 1 | 2
  skipFeedback?: boolean
}

/* Buttons */
interface ButtonProps {
  /** xs: 22px; sm: 26px; md: 36px; lg: 50px */
  size?: "xs" | "sm" | "md" | "lg"
  color?: string
  outline?: boolean
  block?: boolean

  loading?: boolean
  submit?: boolean

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
  shadow?: boolean
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
  /** Plus on positive */
  plus?: boolean
  /** Custom formatter */
  format?: (current: string) => string
}

interface Confirm {
  contents?: Content[]
  warning?: string
}

interface AssetItem {
  symbol: string
  token: string
  name: string
  price?: string
  balance?: string
}
