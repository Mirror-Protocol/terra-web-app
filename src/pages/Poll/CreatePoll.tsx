import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import Container from "../../components/Container"
import Grid from "../../components/Grid"
import List from "../../components/List"
import CreatePollForm from "../../forms/CreatePollForm"
import ForumLink from "./ForumLink"
import styles from "./CreatePoll.module.scss"

export enum PollType {
  TEXT = "TEXT",
  TEXT_PREIPO = "TEXT-PREIPO",
  TEXT_WHITELIST = "TEXT-WHITELIST",
  WHITELIST = "WHITELIST",
  PREIPO = "PREIPO",
  DELIST = "DELIST",
  INFLATION = "INFLATION",
  MINT_UPDATE = "MINT-UPDATE",
  GOV_UPDATE = "GOV-UPDATE",
  COLLATERAL = "COLLATERAL",
  COMMUNITY_SPEND = "COMMUNITY-SPEND",
}

const Groups = [
  {
    title: "Suggestions",
    items: [
      PollType.TEXT,
      PollType.TEXT_WHITELIST,
      PollType.TEXT_PREIPO,
      PollType.COMMUNITY_SPEND,
    ],
  },
  {
    title: "Asset Listing",
    items: [PollType.WHITELIST, PollType.PREIPO, PollType.DELIST],
  },
  {
    title: "Reward Distribution Ratio",
    items: [PollType.INFLATION],
  },
  {
    title: "Parameters",
    items: [PollType.MINT_UPDATE, PollType.GOV_UPDATE, PollType.COLLATERAL],
  },
]

const polls: Record<PollType, { title: string; desc: string }> = {
  [PollType.TEXT]: {
    title: "Submit text poll",
    desc: "Upload a text poll",
  },
  [PollType.TEXT_WHITELIST]: {
    title: "Whitelist a new mAsset",
    desc: "Submit a poll to whitelist a new mAsset",
  },
  [PollType.TEXT_PREIPO]: {
    title: "Whitelist a Pre-IPO mAsset",
    desc: "Submit a poll to whitelist a new Pre-IPO asset",
  },
  [PollType.WHITELIST]: {
    title: "Register whitelist parameters",
    desc: "Register the parameters for a newly whitelisted mAsset",
  },
  [PollType.PREIPO]: {
    title: "Register Pre-IPO parameters",
    desc: "Register the parameters for an asset scheduled to be offered publicly",
  },
  [PollType.DELIST]: {
    title: "Delist mAsset",
    desc: "Vote for an mAsset to be delisted from Mirror Protocol",
  },
  [PollType.INFLATION]: {
    title: "Modify weight parameter",
    desc: "Modify reward distribution parameter of an existing mAsset",
  },
  [PollType.MINT_UPDATE]: {
    title: "Modify mint parameters",
    desc: "Modify the mint parameters of an existing mAsset",
  },
  [PollType.GOV_UPDATE]: {
    title: "Modify governance parameters",
    desc: "Modify the governance parameters",
  },
  [PollType.COLLATERAL]: {
    title: "Modify collateral parameters",
    desc: "Change the multiplier of a collateral type",
  },
  [PollType.COMMUNITY_SPEND]: {
    title: "Spend community pool",
    desc: "Submit community pool spending poll",
  },
}

const CreatePoll = () => {
  const { hash: type } = useHash<PollType>(PollType.TEXT)

  return (
    <Page>
      <Container>
        <ForumLink />

        <Grid>
          <section className={styles.nav}>
            <List
              groups={Groups.map(({ title, items }) => ({
                title,
                items: items.map((key) => ({
                  label: polls[key].title,
                  to: { hash: key },
                })),
              }))}
            />
          </section>

          {type && (
            <CreatePollForm headings={polls[type]} type={type} key={type} />
          )}
        </Grid>
      </Container>
    </Page>
  )
}

export default CreatePoll
