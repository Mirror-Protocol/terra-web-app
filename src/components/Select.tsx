import React from "react"
import styled from "styled-components"

import iconClosed from "images/icon-dropdown-closed.svg"

const Wrapper = styled.div`
  width: auto;
  height: auto;
  position: relative;
  display: inline-block;

  &,
  & * {
    box-sizing: border-box;
  }

  &::after {
    content: "";

    width: 24px;
    height: 100%;

    position: absolute;

    right: 4px;
    top: 0;

    transform: rotate(360deg);
    transition: transform 0.05s ease-in-out;
    transform-origin: center;

    background-image: url(${iconClosed});
    background-position: 50% 50%;
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
  }
  /* &:focus-within::after {
    transform: rotate(180deg);
  } */
`

const SelectElement = styled.select`
  width: auto;
  height: auto;
  min-height: 24px;
  padding: 5px 10px;
  padding-right: 29px;
  margin: 0;
  border: solid 1px #0222ba;
  border-radius: 8px;

  font-family: OpenSans;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #0222ba;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &::-ms-expand {
    display: none;
  }

  & > option {
    display: block;
    padding: 5px 10px;
    text-align: left;
  }
`

type SelectProps = Partial<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
>

const Select: React.FC<SelectProps> = (props) => {
  return (
    <Wrapper>
      <SelectElement {...(props as any)} />
    </Wrapper>
  )
}

export default Select
