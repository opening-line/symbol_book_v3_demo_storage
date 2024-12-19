import React from "react"
import { Button as HeadlessUiButton } from "@headlessui/react"
import styles from "./Button.module.css"

interface ButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  color?: Color
  type?: "submit" | "reset" | "button"
  disabled?: boolean
}

type Color = "gray" | "blue" | "green" | "red"

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = "gray",
  type = "button",
  disabled = false,
}) => {
  const className = `${styles.buttonBase} ${styles[color]}`

  return (
    <HeadlessUiButton
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </HeadlessUiButton>
  )
}

export default Button
