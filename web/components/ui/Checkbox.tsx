'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            className={`
              w-4 h-4 text-blue-600 border-gray-300 rounded
              focus:ring-2 focus:ring-primary focus:ring-offset-2
              transition-colors cursor-pointer
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          {label && (
            <span className={`ml-2 text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}>
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox

