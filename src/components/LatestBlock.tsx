import { useNetwork } from "hooks"
import React from "react"
import { useQuery } from "react-query"
import useDashboardAPI from "rest/useDashboardAPI"
import styled from "styled-components"

const Wrapper = styled.a`
  width: auto;
  height: auto;
  position: relative;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  &:hover div {
    opacity: 1;
  }
  padding: 10px 30px;
`

const Indicator = styled.div<{ status?: "success" | "error" }>`
  width: 8px;
  height: 8px;
  position: relative;
  display: inline-block;
  background-color: ${({ status }) =>
    status === "error" ? "#f15e7e" : "#08d9b9"};
  border-radius: 50%;
`

const Label = styled.div`
  font-family: OpenSans;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  opacity: 0.6;
`

type LatestBlockProps = {
  currentHeight: number
  isLoading?: boolean
}

const LatestBlock: React.FC<LatestBlockProps> = ({
  currentHeight,
  isLoading,
}) => {
  const { api } = useDashboardAPI()
  const { name } = useNetwork()

  const { data: latestBlockHeight } = useQuery(
    "latestBlockHeight",
    async () => {
      const res = await api.terraswap.getRecent()
      if (res?.daily?.height) {
        return res?.daily?.height
      }
      return 0
    },
    {
      refetchInterval: 3000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: true,
    }
  )
  return (
    <Wrapper
      href={
        latestBlockHeight
          ? `https://finder.terra.money/${name}/blocks/${latestBlockHeight}`
          : "#"
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <Indicator
        status={
          !isLoading &&
          latestBlockHeight &&
          currentHeight < latestBlockHeight - 10
            ? "error"
            : "success"
        }
      />
      <Label>
        {isLoading || !currentHeight
          ? "Loading..."
          : `Latest Block - ${currentHeight}`}
      </Label>
    </Wrapper>
  )
}

export default LatestBlock
