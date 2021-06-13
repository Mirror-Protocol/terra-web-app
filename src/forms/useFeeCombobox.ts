export interface Config {
  value: string
}

export default (config: Config) => {
  const { value } = config

  return {
    asset: value,
  }
}
