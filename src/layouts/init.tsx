import { useWallet } from "@terra-money/wallet-provider"

export const useRedirectByNetwork = () => {
  const PRODUCTION = "terra.mirror.finance"
  const DEVELOP = "terra-dev.mirror.finance"

  const { network } = useWallet()

  const domain = network.name === "mainnet" ? PRODUCTION : DEVELOP
  const current = window.location.hostname

  const shouldCheck =
    process.env.NODE_ENV !== "development" &&
    [PRODUCTION, DEVELOP].includes(current)

  const redirectTo =
    shouldCheck && current !== domain ? "https://" + domain : undefined

  redirectTo && window.location.assign(redirectTo)
}
