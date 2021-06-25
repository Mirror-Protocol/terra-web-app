import { useRecoilValue } from "recoil"
import { useParams, useRouteMatch } from "react-router-dom"
import { govStakerQuery } from "../../data/contract/contract"
import { Submit } from "../../components/Button"
import LinkButton from "../../components/LinkButton"

const VoteLink = ({ id, end_time }: Poll) => {
  const { url } = useRouteMatch()
  const params = useParams<{ id: string }>()
  const govStaker = useRecoilValue(govStakerQuery)

  const alreadyVoted = govStaker?.locked_balance.some(
    ([lockedId]: LockedBalance) => id === lockedId
  )

  const end = end_time * 1000 < Date.now()

  return params.id && !end ? (
    <Submit>
      <LinkButton to={url + "/vote"} disabled={alreadyVoted}>
        {alreadyVoted ? "Voted" : "Vote"}
      </LinkButton>
    </Submit>
  ) : null
}

export default VoteLink
