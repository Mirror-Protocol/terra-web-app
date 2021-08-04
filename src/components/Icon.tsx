import { ReactComponent as ArrowDown } from "../styles/icons/ArrowDown.svg"
import { ReactComponent as ArrowRightCircleSolid } from "../styles/icons/ArrowRightCircleSolid.svg"
import { ReactComponent as Borrow } from "../styles/icons/Borrow.svg"
import { ReactComponent as Chart } from "../styles/icons/Chart.svg"
import { ReactComponent as Chat } from "../styles/icons/Chat.svg"
import { ReactComponent as Check } from "../styles/icons/Check.svg"
import { ReactComponent as CheckDouble } from "../styles/icons/CheckDouble.svg"
import { ReactComponent as ChevronDown } from "../styles/icons/ChevronDown.svg"
import { ReactComponent as ChevronDownThin } from "../styles/icons/ChevronDownThin.svg"
import { ReactComponent as ChevronRight } from "../styles/icons/ChevronRight.svg"
import { ReactComponent as ChevronUp } from "../styles/icons/ChevronUp.svg"
import { ReactComponent as ChevronUpThin } from "../styles/icons/ChevronUpThin.svg"
import { ReactComponent as Claim } from "../styles/icons/Claim.svg"
import { ReactComponent as Clock } from "../styles/icons/Clock.svg"
import { ReactComponent as Close } from "../styles/icons/Close.svg"
import { ReactComponent as CloseCircleSolid } from "../styles/icons/CloseCircleSolid.svg"
import { ReactComponent as CloseCircleSolidBlue } from "../styles/icons/CloseCircleSolidBlue.svg"
import { ReactComponent as Completed } from "../styles/icons/Completed.svg"
import { ReactComponent as Desktop } from "../styles/icons/Desktop.svg"
import { ReactComponent as Discord } from "../styles/icons/Discord.svg"
import { ReactComponent as Docs } from "../styles/icons/Docs.svg"
import { ReactComponent as DownSolid } from "../styles/icons/DownSolid.svg"
import { ReactComponent as Download } from "../styles/icons/Download.svg"
import { ReactComponent as ExclamationCircle } from "../styles/icons/ExclamationCircle.svg"
import { ReactComponent as ExclamationCircleSolid } from "../styles/icons/ExclamationCircleSolid.svg"
import { ReactComponent as ExclamationTriangleSolid } from "../styles/icons/ExclamationTriangleSolid.svg"
import { ReactComponent as External } from "../styles/icons/External.svg"
import { ReactComponent as Farm } from "../styles/icons/Farm.svg"
import { ReactComponent as Github } from "../styles/icons/Github.svg"
import { ReactComponent as Governance } from "../styles/icons/Governance.svg"
import { ReactComponent as GridViewSolid } from "../styles/icons/GridViewSolid.svg"
import { ReactComponent as Guard } from "../styles/icons/Guard.svg"
import { ReactComponent as InfoCircle } from "../styles/icons/InfoCircle.svg"
import { ReactComponent as ListView } from "../styles/icons/ListView.svg"
import { ReactComponent as Medium } from "../styles/icons/Medium.svg"
import { ReactComponent as Mirror } from "../styles/icons/Mirror.svg"
import { ReactComponent as Mobile } from "../styles/icons/Mobile.svg"
import { ReactComponent as Mode } from "../styles/icons/Mode.svg"
import { ReactComponent as MoreCircle } from "../styles/icons/MoreCircle.svg"
import { ReactComponent as MyPage } from "../styles/icons/MyPage.svg"
import { ReactComponent as Plus } from "../styles/icons/Plus.svg"
import { ReactComponent as Poll } from "../styles/icons/Poll.svg"
import { ReactComponent as PollSolid } from "../styles/icons/PollSolid.svg"
import { ReactComponent as Search } from "../styles/icons/Search.svg"
import { ReactComponent as Send } from "../styles/icons/Send.svg"
import { ReactComponent as Settings } from "../styles/icons/Settings.svg"
import { ReactComponent as Telegram } from "../styles/icons/Telegram.svg"
import { ReactComponent as Trade } from "../styles/icons/Trade.svg"
import { ReactComponent as Twitter } from "../styles/icons/Twitter.svg"
import { ReactComponent as UpSolid } from "../styles/icons/UpSolid.svg"
import { ReactComponent as VerifiedSolid } from "../styles/icons/VerifiedSolid.svg"
import { ReactComponent as Wallet } from "../styles/icons/Wallet.svg"

interface Props {
  name: IconNames
  size?: number
  className?: string
}

const Icon = ({ name, size = 16, className }: Props) => {
  const props = { width: size, height: size, className }

  return {
    ArrowDown: <ArrowDown {...props} />,
    ArrowRightCircleSolid: <ArrowRightCircleSolid {...props} />,
    Borrow: <Borrow {...props} />,
    Chart: <Chart {...props} />,
    Chat: <Chat {...props} />,
    Check: <Check {...props} />,
    CheckDouble: <CheckDouble {...props} />,
    ChevronDown: <ChevronDown {...props} />,
    ChevronDownThin: <ChevronDownThin {...props} />,
    ChevronRight: <ChevronRight {...props} />,
    ChevronUp: <ChevronUp {...props} />,
    ChevronUpThin: <ChevronUpThin {...props} />,
    Claim: <Claim {...props} />,
    Clock: <Clock {...props} />,
    Close: <Close {...props} />,
    CloseCircleSolid: <CloseCircleSolid {...props} />,
    CloseCircleSolidBlue: <CloseCircleSolidBlue {...props} />,
    Completed: <Completed {...props} />,
    Desktop: <Desktop {...props} />,
    Discord: <Discord {...props} />,
    Docs: <Docs {...props} />,
    DownSolid: <DownSolid {...props} />,
    Download: <Download {...props} />,
    ExclamationCircle: <ExclamationCircle {...props} />,
    ExclamationCircleSolid: <ExclamationCircleSolid {...props} />,
    ExclamationTriangleSolid: <ExclamationTriangleSolid {...props} />,
    External: <External {...props} />,
    Farm: <Farm {...props} />,
    Github: <Github {...props} />,
    Governance: <Governance {...props} />,
    GridViewSolid: <GridViewSolid {...props} />,
    Guard: <Guard {...props} />,
    InfoCircle: <InfoCircle {...props} />,
    ListView: <ListView {...props} />,
    Medium: <Medium {...props} />,
    Mirror: <Mirror {...props} />,
    Mobile: <Mobile {...props} />,
    Mode: <Mode {...props} />,
    MoreCircle: <MoreCircle {...props} />,
    MyPage: <MyPage {...props} />,
    Plus: <Plus {...props} />,
    Poll: <Poll {...props} />,
    PollSolid: <PollSolid {...props} />,
    Search: <Search {...props} />,
    Send: <Send {...props} />,
    Settings: <Settings {...props} />,
    Telegram: <Telegram {...props} />,
    Trade: <Trade {...props} />,
    Twitter: <Twitter {...props} />,
    UpSolid: <UpSolid {...props} />,
    VerifiedSolid: <VerifiedSolid {...props} />,
    Wallet: <Wallet {...props} />,
  }[name]
}

export default Icon
