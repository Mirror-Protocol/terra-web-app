interface Result {
  loading: boolean
  error?: Error
  data?: any
}

interface Dict<T = string> {
  [token: string]: T
}
