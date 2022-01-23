import React from "react"
import styled from "styled-components"
import styles from "./Footer.module.scss"

import SocialMediaAnchor from "components/SocialMediaAnchor"
import { socialMediaList } from "constants/constants"

const SocialMediaAnchorList = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  text-align: center;
  padding: 30px;
  display: flex;
  gap: 25px;
  align-items: center;
  justify-content: center;
`

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <SocialMediaAnchorList className="mobile-only">
        {socialMediaList.map((item) => (
          <SocialMediaAnchor
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            iconSrc={item.icon}
          />
        ))}
      </SocialMediaAnchorList>
    </footer>
  )
}

export default Footer
