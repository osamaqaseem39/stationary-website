'use client'

import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center text-sm text-gray-600 flex-wrap gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-gray-900">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
              {!isLast && (
                <span className="mx-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}


