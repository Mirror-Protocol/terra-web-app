import iconArrowLeft from "images/icon-arrow-left.svg"
import iconArrowLeftPrimary from "images/icon-arrow-left-primary.svg"
import styled from "styled-components"

const Button = styled.button`
  width: 100%;
  height: auto;
  position: relative;
  background-color: transparent;
  padding: 9px;
  border-radius: 10px;
  border: solid 1px #fff;
  min-width: 155px;

  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;

  letter-spacing: normal;
  color: #fff;

  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  white-space: nowrap;

  &::before {
    content: "";
    display: inline-block;

    width: 13.9px;
    height: 10.4px;
    display: inline-block;

    margin-right: 6.1px;

    background-image: url(${iconArrowLeft});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;

    transition: background-image 0.1s step-end;
  }

  &:hover {
    background-color: #ffffff;
    color: #0222ba;
    &::before {
      background-image: url(${iconArrowLeftPrimary});
    }
  }
`

const ChangeVersionButton = ({
  href = "https://app.terraswap.io",
  buttonText = "Go to Terraswap",
}) => {
  return (
    <a href={href}>
      <Button type="button">{buttonText}</Button>
    </a>
  )
}

export default ChangeVersionButton
