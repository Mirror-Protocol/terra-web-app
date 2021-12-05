import { GetTokenSvg } from "helpers/token"
import React, { CSSProperties, useEffect, useState } from "react"
import { tokenInfos } from "rest/usePairs"
import styled from "styled-components"

type AssetIconProps = {
  address?: string
  alt?: string
  style?: CSSProperties
}

const Wrapper = styled.div`
  width: 25px;
  height: 25px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  border-radius: 50%;
  background-color: #ffffff;
`

const AssetIcon: React.FC<AssetIconProps> = ({ address, alt, style }) => {
  const [icon, setIcon] = useState("")
  useEffect(() => {
    const tokenInfo = tokenInfos.get(address || "")
    setIcon(GetTokenSvg(tokenInfo?.icon || "", tokenInfo?.symbol || ""))
  }, [address])
  return <Wrapper style={{ backgroundImage: `url('${icon}')`, ...style }} />
}

export default AssetIcon
