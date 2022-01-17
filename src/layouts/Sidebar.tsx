import React from "react"
import styled, { css } from "styled-components"
import { NavLink as navLink } from "react-router-dom"
import { useModal } from "components/Modal"

import iconMenu from "images/icon-menu.svg"
import iconClose from "images/icon-close-primary.svg"
import iconGitHub from "images/icon-github.svg"
import iconTwitter from "images/icon-twitter.svg"
import iconDiscord from "images/icon-discord.svg"
import iconDocuments from "images/icon-docs.svg"

import iconGitHubLight from "images/icon-github-primary.svg"
import iconTwitterLight from "images/icon-twitter-primary.svg"
import iconDiscordLight from "images/icon-discord-primary.svg"
import iconDocumentsLight from "images/icon-docs-primary.svg"

const socialMediaList = [
  {
    icon: iconGitHub,
    iconLight: iconGitHubLight,
    href: "https://github.com/terraswap",
    title: "GitHub",
  },
  {
    icon: iconTwitter,
    iconLight: iconTwitterLight,
    href: "https://twitter.com/terraswap_io",
    title: "Twitter",
  },
  {
    icon: iconDiscord,
    iconLight: iconDiscordLight,
    href: "https://discord.gg/hAKrQ88Ggp",
    title: "Discord",
  },
  {
    icon: iconDocuments,
    iconLight: iconDocumentsLight,
    href: "https://docs.terraswap.io/",
    title: "Documents",
  },
]

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

const MobileButton = styled.button<{ isOpen?: boolean }>`
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

const SocialMediaAnchor = styled.a`
  width: auto;
  height: auto;
  position: relative;
  display: inline-block;
  padding: 0;
  margin: 0;
  text-decoration: none;
  color: #ffffff;
  cursor: pointer;

  & > img {
    width: 24px;
    height: 24px;
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
            to="/"
            exact
            isActive={(match, location) => {
              return location.pathname?.includes("/pairs") ||
                location.pathname === "/"
                ? true
                : false
            }}
            onClick={() => close()}
          >
            Dashboard
          </NavLink>
          <NavLink to="/swap" exact onClick={() => close()}>
            Swap
          </NavLink>
        </div>
      </Wrapper>
      <SocialMediaList isOpen={isOpen}>
        {socialMediaList.map((item, index) => (
          <SocialMediaAnchor
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            style={{ transitionDelay: `${index * 0.06 + 0.125}s` }}
          >
            <img className="desktop-only" src={item.icon} alt={item.title} />
            <img
              className="mobile-only"
              src={item.iconLight}
              alt={item.title}
            />
          </SocialMediaAnchor>
        ))}
      </SocialMediaList>
    </>
  )
}

export default Sidebar
