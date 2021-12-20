import React from "react"
import styled, { css } from "styled-components"
import { NavLink as navLink } from "react-router-dom"

import iconMenu from "images/icon-menu.svg"
import iconClose from "images/icon-close-primary.svg"
import { useModal } from "components/Modal"

const Wrapper = styled.div<{ isOpen: boolean }>`
  width: 100%;
  height: auto;
  position: relative;
  flex: 1;
  max-width: 150px;

  & > div {
    max-width: 150px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    width: 100vw;
    height: 100vh;
    top: -200vh;
    left: 0;
    position: fixed;
    max-width: unset;
    z-index: 5500;
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out,
      top 0.2s step-end;
    background-color: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.primary};
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    transform: scale(1.4);
    opacity: 0;

    ${({ isOpen }) =>
      isOpen &&
      css`
        top: 0;
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out,
          top 0.2s step-start;
      `}
  }
`

const NavLink = styled(navLink)`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  padding: 12px 0;
  color: ${({ theme }) => theme.white};
  opacity: 0.5;
  align-items: center;
  justify-content: flex-start;
  column-gap: 20px;

  &::after {
    width: 100%;
    flex: 1;
    content: "";
    display: inline-block;
    height: 2px;
    background-color: ${({ theme }) => theme.white};
    max-width: 0%;
    transition: max-width 0.2s ease-in-out;
  }
  &.active {
    font-weight: 700;
    opacity: 1;
    &::after {
      max-width: 100%;
    }
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    color: ${({ theme }) => theme.primary};
    font-size: 26px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    justify-content: center;
    &::after {
      content: unset;
    }
  }
`

const MobileButton = styled.button<{ isOpen: boolean }>`
  display: none;
  width: 32px;
  height: 32px;
  position: fixed;
  z-index: 5550;
  top: 16px;
  right: 16px;
  background-image: url("${({ isOpen }) => (isOpen ? iconClose : iconMenu)}");
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
  }
`

const Sidebar = () => {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <MobileButton
        isOpen={isOpen}
        onClick={() => (!isOpen ? open() : close())}
      />
      <Wrapper isOpen={isOpen}>
        <div>
          <NavLink
            to="/dashboard"
            exact
            isActive={(match, location) => {
              return location.pathname?.includes("/pairs") ||
                location.pathname?.includes("/dashboard")
                ? true
                : false
            }}
            onClick={() => close()}
          >
            Dashboard
          </NavLink>
          <NavLink to="/" exact onClick={() => close()}>
            Swap
          </NavLink>
        </div>
      </Wrapper>
    </>
  )
}

export default Sidebar
