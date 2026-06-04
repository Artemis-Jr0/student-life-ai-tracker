import React from 'react'
import { AlertCircle, CheckCircle, InfoIcon, XCircle } from 'lucide-react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title: string
  message?: string
  onClose?: () => void
}

const alertStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    message: 'text-green-800',
    Icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    message: 'text-red-800',
    Icon: XCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    message: 'text-yellow-800',
    Icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    message: 'text-blue-800',
    Icon: InfoIcon,
  },
}

function Alert({ type, title, message, onClose }: AlertProps) {
  const style = alertStyles[type]
  const Icon = style.Icon

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 flex gap-4 items-start animate-slide-up`}>
      <Icon className={`${style.icon} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        <h3 className={`${style.title} font-semibold`}>{title}</h3>
        {message && <p className={`${style.message} text-sm mt-1`}>{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.icon} flex-shrink-0 hover:opacity-75 transition-opacity`}
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  )
}

export default Alert
