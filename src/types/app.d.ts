interface Result {
  loading: boolean
  error?: Error
  data?: any
}

interface Content {
  title?: ReactNode
  content?: ReactNode
}

interface Dict<T = string> {
  [token: string]: T
}
