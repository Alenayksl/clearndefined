
'use client'

import React from 'react'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function MyButton({
  children,
  onClick,
  type = 'button',
  disabled = false
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded shadow-md transition-all duration-200 font-extralight
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  )
}
