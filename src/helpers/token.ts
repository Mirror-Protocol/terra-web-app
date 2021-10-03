import Token from "images/Token/Token.svg"
import SvgLuna from "images/Token/Luna.svg"
import SvgKST from "images/Token/KST.svg"
import SvgMNT from "images/Token/MNT.svg"
import SvgSDT from "images/Token/SDT.svg"
import SvgUST from "images/Token/UST.svg"
import PngAUT from "images/Token/AUT.png"
import PngCAT from "images/Token/CAT.png"
import PngCHT from "images/Token/CHT.png"
import PngCNT from "images/Token/CNT.png"
import PngEUT from "images/Token/EUT.png"
import PngGBT from "images/Token/GBT.png"
import PngHKT from "images/Token/HKT.png"
import PngINT from "images/Token/INT.png"
import PngJPT from "images/Token/JPT.png"
import PngSGT from "images/Token/SGT.png"
import PngTHT from "images/Token/THT.png"

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

export const hasTaxToken = (symbol: string) => {
  switch (symbol) {
    case UKRW:
    case USDR:
    case UMNT:
    case UUSD:
    case UAUD:
    case UCAD:
    case UCHF:
    case UCNY:
    case UEUR:
    case UGBP:
    case UHKD:
    case UINR:
    case UJPY:
    case USGD:
    case UTHB:
      return true
    default:
      return false
  }
}

export const GetTokenSvg = (symbol: string) => {
  let res = Token
  switch (symbol) {
    case LUNA:
      res = SvgLuna
      break
    case KRT:
      res = SvgKST
      break
    case MNT:
      res = SvgMNT
      break
    case SDT:
      res = SvgSDT
      break
    case UST:
      res = SvgUST
      break
    case AUT:
      res = PngAUT
      break
    case CAT:
      res = PngCAT
      break
    case CHT:
      res = PngCHT
      break
    case CNT:
      res = PngCNT
      break
    case EUT:
      res = PngEUT
      break
    case GBT:
      res = PngGBT
      break
    case HKT:
      res = PngHKT
      break
    case INT:
      res = PngINT
      break
    case JPT:
      res = PngJPT
      break
    case SGT:
      res = PngSGT
      break
    case THT:
      res = PngTHT
      break
    default:
      // Load dynamically
      // TODO: it will move backend
      switch (symbol) {
        case "MIR":
        case "mAAPL":
        case "mAMC":
        case "mAMZN":
        case "mBABA":
        case "mGME":
        case "mGOOGL":
        case "mIAU":
        case "mMSFT":
        case "mNFLX":
        case "mQQQ":
        case "mSLV":
        case "mTSLA":
        case "mTWTR":
        case "mUSO":
        case "mVIXY":
        case "mSPY":
          res = "/images/CW20/" + symbol + ".svg"
          break
        case "mBTC":
        case "mABNB":
        case "mFB":
        case "mGS":
        case "mETH":
        case "ANC":
        case "bLUNA":
        case "mCOIN":
        case "mGLXY":
        case "MINE":
        case "LOTA":
        case "SPEC":
        case "mARKK":
        case "mDOT":
        case "mSQ":
        case "mAMD":
        case "bETH":
        case "ALTE":
        case "mHOOD":
        case "DPH":
        case "LOOP":
        case "LOOPR":
        case "STT":
        case "AGB":
        case "TWD":
        case "MIAW":
          res = "/images/CW20/" + symbol + ".png"
          break
        default:
          break
      }
      break
  }

  return res
}
