import Token from "images/Token/Token.svg"
import { tokenInfos } from "rest/usePairs"

import {
  AUT,
  CAT,
  CHT,
  CNT,
  EUT,
  GBT,
  HKT,
  INT,
  JPT,
  KRT,
  LUNA,
  MNT,
  SDT,
  SGT,
  THT,
  UAUD,
  UCAD,
  UCHF,
  UCNY,
  UEUR,
  UGBP,
  UHKD,
  UINR,
  UJPY,
  UKRW,
  ULUNA,
  UMNT,
  USDR,
  USGD,
  UST,
  UTHB,
  UUSD,
} from "../constants/constants"

export const getSymbol = (key: string) => {
  switch (key) {
    case LUNA:
      return ULUNA
    case KRT:
      return UKRW
    case SDT:
      return USDR
    case MNT:
      return UMNT
    case UST:
      return UUSD
    case AUT:
      return UAUD
    case CAT:
      return UCAD
    case CHT:
      return UCHF
    case CNT:
      return UCNY
    case EUT:
      return UEUR
    case GBT:
      return UGBP
    case HKT:
      return UHKD
    case INT:
      return UINR
    case JPT:
      return UJPY
    case SGT:
      return USGD
    case THT:
      return UTHB
    default:
      return ""
  }
}

export const hasTaxToken = (contract_addr: string) => {
  if (contract_addr === ULUNA || contract_addr.startsWith("terra")) {
    return false
  }

  return true
}

export const GetTokenSvg = (icon: string, symbol: string) => {
  if (icon && icon !== "") {
    return icon
  }

  const denom = getSymbol(symbol)
  const tokenInfo = tokenInfos.get(denom)
  if (tokenInfo && tokenInfo.icon !== "") {
    return tokenInfo.icon
  }

  return Token
}
