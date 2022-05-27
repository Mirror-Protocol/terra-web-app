import React from "react"
import styled from "styled-components"
import styles from "./Footer.module.scss"

import SocialMediaAnchor from "components/SocialMediaAnchor"
import { socialMediaList } from "constants/constants"
import ChangeVersionButton from "components/ChangeVersionButton"

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
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 25 }}
        className="mobile-only"
      >
        <div style={{ display: "inline-block", maxWidth: 155, flex: 1 }}>
          <ChangeVersionButton />
        </div>
      </div>
      <SocialMediaAnchorList className="mobile-only">
        {socialMediaList.map((item) => (
          <SocialMediaAnchor
            key={item.href}
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
