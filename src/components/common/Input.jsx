import React from 'react'

const Input = ({ 
  type = 'text',
  label,
  placeholder = '',
  value = '',
  onChange,
  error = null,
  helperText = '',
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = !!error
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlCharSet="utf-8"
          className="block text-sm font-medium text-muted mb-1"
        >
          {label}
          {error && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-4 py-2 border border-muted/50 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-${hasError ? 'danger' : 'primary'} 
            focus:border-transparent
            ${hasError ? 'border-danger' : ''}
            ${disabled ? 'bg-muted/20 cursor-not-allowed' : ''}`}
          {...props}
        />
        
        {/* Show eye icon for password fields */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-2 flex items-center text-muted hover:text-primary pointer-events-none"
            disabled={disabled}
          >
            Show
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-muted">{helperText}</p>
      )}
    </div>
  )
}

export default Input
