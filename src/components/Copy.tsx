import React, { useState, useCallback, useRef } from "react"
import styled, { css } from "styled-components"

import iconCopy from "images/icon-copy.svg"
import iconOk from "images/icon-ok.svg"

type CopyProps = {
  size?: number
  value?: string
}

const Wrapper = styled.button<CopyProps & { isCopied?: boolean }>`
  ${({ size }) => css`
    width: ${size || 20}px;
    height: ${size || 20}px;
  `}
  position: relative;
  border: none;
  padding: 0;
  margin: 0;
  display: inline-block;
  background-color: transparent;
  cursor: pointer;
  vertical-align: middle;
  overflow: visible;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    transition: transform 0.125s ease-in-out, opacity 0.125s ease-in-out;
    /* transform: translateY(${({ isCopied }) =>
      isCopied ? "-100%" : "0"}); */
  }

  &::before {
    background-image: url(${iconCopy});
    top: 0;
    transform: scale(${({ isCopied }) => (isCopied ? 0 : 1)});
    opacity: ${({ isCopied }) => (isCopied ? 0 : 1)};
  }
  &::after {
    background-image: url(${iconOk});
    top: 0;
    transform: scale(${({ isCopied }) => (isCopied ? 1 : 2)});
    opacity: ${({ isCopied }) => (isCopied ? 1 : 0)};
  }

  & > textarea {
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
    border: none;
    padding: 0;
    margin: 0;
    opacity: 0;
  }
`

const Copy: React.FC<CopyProps> = ({ value, ...props }) => {
  const [isCopied, setIsCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleClick = useCallback(() => {
    if (timer?.current) {
      clearTimeout(timer.current)
    }
    setIsCopied(true)
    if (navigator?.clipboard?.writeText) {
      navigator?.clipboard?.writeText(inputRef?.current?.innerHTML || "")
    } else {
      inputRef?.current?.focus()
      inputRef?.current?.select()
      document.execCommand("copy")
    }

    timer.current = setTimeout(() => {
      setIsCopied(false)
    }, 1200)
  }, [])
  return (
    <Wrapper {...props} isCopied={isCopied} onClick={handleClick}>
      <textarea ref={inputRef} value={value} readOnly />
    </Wrapper>
  )
}

export default Copy
