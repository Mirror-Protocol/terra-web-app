import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  width: auto;
  height: auto;
  position: relative;
  display: inline-block;
`

const InputElement = styled.input`
  padding: 6px 16px;
  margin: 0;
  border: 1px solid #0222ba;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;

  &:focus,
  &:required:valid {
    & + div {
      opacity: 0;
    }
  }
`

InputElement.defaultProps = { required: true }

const Placeholder = styled.div`
  color: #0222ba;
  opacity: 0.3;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  pointer-events: none;
  transition: opacity 50ms ease-in-out;
`

type InputProps = Partial<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>

const Input: React.FC<InputProps> = ({ placeholder, ...props }) => {
  return (
    <Wrapper>
      <InputElement {...(props as any)} />
      {placeholder && <Placeholder>{placeholder}</Placeholder>}
    </Wrapper>
  )
}

export default Input
