import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  type = 'button',
  ...rest
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2'
  const variantClasses = variant === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-400'

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}
