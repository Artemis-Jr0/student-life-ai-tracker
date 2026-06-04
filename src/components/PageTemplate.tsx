import React from 'react'

interface Page TemplateProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
}

function PageTemplate({ title, subtitle, children, action }: PageTemplateProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default PageTemplate
