import React from "react"
import styled, { css } from "styled-components"

import iconChecked from "images/icon-checked.svg"

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  block?: boolean
}

const Wrapper = styled.label<CheckboxProps>`
  width: auto;
  height: auto;
  position: relative;
  user-select: none;
  cursor: pointer;
  align-items: center;

  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #5c5c5c;

  gap: 6px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    gap: 10px;
  }

  ${({ block }) =>
    block
      ? css`
          display: flex;
          justify-content: space-between;
        `
      : css`
          display: inline-flex;
          justify-content: flex-start;
        `}

  & > input {
    width: 0%;
    height: 0%;
    position: absolute;
    left: -1px;
    top: -1px;
    opacity: 0;

    & + span {
      width: auto;
      height: auto;
      position: relative;
      vertical-align: middle;
      display: inline-block;
      font-size: 0;
    }
  }

  & > span::before {
    content: "";
    width: 20px;
    height: 20px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    background-position: -100px -100px;
    background-size: 14px auto;
    background-repeat: no-repeat;
    border-radius: 4px;
    border: solid 2px #707070;
    background-color: #fff;
    background-image: url(${iconChecked});
  }

  & > input:checked + span::before {
    background-position: 50% 50%;
  }
`

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, block, ...props }, forwardedRef) => {
    return (
      <Wrapper block={block}>
        <input {...props} ref={forwardedRef} />
        <span />
        <div>{children ? children : props.value}</div>
      </Wrapper>
    )
  }
)

Checkbox.defaultProps = {
  type: "checkbox",
}

export default Checkbox
