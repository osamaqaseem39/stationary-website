'use client'

import { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      )}
      {(actionLabel && (actionHref || onAction)) && (
        <Button asChild={!!actionHref} href={actionHref} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

