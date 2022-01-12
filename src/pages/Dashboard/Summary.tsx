import React, { useEffect, useState } from "react"
import { formatMoney } from "libs/parse"
import styled from "styled-components"

type SummaryItemProps = {
  label: string
  value: string
  variation?: number
}

type SummaryProps = { data: SummaryItemProps[] }

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  background-color: #ffffff24;
  border-radius: 15px;
  overflow: hidden;
  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    height: 48px;
    padding: 0;
  }
`

const SummaryList = styled.div`
  position: relative;
  display: block;

  padding: 13px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: top 0.2s ease-in-out;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    height: 48px;
    padding: 0;
  }
`

const SummaryItem = styled.div.attrs<SummaryItemProps>({})<SummaryItemProps>`
  width: auto;
  height: auto;
  display: inline-block;
  position: relative;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    padding: 13px 30px;
  }

  & label {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    display: inline-block;
    margin-right: 13px;
  }

  & span {
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }

  & .variation {
    color: ${({ variation }) => ((variation || 0) > 0 ? "#08d9b9" : "#f15e7e")};
  }
`

const Summary: React.FC<SummaryProps> = ({ data }) => {
  const [currentShownIndex, setCurrentShownIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const count = data.length

      setCurrentShownIndex((current) => {
        current += 1
        return current >= count ? 0 : current
      })
    }, 3000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [data])

  return (
    <Wrapper>
      <SummaryList style={{ top: `-${currentShownIndex * 100}%` }}>
        {data.map((item) => (
          <SummaryItem {...item} key={item.label}>
            <label>{item.label}:</label>
            <span>
              $
              {formatMoney(Number(item.value)) || Number(item.value).toFixed(2)}
            </span>
            {typeof item.variation === "number" && (
              <span>
                &nbsp;(
                <span className="variation">
                  {item.variation > 0 && "↑"}
                  {item.variation < 0 && "↓"}
                  {Math.abs(item.variation)}%
                </span>
                )
              </span>
            )}
          </SummaryItem>
        ))}
      </SummaryList>
    </Wrapper>
  )
}

export default Summary
