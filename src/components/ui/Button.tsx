import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ children, className, ...rest }: Props) {
  return (
    <button className={`btn${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </button>
  )
}
