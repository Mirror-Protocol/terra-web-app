import React from "react"
import styled, { css } from "styled-components"
import { NavLink as navLink, useLocation } from "react-router-dom"
import { useModal } from "components/Modal"

import iconMenu from "images/icon-menu.svg"
import iconClose from "images/icon-close-primary.svg"
import { socialMediaList } from "constants/constants"
import SocialMediaAnchor from "components/SocialMediaAnchor"
import ChangeVersionButton from "components/ChangeVersionButton"
import useMigration from "hooks/useMigration"

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
        top: 40px;
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

const MobileButton = styled.button<{ isOpen?: boolean }>`
  display: none;
  width: 32px;
  height: 32px;
  position: fixed;
  z-index: 5550;
  top: 56px;
  right: 16px;
  background-image: url("${({ isOpen }) => (isOpen ? iconClose : iconMenu)}");
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
  }
`

const SocialMediaList = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  height: auto;
  position: fixed;
  bottom: 50px;
  display: flex;
  gap: 8px;
  align-items: center;

  & > div {
    max-width: 150px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    gap: 24px;
    z-index: -1;
    left: 0;
    bottom: -48px;
    justify-content: center;
    opacity: 0;
    transition-delay: 0s;

    & > a {
      opacity: 0;
      transition: opacity 0.125s ease-in-out, transform 0.125s ease-in-out;
      transform: translateY(72px);
    }

    ${({ isOpen }) =>
      isOpen &&
      css`
        z-index: 5560;
        opacity: 1;
        transition-delay: 0.25s;
        bottom: 48px;

        & > a {
          opacity: 1;
          transform: translateY(0);
        }
      `}
  }
`

const Sidebar = () => {
  const { isMigrationPage } = useMigration()
  const { isOpen, open, close } = useModal()
  const location = useLocation()

  return (
    <>
      <MobileButton
        isOpen={isOpen}
        onClick={() => (!isOpen ? open() : close())}
      />
      <Wrapper isOpen={isOpen}>
        {isMigrationPage ? (
          <div>
            <NavLink
              to="/migration"
              className={
                location.pathname?.includes("/migration") ? "active" : ""
              }
              onClick={(event) => {
                event.preventDefault()
                close()
              }}
            >
              Migration
            </NavLink>
            <div style={{ height: 25 }} />
            <ChangeVersionButton href="/" buttonText="Go to Classic" />
          </div>
        ) : (
          <div>
            <NavLink
              to="/"
              className={location.pathname?.includes("/pairs") ? "active" : ""}
              onClick={(event) => {
                event.preventDefault()
                close()
              }}
              style={{ cursor: "not-allowed" }}
            >
              Dashboard
            </NavLink>
            <NavLink to="/swap" onClick={() => close()}>
              Swap
            </NavLink>
            <div style={{ height: 25 }} />
            <ChangeVersionButton />
          </div>
        )}
      </Wrapper>
      <SocialMediaList isOpen={isOpen}>
        {socialMediaList.map((item, index) => (
          <React.Fragment key={item.href}>
            <SocialMediaAnchor
              className="desktop-only"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={item.title}
              style={{ transitionDelay: `${index * 0.06 + 0.125}s` }}
              iconSrc={item.icon}
            />
            <SocialMediaAnchor
              className="mobile-only"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={item.title}
              style={{ transitionDelay: `${index * 0.06 + 0.125}s` }}
              iconSrc={item.iconLight}
            />
          </React.Fragment>
        ))}
      </SocialMediaList>
    </>
  )
}

export default Sidebar
