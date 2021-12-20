import { formatMoney } from "libs/parse"
import React from "react"
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
  padding: 13px 30px;
  display: flex;
  justify-content: space-between;
  border-radius: 15px;
  align-items: center;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
  }
`

const SummaryItem = styled.div.attrs<SummaryItemProps>({})<SummaryItemProps>`
  width: auto;
  height: auto;
  display: inline-block;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    margin-bottom: 8px;
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
  return (
    <Wrapper>
      {data.map((item) => (
        <SummaryItem {...item} key={item.label}>
          <label>{item.label}:</label>
          <span>
            ${formatMoney(Number(item.value)) || Number(item.value).toFixed(2)}
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
    </Wrapper>
  )
}

export default Summary
