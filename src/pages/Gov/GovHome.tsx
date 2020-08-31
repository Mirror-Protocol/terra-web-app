import { useRouteMatch } from "react-router-dom"
import { MenuKey } from "../../routes"
import Page from "../../components/Page"
import LinkButton from "../../components/LinkButton"
import Polls from "../Poll/Polls"
import { menu, MenuKey as GovMenuKey } from "../Gov"
import GovHomeHeader from "./GovHomeHeader"

const GovHome = () => {
  const { url } = useRouteMatch()
  const link = {
    to: url + menu[GovMenuKey.CREATE].path,
    children: GovMenuKey.CREATE,
    outline: true,
  }

  return (
    <Page title={MenuKey.GOV} action={<LinkButton {...link} />} noBreak>
      <GovHomeHeader />
      <Polls title="Polls" />
    </Page>
  )
}

export default GovHome
