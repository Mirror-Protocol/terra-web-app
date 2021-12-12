import React from "react"
import styled from "styled-components"

type ListProps = {
  type?: "ordered" | "unordered"
  data: React.ReactNode[]
}

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Item = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  color: #0222ba;
  font-size: 14px;

  &:hover {
    font-weight: 700;
    cursor: pointer;
  }
`

const List: React.FC<ListProps> = ({ data, type = "ordered" }) => {
  return (
    <Wrapper>
      {data?.map((item, index) => (
        <Item key={index}>
          {type === "ordered" ? <span>{index + 1}.</span> : <span>●</span>}
          {item}
        </Item>
      ))}
    </Wrapper>
  )
}

export default List
