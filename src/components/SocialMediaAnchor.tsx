import React from "react"
import styled from "styled-components"

const Wrapper = styled.a`
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

type SocialMediaAnchorProps = Partial<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> & { iconSrc?: string }

const SocialMediaAnchor: React.FC<SocialMediaAnchorProps> = ({
  iconSrc,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <img className="desktop-only" src={iconSrc} alt={props.title} />
      <img className="mobile-only" src={iconSrc} alt={props.title} />
    </Wrapper>
  )
}

export default SocialMediaAnchor
