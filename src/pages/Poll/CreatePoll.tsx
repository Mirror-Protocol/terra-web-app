import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import Container from "../../components/Container"
import Card from "../../components/Card"
import CreatePollForm from "../../forms/CreatePollForm"
import { MenuKey } from "../Gov"
import ForumLink from "./ForumLink"
import CreatePollButton from "./CreatePollButton"
import styles from "./CreatePoll.module.scss"

export enum Type {
  "TEXT" = "TEXT",
  "TEXT_WHITELIST" = "TEXT_WHITELIST",
  "WHITELIST" = "WHITELIST",
  "INFLATION" = "INFLATION",
  "MINT_UPDATE" = "MINT_UPDATE",
  "GOV_UPDATE" = "GOV_UPDATE",
  "COMMUNITY_SPEND" = "COMMUNITY_SPEND",
}

const TITLE = "Choose a poll"
const Buttons = {
  [Type.TEXT]: {
    title: "Submit text poll",
    desc: "Upload a text poll",
  },
  [Type.TEXT_WHITELIST]: {
    title: "Whitelist a new mAsset",
    desc: "Submit a poll to whitelist a new mAsset",
  },
  [Type.WHITELIST]: {
    title: "Register whitelist parameters",
    desc: "Register the parameters for a newly whitelisted mAsset",
  },
  [Type.INFLATION]: {
    title: "Modify weight parameter",
    desc: "Modify reward distribution parameter of an existing mAsset",
  },
  [Type.MINT_UPDATE]: {
    title: "Modify mint parameters",
    desc: "Modify the mint parameters of an existing mAsset",
  },
  [Type.GOV_UPDATE]: {
    title: "Modify governance parameters",
    desc: "Modify the governance parameters",
  },
  [Type.COMMUNITY_SPEND]: {
    title: "Spend community pool",
    desc: "Submit community pool spending poll",
  },
}

const CreatePoll = () => {
  const { hash: type } = useHash<Type>()

  return (
    <Page title={!type ? MenuKey.CREATE : Buttons[type].title}>
      {!type ? (
        <Container sm>
          <ForumLink />

          <Card lg>
            <header className={styles.header}>
              <h1 className={styles.title}>{TITLE}</h1>
            </header>

            {Object.entries(Buttons).map(([key, item]) => (
              <CreatePollButton {...item} hash={key} key={key} />
            ))}
          </Card>
        </Container>
      ) : (
        <CreatePollForm type={type} key={type} />
      )}
    </Page>
  )
}

export default CreatePoll
