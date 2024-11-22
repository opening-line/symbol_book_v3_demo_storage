import React from "react"

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  color?: Color
  type?: 'submit' | 'reset' | 'button'
  disabled?: boolean
}

type Color = 'gray' | 'blue' | 'green' | 'red'

function getClassName(color: Color) {
  const classes = ['rounded-xl', 'min-w-40', 'min-h-16']
  switch (color) {
    case 'red':
      classes.push('bg-red-500')
      classes.push('hover:bg-red-600')
      classes.push('text-white')
      break
    case 'green':
      classes.push('bg-green-500')
      classes.push('hover:bg-green-600')
      classes.push('text-white')
      break
    case 'blue':
      classes.push('bg-blue-500')
      classes.push('hover:bg-blue-600')
      classes.push('text-white')
      break
    default:
      classes.push('bg-gray-300')
      classes.push('hover:bg-gray-400')
      break
  }
  return classes.join(' ')
}

const Button: React.FC<ButtonProps> = ({ children, onClick, color = 'gray', type = 'button', disabled = false }) => {
  return (
    <button className={getClassName(color)} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
